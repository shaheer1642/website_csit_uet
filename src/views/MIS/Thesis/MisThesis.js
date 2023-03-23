/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";

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

class MisThesis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStudentsThesis: true,
      studentsThesisArr: [],

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => {},
    };
  }

  componentDidMount() {
    this.fetchStudentsThesis()
    socket.addEventListener("studentsThesis/listener/changed",this.studentsThesisListenerChanged);
  }

  componentWillUnmount() {
    socket.removeEventListener("studentsThesis/listener/changed",this.studentsThesisListenerChanged);
  }

  fetchStudentsThesis = () => {
    socket.emit("studentsThesis/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentsThesisArr: res.data,
          loadingStudentsThesis: false,
        });
      }
    });
  }

  studentsThesisListenerChanged = (data) => {
    this.fetchStudentsThesis()
  };

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => {},
    });
  };

  render() {
    const columns = [
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "reg_no", label: "Reg#", format: (value) => value },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "thesis_title", label: "Title", format: (value) => value },
      { id: "thesis_type", label: "Type", format: (value) => value },
      { id: 'undertaking_timestamp', label: 'Created at', format: (value) => new Date(Number(value)).toLocaleDateString() }
    ];
    return (
      <CustomCard cardContent={
      <Grid container>
        <Typography variant="h2" style={{ margin: "10px" }}>
          {`Thesis`}
        </Typography>
        <CustomTable
          loadingState={this.state.loadingStudentsThesis}
          onRowClick={(student_thesis) =>
            this.props.navigate("update", {
              state: { 
                student_batch_id: student_thesis.student_batch_id, 
                thesis_info: `Thesis Report | ${student_thesis.student_name} (${student_thesis.reg_no || student_thesis.cnic}) - ${student_thesis.degree_type}` 
              },
            })
          }
          onEditClick={(student_thesis) =>
            this.props.navigate("update", {
              state: { 
                student_batch_id: student_thesis.student_batch_id, 
                thesis_info: `Thesis Report | ${student_thesis.student_name} (${student_thesis.reg_no || student_thesis.cnic}) - ${student_thesis.degree_type}` 
              },
            })
          }
          onDeleteClick={(student_thesis) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage:
                "Are you sure you want to remove this record?",
              confirmationModalExecute: () =>
                socket.emit("studentsThesis/delete", {
                  student_batch_id: student_thesis.student_batch_id,
                }, (res) => this.fetchStudentsThesis())
            });
          }}
          rows={this.state.studentsThesisArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("create")}
          label="Create New"
        />
        <ConfirmationModal
          open={this.state.confirmationModalShow}
          message={this.state.confirmationModalMessage}
          onClose={() => this.confirmationModalDestroy()}
          onClickNo={() => this.confirmationModalDestroy()}
          onClickYes={() => {
            this.state.confirmationModalExecute();
            this.confirmationModalDestroy();
          }}
        />
      </Grid>
      } />
    );
  }
}

export default withRouter(MisThesis);
