/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import GoBackButton from "../../../../components/GoBackButton";
import CustomCard from "../../../../components/CustomCard";
import ContextInfo from "../../../../components/ContextInfo";
import { convertUpper } from "../../../../extras/functions";

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

class MisSemestersCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSemesterCourses: true,
      semestersCoursesArr: [],

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    };
    this.semester_id = this.props.location.state.semester_id
    this.context_info = this.props.location.state.context_info
  }

  componentDidMount() {
    this.fetchSemesterCourses();
    socket.addEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }


  semestersCoursesListenerChanged = (data) => {
    this.fetchSemesterCourses()
  }

  fetchSemesterCourses = () => {
    socket.emit("semestersCourses/fetch", { semester_id: this.semester_id }, (res) => {
      if (res.code == 200) {
        return this.setState({
          semestersCoursesArr: res.data,
          loadingSemesterCourses: false,
        });
      }
    });
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    })
  }

  render() {
    const columns = [
      { id: "course_id", label: "Course ID", format: (value) => value },
      { id: "course_name", label: "Course Title", format: (value) => value },
      { id: "credit_hours", label: "Credit Hours", format: (value) => value },
      { id: "department_name", label: "Department", format: (value) => value },
      { id: "course_type", label: "Course Type", format: (value) => convertUpper(value) },
      { id: "teacher_name", label: "Instructor Name", format: (value) => value },
      { id: "registered_students", label: "Total Students", format: (value) => value },
    ];
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <ContextInfo contextInfo={this.context_info} />
        </Grid>
        <Grid item xs={12}>
          <CustomCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Courses
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  loadingState={this.state.loadingSemesterCourses}
                  viewButtonLabel='Manage Students'
                  onViewClick={(semesterCourse) =>
                    this.props.navigate('students', {
                      state: {
                        sem_course_id: semesterCourse.sem_course_id,
                        context_info: { ...semesterCourse, ...this.context_info }
                      }
                    })
                  }
                  onRowClick={(semesterCourse) =>
                    this.props.navigate('students', {
                      state: {
                        sem_course_id: semesterCourse.sem_course_id,
                        context_info: { ...semesterCourse, ...this.context_info }
                      }
                    })
                  }
                  onEditClick={(semesterCourse) =>
                    this.props.navigate('update', {
                      state: {
                        sem_course_id: semesterCourse.sem_course_id,
                        context_info: { ...semesterCourse, ...this.context_info }
                      }
                    }
                    )
                  }
                  onDeleteClick={(semesterCourse) => {
                    this.setState({
                      confirmationModalShow: true,
                      confirmationModalMessage: 'Are you sure you want to remove this course?',
                      confirmationModalExecute: () => socket.emit('semestersCourses/delete', { sem_course_id: semesterCourse.sem_course_id })
                    })
                  }}
                  rows={this.state.semestersCoursesArr}
                  columns={columns}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  onClick={() => this.props.navigate("create", { state: { semester_id: this.semester_id } })}
                  label="Create New"
                />
              </Grid>
              <ConfirmationModal
                open={this.state.confirmationModalShow}
                message={this.state.confirmationModalMessage}
                onClose={() => this.confirmationModalDestroy()}
                onClickNo={() => this.confirmationModalDestroy()}
                onClickYes={() => {
                  this.state.confirmationModalExecute()
                  this.confirmationModalDestroy()
                }}
              />
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisSemestersCourses);
