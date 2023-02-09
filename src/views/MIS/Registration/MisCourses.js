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
      loadingcourses: true,
      coursesArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
    };
  }

  componentDidMount() {
    socket.emit("courses/fetch", { batch_id: this.batch_id }, (res) => {
      if (res.code == 200) {
        return this.setState({
          coursesArr: res.data,
          loadingcourses: false,

          confirmationModalShow: false,
          confirmationModalMessage: "",
          confirmationModalExecute: () => {},
        });
      }
    });

    socket.addEventListener(
      "courses/listener/insert",
      this.coursesListenerInsert
    );
    socket.addEventListener(
      "courses/listener/update",
      this.coursesListenerUpdate
    );
    socket.addEventListener(
      "courses/listener/delete",
      this.coursesListenerDelete
    );
  }

  componentWillUnmount() {
    socket.removeEventListener(
      "courses/listener/insert",
      this.coursesListenerInsert
    );
    socket.removeEventListener(
      "courses/listener/update",
      this.coursesListenerUpdate
    );
    socket.removeEventListener(
      "courses/listener/delete",
      this.coursesListenerDelete
    );
  }

  coursesListenerInsert = (data) => {
    return this.setState({
      coursesArr: [data, ...this.state.coursesArr],
    });
  };
  coursesListenerUpdate = (data) => {
    return this.setState((state) => {
      const coursesArr = state.coursesArr.map((course, index) => {
        if (course.course_id === data.course_id) return data;
        else return course;
      });
      return {
        coursesArr,
      };
    });
  };
  coursesListenerDelete = (data) => {
    return this.setState({
      coursesArr: this.state.coursesArr.filter(
        (course) => course.course_id != data.course_id
      ),
    });
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
      { id: "course_id", label: "course id", format: (value) => value },
      { id: "course_name", label: "course name", format: (value) => value },
      // { id: "reg_no", label: "Registration No", format: (value) => value },
      // { id: "teacher_gender", label: "Gender", format: (value) => value },
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          {`Courses`}
        </Typography>
        <CustomTable
          loadingState={this.state.loadingteachers}
          onRowClick={(courses) =>
            this.setState({
              modalTitle: courses.course_name,
              modalBody: courses.course_address,
              modalShow: true,
            })
          }
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
                socket.emit("courses/delete", { course_id: courses.course_id }),
            });
          }}
          rows={this.state.coursesArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() =>
            this.props.navigate("create", {
              state: { batch_id: this.batch_id },
            })
          }
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
            this.state.confirmationModalExecute();
            this.confirmationModalDestroy();
          }}
        />
      </Grid>
    );
  }
}

export default withRouter(MisCourses);
