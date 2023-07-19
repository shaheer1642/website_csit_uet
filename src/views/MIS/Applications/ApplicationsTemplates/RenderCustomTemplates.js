/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, Card, Box, CardContent, CardActions, Checkbox, FormControlLabel, TextField, Autocomplete } from "@mui/material";
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
import { convertUpper } from "../../../../extras/functions";

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

class RenderCustomTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchData',

      alertMsg: '',
      alertSeverity: 'warning',

      applicationTemplate: {},

      submit_to_change: false,

      applicationTemplate: this.props.applicationTemplate,

      fields_options: {}
    };
  }

  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
  }
  componentWillUnmount() {
  }

  fetchData = () => {
    console.log('fetchData')
    if (this.state.applicationTemplate.template_id == '6f1a4a0e-fe49-11ed-95ef-0242ac110032') {
      this.setState({callingApi: 'fetchData'})
      socket.emit("students/fetch", {student_id: this.props.user?.user_id}, (res) => {
        if (res.code != 200) return
        const student = res.data[1] || res.data[0]
        socket.emit("studentsCourses/fetch", {student_batch_id: student.student_batch_id}, (res) => {
          if (res.code != 200) return
          const studentCourses = res.data.filter(o => o.grade == 'N')
          console.log('fetchData',studentCourses)
          this.setState(state => ({
            fields_options: {...state.fields_options , studentCourses: studentCourses},

            callingApi: ''
          }))
        })
      });
    }
  }

  courseWithdrawalTemplate = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Autocomplete
            options={this.state.fields_options.studentCourses.map(sc => ({
              teacher_id: sc.teacher_id,
              label: `(${sc.course_id}) ${sc.course_name} | ${convertUpper(sc.semester_season)} ${sc.semester_year}`
            }))}
            getOptionLabel={(option) => option.label}
            // value={this.getFieldValue('Course title')}
            renderInput={(params) => ( <TextField required {...params} variant="outlined" label="Course Title" color='primary' /> )}
            onChange={(e,option) => this.updateField('Course title', option.label, option.teacher_id)}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            required
            fullWidth
            variant="filled"
            multiline={true}
            rows={4}
            label="Reason"
            value={this.getFieldValue('Reason')}
            onChange={(e) => this.updateField('Reason', e.target.value)}
          />
        </Grid>
      </Grid>
    )
  }

  getFieldValue = (field_name) => {
    return this.state.applicationTemplate.detail_structure.filter(field => field.field_name == field_name)[0]?.field_value
  }

  updateField = (field_name,field_value, ...extras) => {
    var applicationTemplate = this.state.applicationTemplate
    applicationTemplate.detail_structure = applicationTemplate.detail_structure.map(field => {
      return field.field_name == field_name ? {
        ...field, field_value: field_value
      } : field
    })
    if (field_name == 'Course title') {
      applicationTemplate.submit_to = extras[0]
    }
    return this.setState({
      applicationTemplate: applicationTemplate
    }, () => this.props.onChange(applicationTemplate))
  }

  render() {
    return (
      this.state.callingApi == 'fetchData' ? <CircularProgress /> 
      : this.state.applicationTemplate.template_id == '6f1a4a0e-fe49-11ed-95ef-0242ac110032' ? this.courseWithdrawalTemplate() 
      : <Typography>Error creating template</Typography>
    );
  }
}

export default withRouter(RenderCustomTemplates);
