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
import ContextInfo from "../../../../../components/ContextInfo";
import { calculateDegreeExpiry, convertUpper } from "../../../../../extras/functions";
import { getCache, setCache } from "../../../../../localStorage";

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

class MisCoursesStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: false,
      loading: true,
      students: [],
      studentBatchIds: [],
      semesterCourse: {},
      studentsCourses: [],

      alertMsg: '',
      alertSeverity: 'info',

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.context_info = this.props.location.state.context_info

    this.timeoutAlertRef = null
  }

  componentDidMount() {
    this.fetchStudentCourses();
    socket.addEventListener('semestersCourses/listener/changed', this.studentsCoursesListenerChanged)
    socket.addEventListener('studentsCourses/listener/changed', this.studentsCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.studentsCoursesListenerChanged)
    socket.removeEventListener('studentsCourses/listener/changed', this.studentsCoursesListenerChanged)
  }

  studentsCoursesListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id)
      this.fetchStudentCourses()
  }

  fetchStudentCourses = () => {
    console.log('[fetchStudentCourses] called')
    this.setState({ loading: true })
    socket.emit("semestersCourses/fetch", { sem_course_id: this.sem_course_id }, (res) => {
      if (res.code == 200 && res.data.length == 1) {
        const semesterCourse = res.data[0]
        socket.emit("studentsCourses/fetch", { sem_course_id: this.sem_course_id }, (res) => {
          if (res.code == 200) {
            const studentsCourses = res.data
            const studentBatchIds = studentsCourses.map(studentCourse => studentCourse.student_batch_id)
            const students = getCache('students/fetch')
            if (students) return this.setState({ students, semesterCourse, studentBatchIds, studentsCourses, loading: false })
            socket.emit("students/fetch", {}, (res) => {
              if (res.code == 200) {
                const students = res.data
                setCache('students/fetch', students)
                return this.setState({
                  students,
                  semesterCourse,
                  studentBatchIds,
                  studentsCourses,
                  loading: false,
                });
              }
            });
          }
        });
      }
    })
  }

  updateStudentsList = () => {
    this.setState({ callingApi: true })
    socket.emit("studentsCourses/assignStudents", { sem_course_id: this.sem_course_id, student_batch_ids: this.state.studentBatchIds }, (res) => {
      this.setState({ callingApi: false })
      console.log(`[studentsCourses/assignStudents] response`, res)
      this.setState({
        alertMsg: res.code == 200 ? 'Students list updated' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning'
      }, this.timeoutAlert)
    });
  }

  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
  }

  studentsSelectMenu = () => {
    const options = this.state.students
      .filter(student => !this.state.studentBatchIds.includes(student.student_batch_id))
      .map(student => ({
        id: student.student_batch_id,
        label: `${student.student_name} (${student.reg_no || student.cnic}) - ${student.total_credit_hours || 0} CH | ${student.total_core_courses || 0} Cores | ${student.total_elective_courses || 0} Electives ${student.degree_completed ? '[Graduated]' : student.admission_cancelled ? '[Admission Cancelled]' : student.semester_frozen ? '[Semester Frozen]' : ''}`.trim(),
        batch: `Batch#${student.batch_no.toString().padStart(2, '0')} (${convertUpper(student.degree_type)}) ${calculateDegreeExpiry(student) <= new Date().getTime() ? '[Time Barred]' : ''}`.trim(),
        disabled: student.degree_completed || student.admission_cancelled || student.semester_frozen
      }));
    return (
      <Autocomplete
        disablePortal
        options={options.sort((a, b) => b.batch.localeCompare(a.batch))}
        getOptionDisabled={(option) => option.disabled}
        renderInput={(params) => <TextField {...params} label={"Add Student"} />}
        onChange={(e, option) => option.id ? this.setState(state => ({ studentBatchIds: [...state.studentBatchIds, option.id] })) : null}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        groupBy={(option) => option.batch}
      />
    )
  }

  lockCourse = () => {
    socket.emit("semestersCourses/lockChanges", { sem_course_id: this.sem_course_id, student_batch_ids: this.state.studentBatchIds }, (res) => {
      this.setState({
        alertMsg: res.code == 200 ? 'Course Locked' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning'
      }, this.timeoutAlert)
    });
  }

  unlockGrades = () => {
    socket.emit("semestersCourses/unlockGrades", { sem_course_id: this.sem_course_id }, (res) => {
      this.setState({
        alertMsg: res.code == 200 ? 'Course Grades Unlocked' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning'
      }, this.timeoutAlert)
    });
  }

  render() {
    const columns = [
      { id: "reg_no", label: "Reg #", format: (value) => value?.toUpperCase() },
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "batch_no", label: "Batch #", format: (value) => value },
      { id: "degree_type", label: "Degree", format: (value) => convertUpper(value) },
    ];
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <ContextInfo contextInfo={this.context_info} />
        </Grid>
        <Grid item xs={12}>
          {
            this.state.loading ? <LoadingIcon /> :
              <CustomCard>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      Enrolled Students
                    </Typography>
                  </Grid>
                  {
                    this.state.semesterCourse.changes_locked ? <></> :
                      <Grid item xs={6}>
                        {this.studentsSelectMenu()}
                      </Grid>
                  }
                  <Grid item xs={12}>
                    <CustomTable
                      margin="0px"
                      columns={columns}
                      rows={this.state.students.filter(student => this.state.studentBatchIds.includes(student.student_batch_id))}
                      loadingState={this.state.loading}
                      onDeleteClick={this.state.semesterCourse.changes_locked ? undefined : (student) => {
                        this.setState({
                          confirmationModalShow: true,
                          confirmationModalMessage:
                            "Are you sure you want to remove this student?",
                          confirmationModalExecute: () =>
                            this.setState(state => {
                              return {
                                studentBatchIds: state.studentBatchIds.filter(student_batch_id => student_batch_id != student.student_batch_id)
                              }
                            })
                        });
                      }}
                      onRowClick={(student) => this.props.navigate("update", {
                        state: {
                          sem_course_id: this.sem_course_id,
                          student_batch_id: student.student_batch_id,
                          context_info: { ...this.context_info, ...student }
                        },
                      })}
                      onViewClick={(student) => this.props.navigate("update", {
                        state: {
                          sem_course_id: this.sem_course_id,
                          student_batch_id: student.student_batch_id,
                          context_info: { ...this.context_info, ...student }
                        },
                      })}
                      rowSx={(student) => {
                        return this.state.studentsCourses.some(sc => sc.student_batch_id == student.student_batch_id && sc.grade == 'W') ? {
                          backgroundColor: Color.red[100]
                        } : this.state.studentsCourses.some(sc => sc.student_batch_id == student.student_batch_id && sc.is_repeat) ? {
                          backgroundColor: Color.yellow[100]
                        } : undefined
                      }}
                      footerText="Red = Course Withdrawn\nYellow = Repeater"
                      viewButtonLabel="Edit Student Course"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                      <Alert variant="outlined" severity={this.state.alertSeverity}>{this.state.alertMsg}</Alert>
                    </Zoom>
                  </Grid>
                  {this.state.semesterCourse.changes_locked ? <></> :
                    <Grid item container spacing={2}>
                      <Grid item>
                        <CustomButton
                          disabled={this.state.callingApi}
                          onClick={() => this.updateStudentsList()}
                          label={this.state.callingApi ? <CircularProgress size='20px' /> : "Save"}
                        />
                      </Grid>
                      <Grid item>
                        <CustomButton
                          onClick={() => this.fetchStudentCourses()}
                          label="Reset"
                        />
                      </Grid>
                      <Grid item>
                        <CustomButton
                          color='error'
                          variant="outlined"
                          onClick={() =>
                            this.setState({
                              confirmationModalShow: true,
                              confirmationModalMessage:
                                "Are you sure you want to lock this course? This change cannot be undone",
                              confirmationModalExecute: () => this.lockCourse()
                            })
                          }
                          label="Lock Changes"
                        />
                      </Grid>
                      {this.state.semesterCourse.grades_locked ?
                        <Grid item>
                          <CustomButton
                            color='error'
                            variant="outlined"
                            onClick={() =>
                              this.setState({
                                confirmationModalShow: true,
                                confirmationModalMessage:
                                  "Are you sure you want to unlock grades for this course?",
                                confirmationModalExecute: () => this.unlockGrades()
                              })
                            }
                            label="Unlock Grades"
                          />
                        </Grid> : <></>}
                    </Grid>
                  }
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

export default withRouter(MisCoursesStudents);
