/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import { Grid } from "@mui/material";
import React from "react";
import FormGenerator from "../../../../../components/FormGenerator";
import { withRouter } from "../../../../../withRouter";
import GoBackButton from "../../../../../components/GoBackButton";

class MisSemestersCreate extends React.Component {
  constructor(props) {
    super(props);
    this.batch_id = this.props.location.state.batch_id
  }

  render() {
    return (
      <Grid>
      <GoBackButton context={this.props.navigate}/>
      <FormGenerator
        endpoint="semesters"
        formType="create"
        submitSuccessMessage="Student Created Successfully"
        backgroundColor="white"
        options={{
          batch_id: {
            label: "Batch ID",
            defaultValue: this.batch_id,
            disabled: true,
            position: 1,
            xs: 6,
          },
          semester_no: {
            label: "Semester Number",
            position: 1,
            xs: 6,
          },
          semester_year: {
            label: "Semester Year",
            position: 1,
            xs: 6,
          },
          semester_season: {
            label: "Semester Season",
            position: 1,
            xs: 6,
          },
          semester_start_timestamp: {
            label: 'Semester Start Time',
            position: 2,
            xs: 2,
            defaultValue: new Date().getTime()
          },
          semester_end_timestamp: {
            label: 'Semester End Time',
            position: 2,
            xs: 2,
            defaultValue: new Date().getTime()
          },
          
        }}
      />
      </Grid>

    );
  }
}

export default withRouter(MisSemestersCreate);
