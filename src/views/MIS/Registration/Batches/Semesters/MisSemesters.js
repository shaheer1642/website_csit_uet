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
import { socket } from "../../../../../websocket/socket";
import { withRouter } from "../../../../../withRouter";
import CustomTable from "../../../../../components/CustomTable";
import CustomButton from "../../../../../components/CustomButton";
import CustomModal from "../../../../../components/CustomModal";
import ConfirmationModal from "../../../../../components/ConfirmationModal";

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

class MisSemesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSemesters: true,
      semestersArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
    };
    this.batch_id = this.props.location.state.batch_id
    this.batch_name = this.props.location.state.batch_name
  }

  componentDidMount() {
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

    socket.addEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.addEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.addEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.removeEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.removeEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

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
  
  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    })
  }

  render() {
    const columns = [
      { id: "semester_no", label: "Semester No", format: (value) => value },
      { id: "semester_year", label: "Year", format: (value) => value },
      { id: "semester_season", label: "Season", format: (value) => value },
      { id: 'semester_start_timestamp', label: 'Starts', format: (value) => new Date(Number(value)).toLocaleDateString() },
      { id: 'semester_end_timestamp', label: 'Ends', format: (value) => new Date(Number(value)).toLocaleDateString() }
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Semesters (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingSemesters}
          onRowClick={(semester) => 
            this.props.navigate('semesters/courses', {state: {
              ...this.props.location.state, 
              semester_id: semester.semester_id, 
              semester_name: `Semester ${semester.semester_no} - ${semester.semester_season} ${semester.semester_year}`
            }})}
          onEditClick={(semester) => this.props.navigate('semesters/update', {state: {batch_id: this.batch_id, semester_id: semester.semester_id}})}
          onDeleteClick={(semester) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage: 'Are you sure you want to remove this semester?',
              confirmationModalExecute: () => socket.emit('semesters/delete', { semester_id: semester.semester_id })
            })
          }}
          rows={this.state.semestersArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("semesters/create", {state: {batch_id: this.batch_id}})}
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
    );
  }
}

export default withRouter(MisSemesters);