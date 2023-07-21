/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography } from "@mui/material";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomCard from "../../../components/CustomCard";
import { convertUpper } from "../../../extras/functions";

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

class MisTeachersPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTeachers: true,
      teachersArr: [],
    };
  }

  componentDidMount() {
    socket.emit("teachers/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          teachersArr: res.data,
          loadingTeachers: false,
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

  render() {
    const columns = [
      { id: "cnic", label: "CNIC", format: (value) => value },
      { id: "teacher_name", label: "Instructor Name", format: (value) => value },
      { id: "teacher_gender", label: "Gender", format: (value) => convertUpper(value) },
      { id: "teacher_department_id", label: "Department", format: (value) => value },
      { id: "courses_taught", label: "Courses Taught", format: (value) => value },
      { id: "ms_students_supervised", label: "MS Stds. Supervised", format: (value) => value },
      { id: "ms_students_under_supervision", label: "MS Stds. Under Supervision", format: (value) => value },
      { id: "phd_students_supervised", label: "PhD Stds. Supervised", format: (value) => value },
      { id: "phd_students_under_supervision", label: "PhD Stds. Under Supervision", format: (value) => value },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">
              {`Instructors Performance`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loadingTeachers}
              rows={this.state.teachersArr}
              columns={columns}
            />
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisTeachersPerformance);
