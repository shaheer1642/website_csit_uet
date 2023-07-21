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
import { calculateDegreeExpiry, convertTimestampToSeasonYear, convertUpper } from "../../../extras/functions";
import CustomTable from "../../../components/CustomTable";
import { getCache, setCache } from "../../../localStorage";

class MisStudents extends React.Component {
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
    this.setState({ callingApi: 'fetchStudents' })

    const cachedData = getCache('students/fetch')
    if (cachedData) return this.setState({ studentsArr: cachedData, callingApi: '' })

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

  render() {
    const columns = [
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "reg_no", label: "Reg #", format: (value) => value?.toUpperCase() },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "user_email", label: "Email", format: (value) => value },
      { id: "student_address", label: "Home Address", format: (value) => value },
      { id: "student_gender", label: "Gender", format: (value) => convertUpper(value) },
      { id: 'batch_expiration_timestamp', label: 'Degree Expiry', format: (value) => convertTimestampToSeasonYear(value), valueFunc: (row) => calculateDegreeExpiry(row) },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">Students</Typography>
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
              viewButtonLabel='Manage Student'
              onRowClick={(student) => this.props.navigate('manage', { state: { student_batch_id: student.student_batch_id } })}
              onViewClick={(student) => this.props.navigate('manage', { state: { batch_id: this.batch_id, student_id: student.student_id } })}
              rows={this.state.studentsArr.filter(student => (this.state.tabIndex == 0 && student.degree_type == 'ms') || (this.state.tabIndex == 1 && student.degree_type == 'phd'))}
              columns={columns}
            />
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisStudents);
