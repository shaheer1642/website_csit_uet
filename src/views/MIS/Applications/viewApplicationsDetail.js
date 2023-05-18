/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, Card, Box, CardContent, CardActions, Checkbox, FormControlLabel, TextField } from "@mui/material";
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
      loading: false,

      alertMsg: '',
      alertSeverity: 'warning',

      application_title: '',
      detail_structure: [],
      submit_to: '',

      callingApi: false
    };
    this.application_id = this.props.location.state?.application_id
  }

  componentDidMount() {
    if (!this.application_id) this.props.navigate(-1)
    this.fetchApplication()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state)
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({alertMsg: ''})
    }, 3000);
  }
  componentWillUnmount() {
  }

  fetchApplication = () => {
    this.setState({loading: true})
    socket.emit("applications/fetch", {application_id: this.application_id}, (res) => {
      this.setState({loading: false})
      if (res.code == 200 && res.data.length == 1) {
        const application = res.data[0]
        console.log(application)
        return this.setState({
          detail_structure: application.detail_structure,
          submit_to: application.submitted_to,
          application_title: application.application_title,
        });
      }
    });
  }

  updateField = (key,value,index) => {
    return this.setState(state => {
        const detail_structure = state.detail_structure.map((field, i) => {
          if (i === index) {
            field[key] = value
            return field
          }
          else return field
        });
        return {
          detail_structure,
        }
    });
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
          <Typography variant='h4'>{this.state.application_title}</Typography>
        </Grid>
        {this.state.detail_structure.map((field,index) => 
          <Grid item xs={field.multi_line ? 12 : 'auto'}>
            {field.field_type == 'string' ? 
              <CustomTextField multiline={field.multi_line} rows={field.multi_line ? 4 : 1} sx={{width: field.multi_line ? '80%' : undefined}} variant='filled' label={field.field_name} disabled={field.disabled} required={field.required} value={field.field_value} onChange={(e) => this.updateField('field_value',e.target.value,index)}/>
              : 'Ehllo'
            }
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h4'>Submit to</Typography>
            </Grid>
            <Grid item xs={'auto'}>
              <CustomSelect
                label= "Submit to"
                fieldType= 'select'
                menuItems={[{id: '',label: 'None'}]}
                endpoint= 'autocomplete/faculty'
                sx={{minWidth: '150px'}}
                onChange={(e) => this.setState({submit_to: e.target.value})}
                value={this.state.submit_to}
                disabled={true}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton 
            variant="contained" 
            label={this.state.callingApi ? <CircularProgress color="secondary" size='20px'/> : "Submit Application"} 
            />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(viewApplicationsDetail);
