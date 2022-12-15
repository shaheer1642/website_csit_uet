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
  }

  render() {
    const columns = [
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_id", label: "Student ID", format: (value) => value },
      { id: "student_address", label: "Address", format: (value) => value },
      { 
        id: 'action_buttons', 
        label: 'Actions', 
        component: 
        <ButtonGroup>
          <IconButton style={{color: Color.blue[500]}} onClick={() => console.log('edit clicked')}><Edit /></IconButton>
          <IconButton style={{color: Color.red[700]}} onClick={() => console.log('delete clicked')}><Delete /></IconButton>
        </ButtonGroup>
      }
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Students (${this.batch_name})`}
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingStudents}
          onRowClick={(row) =>
            this.setState({
              modalTitle: row.title,
              modalBody: row.body,
              modalShow: true,
            })
          }
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
