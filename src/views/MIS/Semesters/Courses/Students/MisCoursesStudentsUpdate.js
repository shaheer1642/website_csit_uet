/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  Zoom,
  Alert,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled, lighten, darken } from '@mui/system';
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../../websocket/socket";
import { withRouter } from "../../../../../withRouter";
import CustomTable from "../../../../../components/CustomTable";
import CustomButton from "../../../../../components/CustomButton";
import CustomModal from "../../../../../components/CustomModal";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import GoBackButton from "../../../../../components/GoBackButton";
import CustomMultiAutocomplete from "../../../../../components/CustomMultiAutocomplete";
import LoadingIcon from "../../../../../components/LoadingIcon";
import CustomCard from "../../../../../components/CustomCard";
import CustomSelect from "../../../../../components/CustomSelect";
import { getUserNameById } from "../../../../../objects/Users_List";
import { timeLocale } from "../../../../../objects/Time";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)",
    ],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
};

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

class MisCoursesStudentsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentCourse: {},
      alertMsg: '',
      alertSeverity: '',
      callingApi: false,
      
      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => {},
    };

    this.course_name = this.props.location.state.course_name
    this.semester_name = this.props.location.state.semester_name
    this.student_info = this.props.location.state.student_info

    this.sem_course_id = this.props.location.state.sem_course_id
    this.student_batch_id = this.props.location.state.student_batch_id

    this.timeoutAlertRef = null
  }

  componentDidMount() {
    this.fetchStudentCourse();
    socket.addEventListener('studentsCourses/listener/changed', this.studentCourseListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('studentsCourses/listener/changed', this.studentCourseListenerChanged)
  }

  studentCourseListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id && data.student_batch_id == this.student_batch_id) this.fetchStudentCourse()
  }

  fetchStudentCourse = () => {
    this.setState({loading: true})
    socket.emit("studentsCourses/fetch", {sem_course_id: this.sem_course_id, student_batch_id: this.student_batch_id}, (res) => {
      if (res.code == 200 && res.data.length == 1) {
        return this.setState({
          studentCourse: res.data[0],
          loading: false,
        });
      }
    });
  }

  withdrawCourse = () => {
    this.setState({callingApi: true})
    socket.emit("studentsCourses/updateGrade", {sem_course_id: this.sem_course_id, student_batch_id: this.student_batch_id, grade: 'W'}, (res) => {
      this.setState({callingApi: false})
      if (res.code == 200) {
        return this.setState({
          alertMsg: res.code == 200 ? 'Course withdrawn' : `${res.status}: ${res.message}`,
          alertSeverity: res.code == 200 ? 'success':'warning'
        });
      }
    });
  }
  
  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 5000)
  }

  render() {
    const columns = [
      { id: "reg_no", label: "Reg #", format: (value) => value },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "student_gender", label: "Gender", format: (value) => value },
      { id: "batch_no", label: "Batch #", format: (value) => value },
      { id: "degree_type", label: "Degree", format: (value) => value },
    ];
    return (
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
        {
          this.state.loading ? <LoadingIcon />:
          <CustomCard cardContent={
            <React.Fragment>
              <Typography variant="h2" sx={{ margin: "10px" }}>
                {`${this.course_name} (${this.semester_name})`}
              </Typography>
              <Typography variant="h4" sx={{ margin: "10px" }}>
                {this.student_info}
              </Typography>
              <Typography sx={{ margin: "10px" }}>
                Current Grade: {this.state.studentCourse.grade}
              </Typography>
              <Typography variant='h5' sx={{ margin: "10px" }}>
                Grade Logs
              </Typography>
              {this.state.studentCourse.grade_change_logs.map(log => 
                <Typography sx={{ margin: "20px" }}>
                  Grade {log.split(' ')[2]} assigned by {getUserNameById(log.split(' ')[1])} on {new Date(Number(log.split(' ')[0])).toLocaleDateString(...timeLocale)}
                </Typography>
              )}
              <Grid item xs={12} sx={{ margin: "10px" }}>
                <CustomButton
                  variant="outlined"
                  label={this.state.callingApi ? <CircularProgress size='20px' />  : "Withdraw Course"}
                  disabled={this.state.callingApi || this.state.studentCourse.grade == 'W'}
                  color="error"
                  onClick={() => 
                    this.setState({
                      confirmationModalShow: true,
                      confirmationModalMessage:
                        "Are you sure you want to withdraw the course for this student?",
                      confirmationModalExecute: () => this.withdrawCourse()
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ margin: "10px" }}>
                <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
                  <Alert variant= "outlined" severity={this.state.alertSeverity}>{this.state.alertMsg}</Alert>
                </Zoom>
              </Grid>
            </React.Fragment>
          }/>
        }
        </Grid>
        <ConfirmationModal
            open={this.state.confirmationModalShow}
            message={this.state.confirmationModalMessage}
            onClose={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })}
            onClickNo={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })}
            onClickYes={() => {
              this.state.confirmationModalExecute();
              this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })
            }}
          />
        </Grid>
    );
  }
}

export default withRouter(MisCoursesStudentsUpdate);
