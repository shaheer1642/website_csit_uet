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

class MisStudentsAndSemesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStudents: true,
      studentsArr: [],
      semestersArr:[],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
    };
    this.batch_id = this.props.location.state.batch_id
    this.batch_name = this.props.location.state.batch_name
  }

  componentDidMount() {
    socket.emit("students/fetch", {batch_id: this.batch_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentsArr: res.data,
          loadingStudents: false,
          loadingSemesters: false,
          confirmationModalShow: false,
          confirmationModalMessage: '',
          confirmationModalExecute: () => {}
        });
      }
    });
    socket.emit("semesters/fetch", {batch_id: this.batch_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          semestersArr: res.data,
          loadingSemesters: false,
          confirmationModalShow: false,
          confirmationModalMessage: '',
          confirmationModalExecute: () => {}
        });
      }
    });

    socket.addEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.addEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.addEventListener('students/listener/delete', this.studentsListenerDelete)
    socket.addEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.addEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.addEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.removeEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.removeEventListener('students/listener/delete', this.studentsListenerDelete)
    socket.removeEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.removeEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.removeEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

  studentsListenerInsert = (data) => {
    return this.setState({
      studentsArr: [data, ...this.state.studentsArr]
    })
  }
  studentsListenerUpdate = (data) => {
    return this.setState(state => {
        const studentsArr = state.studentsArr.map((student, index) => {
          if (student.student_id === data.student_id) return data;
          else return student
        });
        return {
          studentsArr,
        }
    });
  }
  studentsListenerDelete = (data) => {
    return this.setState({
      studentsArr: this.state.studentsArr.filter((student) => student.student_id != data.student_id)
    })
  }
  
  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    })
  }
  ////////////////////////////////
  semestersListenerInsert = (data) => {
    return this.setState({
      semestersArr: [data, ...this.state.semestersArr]
    })
  }
  semestersListenerUpdate = (data) => {
    return this.setState(state => {
        const semestersArr = state.semestersArr.map((semester, index) => {
          if (semester.semester_id === data.semester_id) return data;
          else return semester
        });
        return {
          semestersArr,
        }
    });
  }
  semestersListenerDelete = (data) => {
    return this.setState({
      semestersArr: this.state.semestersArr.filter((semester) => semester.semester_id != data.semester_id)
    })
  }
  


  render() {
    const studentColumns = [
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "reg_no", label: "Registration No", format: (value) => value },
      { id: "student_address", label: "Address", format: (value) => value },
      { id: "student_gender", label: "Gender", format: (value) => value },
      { id: "username", label: "Username", format: (value) => value },
      { id: "password", label: "Password", format: (value) => value }
    ];
    const semesterColumns = [
      { id: "semester_no", label: "Semester No", format: (value) => value },
      { id: "semester_year", label: "Semester Year", format: (value) => value },
      { id: "semester_season", label: "Semester Season", format: (value) => value },

    ];
    return (
      <Grid container>
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Students (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingStudents}
          onRowClick={(student) => this.setState({ modalTitle: student.student_name, modalBody: student.student_address, modalShow: true})}
          onEditClick={(student) => this.props.navigate('studentsupdate', {state: {batch_id: this.batch_id, student_id: student.student_id}})}
          onDeleteClick={(student) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage: 'Are you sure you want to remove this student?',
              confirmationModalExecute: () => socket.emit('students/delete', { student_id: student.student_id })
            })
          }}
          rows={this.state.studentsArr}
          columns={studentColumns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("studentscreate", {state: {batch_id: this.batch_id}})}
          label="Create New"
        />
        <CustomModal
          title={this.state.modalTitle}
          body={this.state.modalBody}
          open={this.state.modalShow}
          onClose={() => this.setState({ modalShow: false })}
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
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Semesters (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingSemesters}
          onRowClick={(semester) => this.setState({ modalTitle: semester.student_name, modalBody: semester.student_address, modalShow: true})}
          onEditClick={(semester) => this.props.navigate('semestersupdate', {state: {batch_id: this.batch_id, student_id: semester.semester_id}})}
          onDeleteClick={(semester) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage: 'Are you sure you want to remove this student?',
              confirmationModalExecute: () => socket.emit('semesters/delete', { semester_id: semester.semester_id })
            })
          }}
          rows={this.state.semestersArr}
          columns={semesterColumns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("semesterscreate", {state: {batch_id: this.batch_id}})}
          label="Create New"
        />
        <CustomModal
          title={this.state.modalTitle}
          body={this.state.modalBody}
          open={this.state.modalShow}
          onClose={() => this.setState({ modalShow: false })}
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
      </Grid>
      
    );
  }
}

export default withRouter(MisStudentsAndSemesters);
