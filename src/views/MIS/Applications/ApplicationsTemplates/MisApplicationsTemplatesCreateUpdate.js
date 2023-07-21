/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, Card, Box, CardContent, CardActions, Checkbox, FormControlLabel } from "@mui/material";
import { Add, Cancel, DeleteOutline, Menu } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import CustomSelect from "../../../../components/CustomSelect";
import { IndexKind } from "typescript";
import CustomAlert from "../../../../components/CustomAlert";
import GoBackButton from "../../../../components/GoBackButton";
import CustomMultiAutocomplete from "../../../../components/CustomMultiAutocomplete";

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

class MisApplicationsTemplatesCreateUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      applicationsTemplatesArr: [],

      alertMsg: '',
      alertSeverity: 'warning',

      application_title: '',
      detail_structure: [],
      degree_type: '',
      submit_to: '',
      visibility: [],

      callingApi: false
    };
    this.template_id = this.props.location.state?.template_id
  }

  componentDidMount() {
    if (this.template_id) this.fetchApplicationTemplate()
    else this.addNewField()
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
    socket.emit("applicationsTemplates/fetch", { template_id: this.template_id, restrict_visibility: false }, (res) => {
      this.setState({ loading: false })
      if (res.code == 200 && res.data.length == 1) {
        const applicationTemplate = res.data[0]
        console.log(applicationTemplate)
        return this.setState({
          detail_structure: applicationTemplate.detail_structure,
          submit_to: applicationTemplate.submit_to,
          degree_type: applicationTemplate.degree_type,
          application_title: applicationTemplate.application_title,
          visibility: applicationTemplate.visibility
        });
      } else {
        this.template_id = null
      }
    });
  }

  addNewField = () => {
    this.setState({
      detail_structure: [...this.state.detail_structure, { field_name: '', field_value: '', placeholder: '', field_type: 'string', disabled: false, required: true, multi_line: false }]
    })
  }

  removeField = (index) => {
    this.setState({
      detail_structure: this.state.detail_structure.filter((field, i) => i != index)
    })
  }

  updateField = (key, value, index) => {
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

  submitCreateTemplate = () => {
    this.setState({ callingApi: true })
    socket.emit('applicationsTemplates/create', {
      detail_structure: this.state.detail_structure,
      degree_type: this.state.degree_type,
      submit_to: this.state.submit_to,
      application_title: this.state.application_title,
      visibility: this.state.visibility
    }, (res) => {
      this.setState({ callingApi: false })
      if (res.code == 200) {
        this.setState({
          alertMsg: 'Template created',
          alertSeverity: 'success'
        })
      } else {
        this.setState({
          alertMsg: `Error: ${res.message}`,
          alertSeverity: 'warning'
        })
      }
    })
  }

  submitUpdateTemplate = () => {
    this.setState({ callingApi: true })
    socket.emit('applicationsTemplates/update', {
      template_id: this.template_id,
      detail_structure: this.state.detail_structure,
      degree_type: this.state.degree_type,
      submit_to: this.state.submit_to,
      application_title: this.state.application_title,
      visibility: this.state.visibility
    }, (res) => {
      this.setState({ callingApi: false })
      console.log(res)
      if (res.code == 200) {
        this.setState({
          alertMsg: 'Template updated',
          alertSeverity: 'success'
        })
      } else {
        this.setState({
          alertMsg: `Error: ${res.message}`,
          alertSeverity: 'warning'
        })
      }
      this.fetchApplicationTemplate()
    })
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
        <CustomCard>
          <Grid container spacing={2}>
            <GoBackButton context={this.props.navigate} />
            <Grid item xs={12}>
              <Typography variant='h4'>Title</Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField required variant="filled" sx={{ width: '80%' }} label="Application Title" value={this.state.application_title} onChange={(e) => this.setState({ application_title: e.target.value })} />
            </Grid>
            <Grid item xs={'auto'}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4'>Degree</Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomSelect
                    label="Degree"
                    sx={{ minWidth: '150px' }}
                    onChange={(e, option) => this.setState({ degree_type: option.id })}
                    menuItems={[{ id: '', label: 'None' }, { id: 'ms', label: 'MS' }, { id: 'phd', label: 'PhD' }]}
                    value={this.state.degree_type}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={'auto'}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4'>Default Receiver</Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomSelect
                    label="Received by"
                    menuItems={[{ id: '', label: 'None' }]}
                    endpoint={['autocomplete/faculty', 'autocomplete/teachers']}
                    endpointData={[{}, { include_roles: ['chairman', 'batch_advisor', 'semester_coordinator'] }]}
                    sx={{ minWidth: '300px' }}
                    onChange={(e, option) => this.setState({ submit_to: option.id })}
                    value={this.state.submit_to}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={'auto'}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h4'>Visibility</Typography>
                </Grid>
                <Grid item xs={'auto'} sx={{ minWidth: '200px' }}>
                  <CustomMultiAutocomplete
                    label="Visibility"
                    menuItems={[{ id: 'admin', label: 'Admin' }, { id: 'pga', label: 'PGA' }, { id: 'student', label: 'Students' }, { id: 'teacher', label: 'Instructors' }]}
                    values={this.state.visibility}
                    onChange={(e, values) => {
                      this.setState({ visibility: values.map(option => option.id) })
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h4'>Fields</Typography>
            </Grid>
            {this.state.detail_structure.map((field, index) => {
              return <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs="auto" alignItems={'center'} display='flex'>
                    <IconButton onClick={() => this.removeField(index)}><Cancel /></IconButton>
                  </Grid>
                  <Grid item xs="auto">
                    <CustomTextField required label="Field Name" value={field.field_name} onChange={(e) => this.updateField('field_name', e.target.value, index)} />
                  </Grid>
                  {field.disabled ?
                    <Grid item xs="auto">
                      <CustomTextField required label="Field value" value={field.field_value} onChange={(e) => this.updateField('field_value', e.target.value, index)} />
                    </Grid> :
                    <Grid item xs="auto">
                      <CustomTextField required label="Placeholder text" value={field.placeholder} onChange={(e) => this.updateField('placeholder', e.target.value, index)} />
                    </Grid>
                  }
                  <Grid item xs="auto">
                    <CustomSelect sx={{ minWidth: '200px' }} required label="Field Type" value={field.field_type} menuItems={[{ id: 'string', label: 'Text' }, { id: 'number', label: 'Number' }]} onChange={(e, option) => this.updateField('field_type', option.id, index)} />
                  </Grid>
                  <Grid item xs="auto">
                    <FormControlLabel control={<Checkbox required checked={field.disabled} onChange={(e) => this.updateField('disabled', e.target.checked, index)} />} label="Disabled" />
                  </Grid>
                  <Grid item xs="auto">
                    <FormControlLabel control={<Checkbox required checked={field.required} onChange={(e) => this.updateField('required', e.target.checked, index)} />} label="Required" />
                  </Grid>
                  {field.field_type == 'string' ?
                    <Grid item xs="auto">
                      <FormControlLabel control={<Checkbox required checked={field.multi_line} onChange={(e) => this.updateField('multi_line', e.target.checked, index)} />} label="Multi-line" />
                    </Grid> : <></>
                  }
                </Grid>
              </Grid>
            })}
            <Grid item xs={12}>
              <CustomButton variant="outlined" label="Add Field" onClick={this.addNewField} startIcon={<Add />} />
            </Grid>
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton
                variant="contained"
                disabled={this.state.callingApi ? true : false}
                label={this.state.callingApi ? <CircularProgress size='20px' color="secondary" /> : this.template_id ? "Save changes" : "Create Template"}
                onClick={this.template_id ? this.submitUpdateTemplate : this.submitCreateTemplate} />
            </Grid>
            {this.template_id ?
              <Grid item xs={'auto'}>
                <CustomButton
                  variant="outlined"
                  label={"Reset"}
                  onClick={this.fetchApplicationTemplate} />
              </Grid> : <></>
            }
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(MisApplicationsTemplatesCreateUpdate);
