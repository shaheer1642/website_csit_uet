/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import CustomCard from "../../../../components/CustomCard";
import { convertUpper } from "../../../../extras/functions";
import LoadingIcon from "../../../../components/LoadingIcon";
import Field from "../../../../components/Field";

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

class MisTeacherPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: '',
      teacher: {}
    };
  }

  componentDidMount() {
    this.fetchTeacher()
    socket.addEventListener( "teachers/listener/update", this.fetchTeacher );
  }

  componentWillUnmount() {
    socket.removeEventListener( "teachers/listener/update", this.teachersListenerUpdate );
  }

  fetchTeacher() {
    this.setState({callingApi: 'fetchTeacher'})
    socket.emit("teachers/fetch", {teacher_id: this.props.user?.user_id}, (res) => {
      console.log(res)
      if (res.code == 200) {
        return this.setState({
          teacher: res.data[0],
          callingApi: '',
        });
      }
    });
  }

  render() {
    return (
      this.state.callingApi == 'fetchTeacher' ? <LoadingIcon />:
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">{`Performance Report`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Field name="Total Courses Taught" value={this.state.teacher.courses_taught} />
          </Grid>
          <Grid item xs={12}>
            <Field name="MS Students Supervised" value={this.state.teacher.ms_students_supervised} />
          </Grid>
          <Grid item xs={12}>
            <Field name="MS Students Under Supervision" value={this.state.teacher.ms_students_under_supervision} />
          </Grid>
          <Grid item xs={12}>
            <Field name="PhD Students Supervised" value={this.state.teacher.phd_students_supervised} />
          </Grid>
          <Grid item xs={12}>
            <Field name="PhD Students Under Supervision" value={this.state.teacher.phd_students_under_supervision} />
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisTeacherPerformance);
