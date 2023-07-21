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
import ContextInfo from "../../../../../components/ContextInfo";

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
      callingApi: '',

      studentCourse: {},

      alertMsg: '',
      alertSeverity: 'info',

      updatedGrade: '',

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    };

    this.sem_course_id = this.props.location.state.sem_course_id
    this.student_batch_id = this.props.location.state.student_batch_id
    this.context_info = this.props.location.state.context_info

    this.alertTimeout = null
  }

  componentDidMount() {
    this.fetchStudentCourse();
    socket.addEventListener('studentsCourses/listener/changed', this.studentCourseListenerChanged)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  componentWillUnmount() {
    socket.removeEventListener('studentsCourses/listener/changed', this.studentCourseListenerChanged)
  }

  studentCourseListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id && data.student_batch_id == this.student_batch_id) this.fetchStudentCourse()
  }

  fetchStudentCourse = () => {
    this.setState({ loading: true })
    socket.emit("studentsCourses/fetch", { sem_course_id: this.sem_course_id, student_batch_id: this.student_batch_id }, (res) => {
      if (res.code == 200 && res.data.length == 1) {
        return this.setState({
          studentCourse: res.data[0],
          loading: false,
        });
      }
    });
  }

  updateGrade = () => {
    this.setState({ callingApi: 'updateGrade' })
    socket.emit("studentsCourses/updateGrade", { sem_course_id: this.sem_course_id, student_batch_id: this.student_batch_id, grade: this.state.updatedGrade }, (res) => {
      return this.setState({
        alertMsg: res.code == 200 ? 'Grade Updated' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning',
        callingApi: ''
      });
    });
  }

  withdrawCourse = () => {
    this.setState({ callingApi: 'withdrawCourse' })
    socket.emit("studentsCourses/updateGrade", { sem_course_id: this.sem_course_id, student_batch_id: this.student_batch_id, grade: 'W' }, (res) => {
      return this.setState({
        alertMsg: res.code == 200 ? 'Course withdrawn' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning',
        callingApi: ''
      });
    });
  }

  render() {
    const columns = [
      { id: "reg_no", label: "Reg #", format: (value) => value?.toUpperCase() },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "student_gender", label: "Gender", format: (value) => value },
      { id: "batch_no", label: "Batch #", format: (value) => value },
      { id: "degree_type", label: "Degree", format: (value) => value },
    ];
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <ContextInfo contextInfo={this.context_info} overrideIncludeKeys={['student_name', 'student_father_name', 'course_name', 'semester_year', 'semester_season']} />
        </Grid>
        <Grid item xs={12}>
          {
            this.state.loading ? <LoadingIcon /> :
              <CustomCard>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h2">
                      Manage Student Course
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>
                      Current Grade: {this.state.studentCourse.grade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>
                      Grade Logs:
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {this.state.studentCourse.grade_change_logs.map((log, index) =>
                      <Typography key={index} sx={{ marginLeft: "20px" }}>
                        Grade {log.split(' ')[2]} assigned by {getUserNameById(log.split(' ')[1])} on {new Date(Number(log.split(' ')[0])).toLocaleDateString(...timeLocale)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {this.state.studentCourse.grades_locked ? <Typography fontStyle={'italic'}>Grades have been locked for this course</Typography> :
                      this.state.studentCourse.grade == 'W' ? <Typography fontStyle={'italic'}>Grade cannot be changed for this student</Typography> :
                        <CustomSelect
                          sx={{ minWidth: '250px' }}
                          required
                          label="Change Grade"
                          value={this.state.updatedGrade || this.state.studentCourse.grade}
                          menuItems={[
                            { id: 'A', label: 'A' },
                            { id: 'A-', label: 'A-' },
                            { id: 'B+', label: 'B+' },
                            { id: 'B', label: 'B' },
                            { id: 'B-', label: 'B-' },
                            { id: 'C+', label: 'C+' },
                            { id: 'C', label: 'C' },
                            { id: 'C-', label: 'C-' },
                            { id: 'D+', label: 'D+' },
                            { id: 'D', label: 'D' },
                            { id: 'F', label: 'F' },
                            { id: 'I', label: 'I' },
                          ]}
                          onChange={(e, option) => this.setState({ updatedGrade: option.id })}
                        />
                    }
                  </Grid>
                  <Grid item xs={12}>
                    <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                      <Alert variant="outlined" severity={this.state.alertSeverity}>{this.state.alertMsg}</Alert>
                    </Zoom>
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomButton disabled={this.state.studentCourse.grades_locked} label='Assign Grade' callingApiState={this.state.callingApi == 'updateGrade'} onClick={this.updateGrade} />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomButton
                      variant="outlined"
                      callingApiState={this.state.callingApi == 'withdrawCourse'}
                      label={"Withdraw Course"}
                      disabled={this.state.studentCourse.grades_locked || this.state.studentCourse.grade == 'W'}
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
                </Grid>
              </CustomCard>
          }
        </Grid>
        <ConfirmationModal
          open={this.state.confirmationModalShow}
          message={this.state.confirmationModalMessage}
          onClose={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
          onClickNo={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
          onClickYes={() => {
            this.state.confirmationModalExecute();
            this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })
          }}
        />
      </Grid>
    );
  }
}

export default withRouter(MisCoursesStudentsUpdate);
