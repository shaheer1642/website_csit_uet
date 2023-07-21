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
import RenderCustomTemplates from "./ApplicationsTemplates/RenderCustomTemplates";

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

class SubmitApplicationDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      alertMsg: '',
      alertSeverity: 'warning',

      applicationTemplate: {},

      submit_to_change: false,

      callingApi: false
    };
    this.template_id = this.props.location.state?.template_id
  }

  componentDidMount() {
    if (!this.template_id) this.props.navigate(-1)
    this.fetchApplicationTemplate()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }
  componentWillUnmount() {
  }

  fetchApplicationTemplate = () => {
    this.setState({ loading: true })
    socket.emit("applicationsTemplates/fetch", { template_id: this.template_id }, (res) => {
      this.setState({ loading: false })
      if (res.code == 200 && res.data.length == 1) {
        const applicationTemplate = res.data[0]
        console.log('fetchApplicationTemplate', applicationTemplate)
        return this.setState({
          applicationTemplate: applicationTemplate,
          submit_to_change: applicationTemplate.submit_to ? false : true
        });
      } else {
        this.template_id = null
      }
    });
  }

  updateField = (key, value, index) => {
    var applicationTemplate = this.state.applicationTemplate
    applicationTemplate.detail_structure[index][key] = value
    return this.setState({
      applicationTemplate: applicationTemplate
    })
  }

  submitApplication = () => {
    this.setState({ callingApi: true })
    socket.emit('applications/create', {
      application_title: this.state.applicationTemplate.application_title,
      detail_structure: this.state.applicationTemplate.detail_structure,
      submitted_to: this.state.applicationTemplate.submit_to,
    }, (res) => {
      this.setState({ callingApi: false })
      if (res.code == 200) {
        this.setState({
          alertMsg: 'Application has been submitted!',
          alertSeverity: 'success'
        })
        this.fetchApplicationTemplate()
      } else {
        this.setState({
          alertMsg: `Error: ${res.message}`,
          alertSeverity: 'warning'
        })
      }
    })
  }

  renderCustomTemplate = (application_title) => {
    if (application_title.toLowerCase() == 'course withdrawal') {
      return (
        <React.Fragment>

        </React.Fragment>
      )
    }
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
        <CustomCard>
          <Grid container spacing={2}>
            <GoBackButton context={this.props.navigate} />
            <Grid item xs={12}>
              <Typography variant='h4'>{this.state.applicationTemplate.application_title}</Typography>
            </Grid>
            {this.state.applicationTemplate.is_custom ?
              <Grid item xs={12}>
                <RenderCustomTemplates applicationTemplate={this.state.applicationTemplate} onChange={(applicationTemplate) => this.setState({ applicationTemplate: applicationTemplate })} />
              </Grid> :
              <React.Fragment>
                {this.state.applicationTemplate.detail_structure.map((field, index) =>
                  <Grid key={index} item xs={field.multi_line ? 12 : 6}>
                    {field.field_type == 'string' ?
                      <CustomTextField multiline={field.multi_line} rows={field.multi_line ? 4 : 1} fullWidth={field.multi_line} placeholder={field.placeholder} variant='filled' label={field.field_name} disabled={field.disabled} required={field.required} value={field.field_value} onChange={(e) => this.updateField('field_value', e.target.value, index)} />
                      : 'Field type could not be determined'
                    }
                  </Grid>
                )}
                {this.state.submit_to_change ?
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='h4'>Submit to</Typography>
                      </Grid>
                      <Grid item xs={'auto'}>
                        <CustomSelect
                          label="Submit to"
                          fieldType='select'
                          endpoint='autocomplete/users'
                          endpointData={{
                            exclude_user_types: this.state.applicationTemplate.submit_to_type == 'teacher_only' ? ['admin', 'pga', 'student'] : ['student'],
                            exclude_user_ids: [this.props.user?.user_id]
                          }}
                          sx={{ minWidth: '150px' }}
                          onChange={(e, option) => this.setState({ submit_to: option.id })}
                          value={this.state.applicationTemplate.submit_to}
                        />
                      </Grid>
                    </Grid>
                  </Grid> : <></>
                }
              </React.Fragment>
            }
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton
                variant="contained"
                disabled={this.state.callingApi ? true : false}
                label={this.state.callingApi ? <CircularProgress color="secondary" size='20px' /> : "Submit Application"}
                onClick={this.submitApplication} />
            </Grid>
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(SubmitApplicationDraft);
