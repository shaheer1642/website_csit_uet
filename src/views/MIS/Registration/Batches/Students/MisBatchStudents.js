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
  Tooltip,
  Link
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
import ContextInfo from "../../../../../components/ContextInfo";
import { calculateDegreeExpiry, convertTimestampToSeasonYear, convertUpper } from "../../../../../extras/functions";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const defaultStyles = {
  alertBox: {
    warning: {
      width: '100%',
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
      width: '100%',
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
      alertSeverity: 'warning',

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    };
    this.batch_id = this.props.location.state.batch_id
    this.context_info = this.props.location.state.context_info

    this.alertTimeout = null;
  }

  componentDidMount() {
    this.fetchData()
    socket.addEventListener('students/listener/insert', this.changeListener)
    socket.addEventListener('students/listener/update', this.changeListener)
    socket.addEventListener('students/listener/delete', this.changeListener)
    socket.addEventListener('studentsBatch/listener/insert', this.changeListener)
    socket.addEventListener('studentsBatch/listener/update', this.changeListener)
    socket.addEventListener('studentsBatch/listener/delete', this.changeListener)
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state)
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  componentWillUnmount() {
    socket.removeEventListener('students/listener/insert', this.changeListener)
    socket.removeEventListener('students/listener/update', this.changeListener)
    socket.removeEventListener('students/listener/delete', this.changeListener)
    socket.removeEventListener('studentsBatch/listener/insert', this.changeListener)
    socket.removeEventListener('studentsBatch/listener/update', this.changeListener)
    socket.removeEventListener('studentsBatch/listener/delete', this.changeListener)
  }

  changeListener = (data) => {
    if (data.batch_id == this.batch_id) {
      clearTimeout(this.fetchDataTimeout)
      this.fetchDataTimeout = setTimeout(this.fetchData, 500);
    }
  }

  fetchData = () => {
    this.setState({ loadingStudents: true })
    socket.emit("students/fetch", { batch_id: this.batch_id }, (res) => {
      this.setState({ loadingStudents: false })
      if (res.code == 200) {
        return this.setState({
          studentsArr: res.data,
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

  processStudentsList = async (e) => {
    this.setState({ uploadingStudentsList: true })
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

      Promise.all(
        students_info.map(student => {
          return new Promise((resolve, reject) => {
            socket.emit('students/create', { ...student, batch_id: this.batch_id }, (res) => {
              resolve(res.code == 200 ? `✔️ Added student ${student.student_name} (${student.reg_no || student.cnic})` : `❌ Error adding student ${student.student_name} (${student.reg_no || student.cnic}): ${res.message}`)
            })
          })
        })
      ).then(responses => {
        this.setState({
          alertMsg: responses.join('\n'),
          alertSeverity: 'success',
          uploadingStudentsList: false
        })
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
              } else if (key == 'student_admission_status') {
                student_info[key] = (
                  attribute == 'open' ||
                  attribute == 'open_merit' ||
                  attribute == 'open merit' ||
                  attribute == 'open merit basis' ||
                  attribute == 'open basis'
                ) ? 'open_merit' : (
                  attribute == 'rationalize' ||
                  attribute == 'rationalized' ||
                  attribute == 'rationalize basis' ||
                  attribute == 'rationalized basis' ||
                  attribute == 'rationalized_basis'
                ) ? 'rationalized' : (
                  attribute == 'afghan' ||
                  attribute == 'afghan student' ||
                  attribute == 'afghan_student'
                ) ? 'afghan_student' : null
              } else if (key == 'student_name' || key == 'student_father_name') {
                student_info[key] = convertUpper(attribute.toLowerCase())
              } else {
                student_info[key] = attribute
              }
            }
          }
        })
        if ((student_info.cnic || student_info.reg_no) && student_info.student_name && student_info.student_father_name)
          students_info.push(student_info)
      })

      return students_info

      function headerIndices(headers) {
        const attributes = {
          reg_no: -1,
          cnic: -1,
          student_name: -1,
          student_father_name: -1,
          student_gender: -1,
          student_admission_status: -1,
          user_email: -1,
          student_contact_no: -1,
          student_address: -1,
        }
        headers.split(',').forEach((col, index) => {
          col = col.toLowerCase().replace(/\*/g, '')
          if (col.match(/^registration$/) || col.match(/^reg_no$/)) attributes.reg_no = index
          if (col.match(/^cnic$/)) attributes.cnic = index
          if (col.match(/^name$/) || col.match(/^student_name$/)) attributes.student_name = index
          if (col.match(/^father_name$/)) attributes.student_father_name = index
          if (col.match(/^gender$/)) attributes.student_gender = index
          if (col.match(/^admission_status$/)) attributes.student_admission_status = index
          if (col.match(/^email$/)) attributes.user_email = index
          if (col.match(/^contact_no$/)) attributes.student_contact_no = index
          if (col.match(/^address$/)) attributes.student_address = index
        })
        if (attributes.cnic == -1 || attributes.reg_no == -1) {
          return {
            err: true,
            message: 'Could not determine "CNIC" or "Reg No" column'
          }
        }
        if (attributes.student_name == -1) {
          return {
            err: true,
            message: 'Could not determine "Student Name" column'
          }
        }
        if (attributes.student_father_name == -1) {
          return {
            err: true,
            message: 'Could not determine "Father Name" column'
          }
        }
        return attributes
      }
    }
  }

  deleteStudent = (student_id, batch_id) => {
    socket.emit('students/delete', { student_id: student_id, batch_id: batch_id }, (res) => {
      this.setState({
        alertMsg: res.code == 200 ? 'Student removed' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning',
      })
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
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <ContextInfo contextInfo={this.context_info} />
        </Grid>
        <Grid item xs={12}>
          <CustomCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2"> Students </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  loadingState={this.state.loadingStudents}
                  onRowClick={(student) => this.props.navigate('update', { state: { batch_id: this.batch_id, student_id: student.student_id } })}
                  onEditClick={(student) => this.props.navigate('update', { state: { batch_id: this.batch_id, student_id: student.student_id } })}
                  onDeleteClick={(student) => {
                    this.setState({
                      confirmationModalShow: true,
                      confirmationModalMessage: 'Are you sure you want to remove this student?',
                      confirmationModalExecute: () => this.deleteStudent(student.student_id, this.batch_id)
                    })
                  }}
                  rows={this.state.studentsArr}
                  columns={columns}
                  rowSx={(student) => {
                    return student.degree_completed ? {
                      backgroundColor: Color.green[100]
                    }
                      : student.admission_cancelled ? {
                        backgroundColor: Color.red[100]
                      }
                        : student.semester_frozen ? {
                          backgroundColor: Color.yellow[100]
                        }
                          : undefined
                  }}
                  footerText="Green = Degree Completed\nYellow = Semester Frozen\nRed = Admission Cancelled"
                />
              </Grid>
              <Grid item xs={12}>
                <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                  <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}><pre>{this.state.alertMsg}</pre></Alert>
                </Zoom>
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  onClick={() => this.props.navigate("create", { state: { batch_id: this.batch_id } })}
                  label="Create New"
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item>
                <CustomButton
                  variant='contained'
                  component="label"
                  disabled={this.state.uploadingStudentsList}
                  label={
                    this.state.uploadingStudentsList ? <CircularProgress size='20px' /> :
                      <React.Fragment>
                        Upload Students List
                        <input hidden accept=".csv" type="file" onChange={this.processStudentsList} />
                      </React.Fragment>
                  }
                />
              </Grid>
              <Grid item>
                <CustomButton
                  variant='outlined'
                  label={
                    <Link
                      href={process.env.PUBLIC_URL + "/templates/students-list.csv"}
                      download={"students-list.csv"}
                      style={{ textDecoration: 'none' }}
                    >
                      Download Students List Template
                    </Link>
                  }
                />
              </Grid>
              <Tooltip title="Download the .csv template to add students using excel. Starred colums cannot be left empty. Either CNIC or Reg# should be filled">
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
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudent);
