/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid, Tab, Tabs, Typography,
} from "@mui/material";
import { withRouter } from "../../../withRouter";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import { ArrowBack, ArrowForward, ArrowRight } from "@mui/icons-material";
import { socket } from "../../../websocket/socket";
import CustomAlert from "../../../components/CustomAlert";
import { Navigate } from "react-router";
import MisStudentTranscript from "../Student Dashboard/Transcript/MisStudentTranscript";
import GoBackButton from "../../../components/GoBackButton";
import ContextInfo from "../../../components/ContextInfo";
import CustomCard from "../../../components/CustomCard";
import { convertUpper } from "../../../extras/functions";
import CustomTable from "../../../components/CustomTable";
import { getCache, setCache } from "../../../localStorage";

class MisStudentPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: undefined,
      studentsArr: [],

      tabIndex: 0,
      callingApi: ''
    };
    this.student_batch = this.props.location?.state?.student_batch
  }

  componentDidMount() {
    this.fetchStudents()
  }

  fetchStudents = () => {
    const cachedData = getCache('students/fetch')
    if (cachedData) return this.setState({ studentsArr: cachedData, callingApi: '' })

    this.setState({ callingApi: 'fetchStudents' })
    socket.emit('students/fetch', {}, (res) => {
      if (res.code == 200) {
        this.setState({
          studentsArr: res.data,
          callingApi: ''
        })
        setCache('students/fetch', res.data)
      }
    })
  }

  panels = {
    selectStudent: () => {
      const columns = [
        { id: 'reg_no', label: 'Reg #', format: (value) => value?.toUpperCase() },
        { id: 'student_name', label: 'Student Name', format: (value) => value },
        { id: 'student_father_name', label: 'Father Name', format: (value) => value },
        { id: 'batch_no', label: 'Batch Number', format: (value) => value },
        { id: 'batch_stream', label: 'Batch Stream', format: (value) => convertUpper(value) },
        { id: 'degree_type', label: 'Degree Type', format: (value) => convertUpper(value) },
        { id: 'enrollment_season', label: 'Enrollment Season', format: (value) => convertUpper(value) },
        { id: 'enrollment_year', label: 'Enrollment Year', format: (value) => value },
      ];
      return (
        <CustomCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2">Select Student</Typography>
            </Grid>
            <Grid item xs={'auto'}>
              <Tabs sx={{ border: 2, borderColor: 'primary.main', borderRadius: 5 }} value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({ tabIndex: newIndex })}>
                <Tab label="MS" />
                <Tab label="PhD" />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <CustomTable
                margin="0px"
                loadingState={this.state.callingApi == 'fetchStudents'}
                viewButtonLabel='View Transcript'
                onViewClick={(student) => this.setState({ student })}
                onRowClick={(student) => this.setState({ student })}
                rows={this.state.studentsArr.filter(student => (this.state.tabIndex == 0 && student.degree_type == 'ms') || (this.state.tabIndex == 1 && student.degree_type == 'phd'))}
                columns={columns}
              />
            </Grid>
          </Grid>
        </CustomCard>
      )
    },
    studentPerformance: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomButton variant="outlined" label="Back" startIcon={<ArrowBack />} onClick={() => this.setState({ student: undefined })} />
          </Grid>
          <Grid item xs={12}>
            <ContextInfo contextInfo={this.state.student} />
          </Grid>
          <Grid item xs={12}>
            <MisStudentTranscript student_batch={this.state.student} />
          </Grid>
        </Grid>
      )
    }
  }

  render() {
    return (
      this.state.student ? this.panels.studentPerformance() : this.panels.selectStudent()
    );
  }
}

export default withRouter(MisStudentPerformance);
