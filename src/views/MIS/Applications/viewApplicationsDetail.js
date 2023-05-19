/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, 
  Card, Box, CardContent, CardActions, Checkbox, FormControlLabel, TextField, RadioGroup, Radio
} from "@mui/material";
import { Add, Cancel, DeleteOutline, Menu } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";
import CustomTextField from "../../../components/CustomTextField";
import CustomSelect from "../../../components/CustomSelect";
import { IndexKind } from "typescript";
import CustomAlert from "../../../components/CustomAlert";
import GoBackButton from "../../../components/GoBackButton";
import { user } from "../../../objects/User";
import { convertUpper } from "../../../extras/functions";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const styles = {
  alertBox: {
    warning: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertWarning, // text color
      borderColor: palletes.alertWarning,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertWarning, // icon color
      },
    },
    success: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertSuccess, // text color
      borderColor: palletes.alertSuccess,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertSuccess, // icon color
      },
    }
  }
}

class viewApplicationsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      callingApi: false,

      application: {},
      forward_to: '',

      alertMsg: '', 
      alertSeverity: 'warning',

      takeAction: '',
      remarks: ''
    };
    this.application_id = this.props.location.state?.application_id
  }

  componentDidMount() {
    if (!this.application_id) this.props.navigate(-1)
    this.fetchApplication()
    socket.addEventListener("applications/listener/insert", this.fetchApplication);
    socket.addEventListener("applications/listener/update", this.fetchApplication);
    socket.addEventListener("applications/listener/delete", this.fetchApplication);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({alertMsg: ''})
    }, 3000);
  }
  componentWillUnmount() {
    socket.removeEventListener("applications/listener/insert", this.fetchApplication);
    socket.removeEventListener("applications/listener/update", this.fetchApplication);
    socket.removeEventListener("applications/listener/delete", this.fetchApplication);
  }

  fetchApplication = () => {
    this.setState({loading: true})
    socket.emit("applications/fetch", {application_id: this.application_id}, (res) => {
      this.setState({loading: false})
      console.log(res)
      if (res.code == 200 && res.data.length == 1) {
        console.log(res.data)
        this.setState({application: res.data[0]})
      }
    });
  }

  fieldComponent = (title,body) => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant='h5'>{title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body1'>{body}</Typography>
        </Grid>
      </Grid>
    )
  }
  
  submitAction = () => {
    this.setState({callingApi: true})
    socket.emit("applications/updateStatus", {
      application_id: this.application_id,
      status: this.state.takeAction,
      remarks: this.state.remarks
    }, (res) => {
      this.setState({callingApi: false})
      if (res.code == 200) {
        this.setState({
          alertMsg: `Marked as ${this.state.takeAction}`,
          alertSeverity: 'success'
        })
      } else {
        this.setState({
          alertMsg: `Error: ${res.message}`,
          alertSeverity: 'warning'
        })
      }
    });
  }

  forwardApplication = () => {
    this.setState({callingApi: true})
    socket.emit("applications/forward", {
      application_id: this.application_id,
      forwarded_to: {
        sender_id: user?.user_id,
        receiver_id: this.state.forward_to,
        sender_remarks: this.state.remarks
      }
    }, (res) => {
      this.setState({callingApi: false})
      if (res.code == 200) {
        this.setState({
          alertMsg: `Application has been forwarded`,
          alertSeverity: 'success'
        })
      } else {
        this.setState({
          alertMsg: `Error: ${res.message}`,
          alertSeverity: 'warning'
        })
      }
    });
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
          <Typography variant='h4'>{this.state.application.application_title}</Typography>
        </Grid>
        <Grid container item xs={12} marginLeft={2} spacing={1}>
          <Grid item xs={'auto'}>
            {this.fieldComponent("Submitted by",this.state.application.submitted_by)}
          </Grid>
          <Grid item xs={'auto'}>
            {this.fieldComponent("Submitted to",this.state.application.submitted_to)}
          </Grid>
          <Grid item xs={12}></Grid>
          {this.state.application.detail_structure.map((field,index) => 
            <Grid item xs={12}>
              {this.fieldComponent(field.field_name,field.field_value)}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h3'>Status</Typography>
        </Grid>
        <Grid item xs={12} marginLeft={2}>
          {this.state.application.status == 'under_review' ?
            <Typography variant='body1'>
              {`Pending review from 
              ${this.state.application.forwarded_to.some(forward => forward.status == 'under_review') ? 
              this.state.application.forwarded_to.filter(forward => forward.status == 'under_review')[0].receiver_id
              : this.state.application.submitted_to}`}
            </Typography> : <Typography variant='body1'>{convertUpper(this.state.application.status)}</Typography>
          }
        </Grid>
        <Grid item xs={12}>
          <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
        </Grid>
        {this.state.application.remarks ? 
          <React.Fragment>
            <Grid item xs={12}>
              <Typography variant='h3'>Final Remarks</Typography>
            </Grid>
            <Grid item xs={12} marginLeft={2}>
              <Typography variant='body1'>{this.state.application.remarks}</Typography>
            </Grid>
          </React.Fragment>:<></>
        }
        <Grid item xs={12}>
          <Typography variant='h3'>Progress Tracking</Typography>
        </Grid>
        <Grid container item xs={12} marginLeft={2}>
          <Grid item xs={12}>
            <Typography variant='body1'>Submitted by {this.state.application.submitted_by} on {new Date(Number(this.state.application.application_creation_timestamp)).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Received by {this.state.application.submitted_to} on {new Date(Number(this.state.application.application_creation_timestamp)).toLocaleDateString()}</Typography>
          </Grid>
          {this.state.application.forwarded_to.map(forward => {
            return (
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant='body1'>Forwarded to {forward.receiver_id} on {new Date(Number(forward.forward_timestamp)).toLocaleDateString()} by {forward.sender_id} with remarks "{forward.sender_remarks}"</Typography>
                </Grid>
                {forward.status != 'under_review' ? 
                <Grid item xs={12}>
                  <Typography variant='body1'>Marked as {forward.status} by {forward.receiver_id} on {new Date(Number(forward.completion_timestamp)).toLocaleDateString()} with remarks "{forward.receiver_remarks}"</Typography>
                </Grid>:<></>
              }
              </React.Fragment>
            )
          })}
          {this.state.application.status != 'under_review' ?
            <Grid item xs={12}>
              <Typography variant='body1'>Marked as {this.state.application.status} by {this.state.application.submitted_to} on {new Date(Number(this.state.application.application_completion_timestamp)).toLocaleDateString()}  with remarks "{this.state.application.remarks}"</Typography>
            </Grid> : <></>
          }
        </Grid>
        {this.state.application.status != 'under_review' ? <></>:
        ((this.state.application.submitted_to == user?.user_id && !(this.state.application.forwarded_to.some(forward => forward.status == 'under_review'))) || this.state.application.forwarded_to.some(forward => forward.status == 'under_review' && forward.receiver_id == user.user_id)) ?
        <React.Fragment>
          <Grid item xs={12}>
            <Typography variant='h3'>Take Action</Typography>
          </Grid>
          <Grid container item xs={12} marginLeft={2} spacing={1}>
              <Grid item xs={12}>
                <RadioGroup row value={this.state.takeAction} onChange={(e) => this.setState({takeAction: e.target.value})}>
                  <FormControlLabel value="completed" control={<Radio />} label="Mark as Completed" />
                  <FormControlLabel value="rejected" control={<Radio />} label="Reject Application" />
                  <FormControlLabel value="forward" control={<Radio />} label="Forward Application" />
                </RadioGroup>
              </Grid>
              {this.state.takeAction == 'forward' ? 
                <Grid item xs={'auto'}>
                  <CustomSelect
                    required
                    label= "Forward to"
                    fieldType= 'select'
                    endpoint= 'autocomplete/faculty'
                    sx={{minWidth: '150px'}}
                    onChange={(e) => this.setState({forward_to: e.target.value})}
                    value={this.state.forward_to}
                  />
                </Grid> : <></>
              }
              <Grid item xs={12}>
                <CustomTextField required variant="filled" value={this.state.remarks} onChange={(e) => this.setState({remarks: e.target.value})} label="Remarks" />
              </Grid>
              <Grid item xs={12}>
                <CustomButton label="Submit" onClick={() => this.state.takeAction == 'forward' ? this.forwardApplication() : this.submitAction()}/>
              </Grid>
          </Grid>
        </React.Fragment> : <></>
        }
      </Grid>
    );
  }
}

export default withRouter(viewApplicationsDetail);
