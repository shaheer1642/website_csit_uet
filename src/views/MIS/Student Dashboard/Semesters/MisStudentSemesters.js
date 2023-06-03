/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
} from "@mui/material";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomCard from "../../../../components/CustomCard";
import { timeLocale } from "../../../../objects/Time";
import { user } from "../../../../objects/User";
import { socket } from "../../../../websocket/socket";
import GoBackButton from "../../../../components/GoBackButton";
import { convertUpper } from "../../../../extras/functions";

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

class MisStudentSemesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentSemestersArr: [],
    };
  }

  componentDidMount() {
    socket.emit("semesters/fetch", {student_id: user.user_id}, (res) => {
      console.log(res)
      if (res.code == 200) {
        return this.setState({
          studentSemestersArr: res.data,
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
  }

  render() {
    const columns = [
      { id: "semester_year", label: "Year", format: (value) => value },
      { id: "semester_season", label: "Season", format: (value) => convertUpper(value) },
      { id: 'semester_start_timestamp', label: 'Starts', format: (value) => new Date(Number(value)).toLocaleDateString(...timeLocale) },
      { id: 'semester_end_timestamp', label: 'Ends', format: (value) => new Date(Number(value)).toLocaleDateString(...timeLocale) },
    ];
    return (
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs = {12}>
          <CustomCard cardContent={
            <Grid container>
              <Typography variant="h2" style={{ margin: "10px" }}>
                Select Semester
              </Typography>
              <CustomTable
                loadingState = {this.state.loading}
                onRowClick={(studentSemester) => {
                  this.props.navigate(this.props.location.state.redirect, {state: {...this.props.location?.state, student_semester: studentSemester}})
                }}
                rows={this.state.studentSemestersArr}
                columns={columns}
              />
            </Grid>
          }/>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentSemesters);
