/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress,
  Card, Box, CardContent, CardActions, Checkbox, FormControlLabel, TextField, RadioGroup, Radio, Modal
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
import { convertUpper } from "../../../extras/functions";
import { getUserNameById } from "../../../objects/Users_List";
import { timeLocale } from "../../../objects/Time";
import Field from "../../../components/Field";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

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
      remarks: '',

      applicantDetailModalOpen: false
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
      this.setState({ alertMsg: '' })
    }, 3000);
  }
  componentWillUnmount() {
    socket.removeEventListener("applications/listener/insert", this.fetchApplication);
    socket.removeEventListener("applications/listener/update", this.fetchApplication);
    socket.removeEventListener("applications/listener/delete", this.fetchApplication);
  }

  fetchApplication = () => {
    this.setState({ loading: true })
    socket.emit("applications/fetch", { application_id: this.application_id }, (res) => {
      this.setState({ loading: false })
      console.log(res)
      if (res.code == 200 && res.data.length == 1) {
        console.log(res.data)
        this.setState({ application: res.data[0] })
      }
    });
  }

  fieldComponent = (title, body) => {
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
    this.setState({ callingApi: true })
    socket.emit("applications/updateStatus", {
      application_id: this.application_id,
      status: this.state.takeAction,
      remarks: this.state.remarks
    }, (res) => {
      this.setState({ callingApi: false })
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
    this.setState({ callingApi: true })
    socket.emit("applications/forward", {
      application_id: this.application_id,
      forward_to: this.state.forward_to,
      remarks: this.state.remarks
    }, (res) => {
      this.setState({ callingApi: false })
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

  getForwardersList = () => {
    var all_forwards = []
    this.state.application.forwarded_to.map(forward => {
      if (forward.receiver_id == this.props.user.user_id) all_forwards.push(`${getUserNameById(forward.sender_id)} (${forward.status} by you)`)
    })
    return all_forwards
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
        <CustomCard>
          <Grid container spacing={2}>
            <GoBackButton context={this.props.navigate} />
            <Grid item xs={12}>
              <Typography variant='h3' fontWeight={'bold'}>Application #{this.state.application.serial} - {this.state.application.application_title}</Typography>
            </Grid>
            <Grid container item marginLeft={2} spacing={1}>
              <Grid item item xs={12}>
                <Field name="Submitted by" value={getUserNameById(this.state.application.submitted_by)} />
              </Grid>
              <Grid item item xs={12}>
                <Field name="Submitted to" value={getUserNameById(this.state.application.submitted_to)} />
              </Grid>
              {this.state.application.detail_structure.map((field, index) =>
                <Grid key={index} item xs={12}>
                  <Field name={field.field_name} value={field.field_value} />
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' fontWeight={'bold'}>Status</Typography>
            </Grid>
            <Grid item xs={12} marginLeft={2}>
              {this.state.application.status == 'under_review' ?
                <Typography variant='body1'>
                  {`Pending review from 
              ${this.state.application.forwarded_to.some(forward => forward.status == 'under_review') ?
                      getUserNameById(this.state.application.forwarded_to.filter(forward => forward.status == 'under_review')[0].receiver_id)
                      : getUserNameById(this.state.application.submitted_to)}`}
                </Typography> : <Typography variant='body1'>{convertUpper(this.state.application.status)}</Typography>
              }
            </Grid>
            {this.state.application.remarks ?
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant='h5' fontWeight={'bold'}>Final Remarks</Typography>
                </Grid>
                <Grid item xs={12} marginLeft={2} spacing={2}>
                  <Typography variant='body1'>{this.state.application.remarks}</Typography>
                </Grid>
              </React.Fragment> : <></>
            }
            {this.state.application.forwarded_to.some(forward => forward.receiver_id == this.props.user.user_id) ?
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant='h5' fontWeight={'bold'}>Forwarded By</Typography>
                </Grid>
                <Grid item xs={12} marginLeft={2} spacing={2}>
                  {this.getForwardersList().map((str, index) => <Typography key={index} variant='body1'>{str}</Typography>)}
                </Grid>
              </React.Fragment> : <></>
            }
            <Grid item xs={12}>
              <Typography variant='h5' fontWeight={'bold'}>Progress Tracking Logs</Typography>
            </Grid>
            <Grid container item marginLeft={2} spacing={1}>
              <Grid item xs={12}>
                <Typography variant='body1'>Submitted by {getUserNameById(this.state.application.submitted_by)} on {new Date(Number(this.state.application.application_creation_timestamp)).toLocaleDateString(...timeLocale)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1'>Received by {getUserNameById(this.state.application.submitted_to)} on {new Date(Number(this.state.application.application_creation_timestamp)).toLocaleDateString(...timeLocale)}</Typography>
              </Grid>
              {this.state.application.forwarded_to.map((forward, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={12}>
                      <Typography variant='body1'>Forwarded to {getUserNameById(forward.receiver_id)} on {new Date(Number(forward.forward_timestamp)).toLocaleDateString(...timeLocale)} by {getUserNameById(forward.sender_id)} with remarks "{forward.sender_remarks}"</Typography>
                    </Grid>
                    {forward.status != 'under_review' ?
                      <Grid item xs={12}>
                        <Typography variant='body1'>Marked as {forward.status} by {getUserNameById(forward.receiver_id)} on {new Date(Number(forward.completion_timestamp)).toLocaleDateString(...timeLocale)} with remarks "{forward.receiver_remarks}"</Typography>
                      </Grid> : <></>
                    }
                  </React.Fragment>
                )
              })}
              {this.state.application.status != 'under_review' ?
                <Grid item xs={12}>
                  <Typography variant='body1'>Marked as {this.state.application.status} by {getUserNameById(this.state.application.submitted_to)} on {new Date(Number(this.state.application.application_completion_timestamp)).toLocaleDateString(...timeLocale)}  with remarks "{this.state.application.remarks}"</Typography>
                </Grid> : <></>
              }
            </Grid>
            {this.state.application.status != 'under_review' ? <></> :
              ((this.state.application.submitted_to == this.props.user?.user_id && !(this.state.application.forwarded_to.some(forward => forward.status == 'under_review'))) || this.state.application.forwarded_to.some(forward => forward.status == 'under_review' && forward.receiver_id == this.props.user.user_id)) ?
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography variant='h5' fontWeight={'bold'}>Take Action</Typography>
                  </Grid>
                  <Grid container item marginLeft={2} spacing={1}>
                    <Grid item xs={12}>
                      <RadioGroup row value={this.state.takeAction} onChange={(e) => this.setState({ takeAction: e.target.value })}>
                        <FormControlLabel value="approved" control={<Radio />} label="Approve Application" />
                        <FormControlLabel value="rejected" control={<Radio />} label="Reject Application" />
                        <FormControlLabel value="forward" control={<Radio />} label="Forward Application" />
                      </RadioGroup>
                    </Grid>
                    {this.state.takeAction == 'forward' ?
                      <Grid item xs={6}>
                        <CustomSelect
                          required
                          label="Forward to"
                          fieldType='select'
                          endpoint={['autocomplete/faculty', 'autocomplete/teachers']}
                          endpointData={[{}, { include_roles: ['chairman', 'batch_advisor', 'semester_coordinator'] }]}
                          sx={{ minWidth: '150px' }}
                          onChange={(e, option) => this.setState({ forward_to: option.id })}
                          value={this.state.forward_to}
                        />
                      </Grid> : <></>
                    }
                    <Grid item xs={12}></Grid>
                    <Grid item xs={6}>
                      <CustomTextField required variant="filled" value={this.state.remarks} onChange={(e) => this.setState({ remarks: e.target.value })} label="Remarks" />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomButton label="Submit" onClick={() => this.state.takeAction == 'forward' ? this.forwardApplication() : this.submitAction()} />
                    </Grid>
                  </Grid>
                </React.Fragment> : <></>
            }
            {this.state.application.submitted_by != this.props.user.user_id ?
              <Grid item xs={12}>
                <CustomButton label="View Applicant Detail" variant="outlined" onClick={() => this.setState({ applicantDetailModalOpen: true })} />
              </Grid> : <></>
            }
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid>
            <CustomModal
              open={this.state.applicantDetailModalOpen}
              onClose={() => this.setState({ applicantDetailModalOpen: false })}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} justifyContent={'center'} display={'flex'}>
                  <Typography fontWeight={'bold'} variant="h4" sx={{ textDecoration: 'underline' }}>Applicant Detail</Typography>
                </Grid>
                {this.state.application.applicant_detail.map((info) => {
                  return Object.keys(info).filter(key => !['user_id'].includes(key)).map((key, index) => {
                    return (
                      <Grid item key={index} xs={12}>
                        <Field name={convertUpper(key)} value={info[key]} alignment="vertical" />
                      </Grid>
                    )
                  })
                })}
              </Grid>
            </CustomModal>
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(viewApplicationsDetail);
