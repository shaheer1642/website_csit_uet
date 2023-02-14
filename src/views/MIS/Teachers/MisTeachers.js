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

class MisTeachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTeachers: true,
      teachersArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
    };
  }

  componentDidMount() {
    socket.emit("teachers/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          teachersArr: res.data,
          loadingTeachers: false,

          confirmationModalShow: false,
          confirmationModalMessage: "",
          confirmationModalExecute: () => {},
        });
      }
    });

    socket.addEventListener(
      "teachers/listener/insert",
      this.teachersListenerInsert
    );
    socket.addEventListener(
      "teachers/listener/update",
      this.teachersListenerUpdate
    );
    socket.addEventListener(
      "teachers/listener/delete",
      this.teachersListenerDelete
    );
  }

  componentWillUnmount() {
    socket.removeEventListener(
      "teachers/listener/insert",
      this.teachersListenerInsert
    );
    socket.removeEventListener(
      "teachers/listener/update",
      this.teachersListenerUpdate
    );
    socket.removeEventListener(
      "teachers/listener/delete",
      this.teachersListenerDelete
    );
  }

  teachersListenerInsert = (data) => {
    return this.setState({
      teachersArr: [data, ...this.state.teachersArr],
    });
  };
  teachersListenerUpdate = (data) => {
    return this.setState((state) => {
      const teachersArr = state.teachersArr.map((teacher, index) => {
        if (teacher.teacher_id === data.teacher_id) return data;
        else return teacher;
      });
      return {
        teachersArr,
      };
    });
  };
  teachersListenerDelete = (data) => {
    return this.setState({
      teachersArr: this.state.teachersArr.filter(
        (teacher) => teacher.teacher_id != data.teacher_id
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
      { id: "teacher_name", label: "Teacher Name", format: (value) => value },
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "teacher_gender", label: "Gender", format: (value) => value },
    ];
    return (
      <CustomCard cardContent={
      <Grid container>
        <Typography variant="h2" style={{ margin: "10px" }}>
          {`Teachers`}
        </Typography>
        <CustomTable
          loadingState={this.state.loadingTeachers}
          onEditClick={(teacher) =>
            this.props.navigate("update", {
              state: { teacher_id: teacher.teacher_id },
            })
          }
          onDeleteClick={(teacher) => {
            this.setState({
              confirmationModalShow: true,
              confirmationModalMessage:
                "Are you sure you want to remove this teacher?",
              confirmationModalExecute: () =>
                socket.emit("teachers/delete", {
                  teacher_id: teacher.teacher_id,
                }),
            });
          }}
          rows={this.state.teachersArr}
          columns={columns}
        />
        <CustomButton
          sx={{ margin: "10px" }}
          onClick={() => this.props.navigate("create")}
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
      } />
    );
  }
}

export default withRouter(MisTeachers);
