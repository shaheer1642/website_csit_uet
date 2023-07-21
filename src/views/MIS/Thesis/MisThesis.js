/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Tab, Tabs } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";
import { timeLocale } from "../../../objects/Time";
import { calculateDegreeExpiry, convertTimestampToSeasonYear, convertUpper } from "../../../extras/functions";
import { getUserNameById } from "../../../objects/Users_List";

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
      tabIndex: 0,

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    };
  }

  componentDidMount() {
    this.fetchStudentsThesis()
    socket.addEventListener("studentsThesis/listener/changed", this.studentsThesisListenerChanged);
  }

  componentWillUnmount() {
    socket.removeEventListener("studentsThesis/listener/changed", this.studentsThesisListenerChanged);
  }

  fetchStudentsThesis = () => {
    socket.emit("studentsThesis/fetch", this.props.user.user_type == 'teacher' ? { supervisor_id: this.props.user.user_id } : {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentsThesisArr: res.data.map(thesis => ({ ...thesis, supervisor_id: getUserNameById(thesis.supervisor_id) })),
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
      confirmationModalExecute: () => { },
    });
  };

  render() {
    const columns = [
      { id: "reg_no", label: "Reg#", format: (value) => value?.toUpperCase() },
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_father_name", label: "Father Name", format: (value) => value },
      { id: "degree_type", label: "Degree", format: (value) => convertUpper(value) },
      { id: "thesis_title", label: "Title", format: (value) => value },
      { id: "thesis_type", label: "Type", format: (value) => convertUpper(value) },
      { id: "supervisor_id", label: "Supervisor", format: (value) => value },
      { id: 'batch_expiration_timestamp', label: 'Degree Expiry', format: (value) => convertTimestampToSeasonYear(value), valueFunc: (row) => calculateDegreeExpiry(row) },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">
              {`Thesis`}
            </Typography>
          </Grid>
          <Grid item xs={'auto'}>
            <Tabs sx={{ border: 2, borderColor: 'primary.main', borderRadius: 5 }} value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({ tabIndex: newIndex })}>
              <Tab label="MS" />
              <Tab label="PhD" />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loadingStudentsThesis}
              onRowClick={(student_thesis) =>
                this.props.navigate("manage", {
                  state: {
                    student_batch_id: student_thesis.student_batch_id,
                    context_info: student_thesis
                  },
                })
              }
              onEditClick={(student_thesis) =>
                this.props.navigate("manage", {
                  state: {
                    student_batch_id: student_thesis.student_batch_id,
                    context_info: student_thesis
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
              rows={this.state.studentsThesisArr.filter(thesis => (this.state.tabIndex == 0 && thesis.degree_type == 'ms') || (this.state.tabIndex == 1 && thesis.degree_type == 'phd'))}
              columns={columns}
              rowSx={(row) => {
                return row.grade == 'S' ? {
                  backgroundColor: Color.green[100]
                } : row.grade == 'U' ? {
                  backgroundColor: Color.yellow[100]
                } : calculateDegreeExpiry(row) < new Date().getTime() ? {
                  backgroundColor: Color.red[100]
                } : undefined
              }}
              footerText='Green = Satifactory Grade\nYellow = Unsatisfactory Grade\nRed = Time barred'
            />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              onClick={() => this.props.navigate("create")}
              label="Create New"
            />
          </Grid>
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
      </CustomCard>
    );
  }
}

export default withRouter(MisThesis);
