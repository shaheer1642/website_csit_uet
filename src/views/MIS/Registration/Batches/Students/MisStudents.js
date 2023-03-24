/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  Button,
  Zoom,
  Alert,
  CircularProgress,
  Tooltip
} from "@mui/material";
import { Delete, Edit, Info } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../../websocket/socket";
import { withRouter } from "../../../../../withRouter";
import CustomTable from "../../../../../components/CustomTable";
import CustomButton from "../../../../../components/CustomButton";
import CustomModal from "../../../../../components/CustomModal";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import GoBackButton from "../../../../../components/GoBackButton";
import CustomCard from "../../../../../components/CustomCard";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const defaultStyles = {
  alertBox: {
    warning: {
      width:'100%', 
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
      width:'100%', 
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
  },
}

class MisStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStudents: true,
      studentsArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,

      uploadingStudentsList: false,
      alertMsg: '',
      alertSeverity: 'warning'
    };
    this.batch_id = this.props.location.state.batch_id
    this.batch_name = this.props.location.state.batch_name

    this.timeoutAlertRef = null;
  }

  componentDidMount() {
    socket.emit("students/fetch", {batch_id: this.batch_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentsArr: res.data,
          loadingStudents: false,

          confirmationModalShow: false,
          confirmationModalMessage: '',
          confirmationModalExecute: () => {}
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
  
  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    })
  }

  processStudentsList = async (e) => {
    this.setState({uploadingStudentsList: true})
    console.log('file changed')
    e.preventDefault()
    const reader = new FileReader()
    reader.readAsText(e.target.files[0])
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      const students_info = studentListCsvToJson(text)
      if (students_info.err) {
        return alert(students_info.message)
      }
      console.log(students_info)

      const promises = []
      students_info.forEach(student => {
        promises.push(
          new Promise((resolve,reject) => {
            socket.emit('students/create', {...student, batch_id: this.batch_id}, (res) => {
              resolve(res.code == 200 ? `✔️ Added student ${student.student_name} (${student.reg_no || student.cnic})` : `❌ Error adding student ${student.student_name} (${student.reg_no || student.cnic}): ${res.message}`)
            })
          })
        )
      })
      Promise.all(promises).then(responses => {
        this.setState({
          alertMsg: responses.join('\n'),
          alertSeverity: 'success',
          uploadingStudentsList: false
        }, this.timeoutAlert)
      }).catch(console.error)
    };
    e.target.value = null

    function studentListCsvToJson(csvContent) {
      const rows = csvContent.split('\r\n')
      const attributesIndices = headerIndices(rows[0])
      if (attributesIndices.err) {
        return {
          err: true,
          message: attributesIndices.message
        }
      }
      const students_info = []
      rows.forEach((row, rowIndex) => {
        if (rowIndex == 0) return
        const student_info = {}
        Object.keys(attributesIndices).forEach(key => {
          if (attributesIndices[key] != -1) {
            const attribute = row.split(',')[attributesIndices[key]]
            if (attribute) {
              if (key == 'student_gender') {
                student_info[key] = (attribute == 'm' || attribute == 'male') ? 'male' : (attribute == 'f' || attribute == 'female') ? 'female' : null
              } else {
                student_info[key] = attribute
              }
            }
          }
        })
        if ((student_info.cnic || student_info.reg_no) && student_info.student_name && student_info.student_gender)
          students_info.push(student_info)
      })

      return students_info

      function headerIndices(headers) {
        const attributes = {
          cnic: -1,
          reg_no: -1,
          student_name: -1,
          student_father_name: -1,
          student_gender: -1,
          student_address: -1,
          student_email: -1,
        }
        headers.split(',').forEach((col,index) => {
          col = col.toLowerCase()
          if (col.match('cnic'))
            attributes.cnic = index
          if (col.match('registration'))
            attributes.reg_no = index
          if (col.match('name'))
            attributes.student_name = index
          if (col.match('father name'))
            attributes.student_father_name = index
          if (col.match('gender'))
            attributes.student_gender = index
          if (col.match('email'))
            attributes.student_email = index
          if (col.match('address'))
            attributes.student_address = index
        })
        if (attributes.cnic == -1 && attributes.reg_no == -1) {
          return {
            err: true,
            message: 'Could not determine "CNIC" or "Reg#" column'
          }
        }
        if (attributes.student_name == -1) {
          return {
            err: true,
            message: 'Could not determine "Name" column'
          }
        }
        if (attributes.student_gender == -1) {
          return {
            err: true,
            message: 'Could not determine "Gender" column'
          }
        }
        if (attributes.student_email == -1) {
          return {
            err: true,
            message: 'Could not determine "Email" column'
          }
        }
        return attributes
      }
    }
  }

  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 10000)
  }

  render() {
    const columns = [
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "reg_no", label: "Registration No", format: (value) => value },
      { id: "student_email", label: "Email", format: (value) => value },
      { id: "student_address", label: "Address", format: (value) => value },
      { id: "student_gender", label: "Gender", format: (value) => value },
      { id: "username", label: "Username", format: (value) => value },
      { id: "password", label: "Password", format: (value) => value }
    ];
    return (
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs = {12}>
      <CustomCard cardContent={
      <Grid>
      <Grid container>
        <Typography variant="h2" style={{ margin: "10px" }}>
          {`Students (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingStudents}
          onEditClick={(student) => this.props.navigate('update', {state: {batch_id: this.batch_id, student_id: student.student_id}})}
          onDeleteClick={(student) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage: 'Are you sure you want to remove this student?',
              confirmationModalExecute: () => socket.emit('students/delete', { student_id: student.student_id })
            })
          }}
          rows={this.state.studentsArr}
          columns={columns}
        />
        <Grid item xs={12} sx={{ margin: "10px" }}>
          <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
            <Alert variant= "outlined"  severity='info' sx={defaultStyles.alertBox[this.state.alertSeverity]}><pre>{this.state.alertMsg}</pre></Alert>
          </Zoom>
        </Grid>
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("create", {state: {batch_id: this.batch_id}})}
          label="Create New"
        />
        <CustomButton
          sx={{ margin: "10px" }}
          variant='contained'
          component="label"
          disabled={this.state.uploadingStudentsList}
          label={
            this.state.uploadingStudentsList ? <CircularProgress size='20px' /> :
            <React.Fragment>
              Upload Students List
              <input hidden accept=".csv" type="file" onChange={this.processStudentsList}/>
            </React.Fragment>
          }
        />
        <Tooltip title="Upload a .CSV file, columns should be named: CNIC, Registration No, Name, Father Name, Gender, Address. Note: Name, gender, and cnic/reg# cannot be empty">
          <IconButton>
            <Info />
          </IconButton>
        </Tooltip>
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
      }/>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudent);
