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
import { socket } from "../../../../../../websocket/socket";
import { withRouter } from "../../../../../../withRouter";
import CustomTable from "../../../../../../components/CustomTable";
import CustomButton from "../../../../../../components/CustomButton";
import CustomModal from "../../../../../../components/CustomModal";
import ConfirmationModal from "../../../../../../components/ConfirmationModal";

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

class MisSemesterCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSemesterCourses: true,
      semesterCoursesArr: [],

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    };
    this.batch_id = this.props.location.state.batch_id
    this.batch_name = this.props.location.state.batch_name
    this.semester_id = this.props.location.state.semester_id
    this.semester_name = this.props.location.state.semester_name
  }

  componentDidMount() {
    this.fetchSemesterCourses();
    socket.addEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.addEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.addEventListener('students/listener/delete', this.studentsListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.removeEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.removeEventListener('students/listener/delete', this.studentsListenerDelete)
  }

  fetchSemesterCourses() {
    socket.emit("studentsCourses/fetchSemesterCourses", {semester_id: this.semester_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          semesterCoursesArr: res.data,
          loadingSemesterCourses: false,
        });
      }
    });
  }

  studentsListenerInsert = (data) => {
  }
  studentsListenerUpdate = (data) => {
  }
  studentsListenerDelete = (data) => {
  }
  
  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    })
  }

  render() {
    const columns = [
      { id: "course_id", label: "Course ID", format: (value) => value },
      { id: "course_name", label: "Course Name", format: (value) => value },
      { id: "departmental", label: "Departmental", format: (value) => value },
      { id: "teacher_name", label: "Teacher", format: (value) => value },
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Courses (${this.semester_name} | ${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingSemesterCourses}
          onRowClick={(semesterCourse) => {}}
          onEditClick={(semesterCourse) => {}}
          onDeleteClick={(semesterCourse) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage: 'Are you sure you want to remove this course?',
              confirmationModalExecute: () => {}
            })
          }}
          rows={this.state.semesterCoursesArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("create", {state: {batch_id: this.batch_id}})}
          label="Create New"
        />
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
    );
  }
}

export default withRouter(MisSemesterCourses);