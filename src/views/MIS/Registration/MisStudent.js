/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  Button,
} from "@mui/material";

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
      studentsArr: [],
      modalTitle: "",
      modalBody: "",
      modalShow: false,
    };
  }

  componentDidMount() {
    socket.emit("students/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
        studentsArr: res.data,
        });
      }
    });
  }

  render() {
    const columns = [
      { id: "student_name", label: "Student Name", format: (value) => value },
      { id: "student_id", label: "Student ID", format: (value) => value },
      { id: "student_address", label: "address", format: (value) => value },
    //   { id: "student_id", label: "Student ID", format: (value) => value },
    ];
    return (
      <Grid container>
        <Typography variant="h1" style={{ margin: "10px" }}>
          Students
        </Typography>
        <CustomTable
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
          onClick={() => this.props.navigate("create")}
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
