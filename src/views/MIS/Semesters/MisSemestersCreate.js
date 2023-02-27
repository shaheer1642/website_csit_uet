/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import { Grid } from "@mui/material";
import React from "react";
import FormGenerator from "../../../components/FormGenerator";
import { withRouter } from "../../../withRouter";
import GoBackButton from "../../../components/GoBackButton";

class MisSemestersCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container rowSpacing={"20px"}>
      <GoBackButton context={this.props.navigate}/>
      <Grid item xs={12}>
      <FormGenerator
        endpoint="semesters"
        formType="create"
        submitSuccessMessage="Student Created Successfully"
        backgroundColor="white"
        options={{
          semester_year: {
            label: "Semester Year",
            position: 1,
            xs: 6,
            defaultValue: new Date().getFullYear(),
          },
          semester_season: {
            label: "Semester Season",
            position: 1,
            xs: 6,
            fieldType: 'radiobox',
            fieldTypeOptions: ['spring', 'fall']
          },
          semester_start_timestamp: {
            label: 'Semester Start Time',
            position: 2,
            xs: 6,
            defaultValue: new Date().getTime()
          },
          semester_end_timestamp: {
            label: 'Semester End Time',
            position: 2,
            xs: 6,
            defaultValue: new Date().getTime() + 10519200000
          },
          
        }}
      />
      </Grid>
      </Grid>

    );
  }
}

export default withRouter(MisSemestersCreate);
