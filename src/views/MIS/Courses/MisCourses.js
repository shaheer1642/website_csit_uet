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
import { convertUpper } from "../../../extras/functions";
import { MakeDELETECall, MakeGETCall } from "../../../api";

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

class MisCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCourses: true,
      coursesArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    };
  }

  componentDidMount() {
    this.fetchCourses()
    // socket.emit("courses/fetch", {}, (res) => {
    //   if (res.code == 200) {
    //     return this.setState({
    //       coursesArr: res.data,
    //       loadingCourses: false,

    //       confirmationModalShow: false,
    //       confirmationModalMessage: "",
    //       confirmationModalExecute: () => { },
    //     });
    //   }
    // });

    socket.addEventListener("courses_changed", this.fetchCourses);
  }

  componentWillUnmount() {
    socket.removeEventListener("courses_changed", this.fetchCourses);
  }

  fetchCourses = () => {
    MakeGETCall('/api/courses', { query: { course_department_id: this.props.user.user_department_id } }).then(res => {
      return this.setState({
        coursesArr: res,
        loadingCourses: false,
      });
    }).catch(console.error)
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    });
  };

  render() {
    const columns = [
      { id: "course_id", label: "Course ID", format: (value) => value },
      { id: "course_name", label: "Course Title", format: (value) => value },
      { id: "course_type", label: "Course Type", format: (value) => convertUpper(value) },
      { id: "credit_hours", label: "Credit Hours", format: (value) => value },
      { id: "department_name", label: "Department", format: (value) => value },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">
              {`Courses`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loadingCourses}
              onEditClick={(course) =>
                this.props.navigate("update", {
                  state: { course_id: course.course_id },
                })
              }
              onDeleteClick={(courses) => {
                this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage:
                    "Are you sure you want to remove this course?",
                  confirmationModalExecute: () =>
                    MakeDELETECall('/api/courses/' + courses.course_id).catch(console.error)
                  // socket.emit("courses/delete", { course_id: courses.course_id }),
                });
              }}
              rows={this.state.coursesArr}
              columns={columns}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              onClick={() => this.props.navigate("create")}
              label="Create New"
            />
          </Grid>
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
              this.state.confirmationModalExecute();
              this.confirmationModalDestroy();
            }}
          />
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisCourses);
