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
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";


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

class MisStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStudents: true,
      studentsArr: [],
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
          loadingStudents: false
        });
      }
    });

    socket.addEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.addEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.addEventListener('students/listener/delete', this.studentsListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('students/listener/insert', this.studentsListenerInsert)
    socket.removeEventListener('students/listener/update', this.studentsListenerUpdate)
    socket.removeEventListener('students/listener/delete', this.studentsListenerDelete)
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

  render() {
    const columns = [
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "reg_no", label: "Registration No", format: (value) => value },
      { id: "student_address", label: "Address", format: (value) => value },
      { id: "username", label: "Username", format: (value) => value },
      { id: "password", label: "Password", format: (value) => value }
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Students (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingStudents}
          onRowClick={(student) => this.setState({ modalTitle: student.student_name, modalBody: student.student_address, modalShow: true})}
          onEditClick={(student) => this.props.navigate('update', {state: {batch_id: this.batch_id, student_id: student.student_id}})}
          onDeleteClick={(student) => socket.emit('students/delete', { student_id: student.student_id })}
          rows={this.state.studentsArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("create", {state: {batch_id: this.batch_id}})}
          label="Create New"
        />
        <CustomModal
          title={this.state.modalTitle}
          body={this.state.modalBody}
          open={this.state.modalShow}
          onClose={() => this.setState({ modalShow: false })}
        />
      </Grid>
    );
  }
}

export default withRouter(MisStudent);
