/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../components/FormGenerator";
import GoBackButton from "../../../components/GoBackButton";
import { Grid } from "@mui/material";
import { withRouter } from "../../../withRouter";

class MisCoursesCreate extends React.Component {
  constructor(props) {
    super(props);
   
  }

  render() {
    return (
      <Grid container>
        <GoBackButton context={this.props.navigate}/>
        <Grid item>
          <FormGenerator
            endpoint="courses"
            formType="create"
            submitSuccessMessage="Courses Created Successfully"
            backgroundColor="white"
            options={{
              course_id: {
                label: "Course ID",
                position: 1,
                xs: 6
              },
              course_name: {
                label: "Course Name",
                position: 2,
                xs: 6
              },
              departmental: {
                label: "Departmental",
                position: 3,
                defaultValue: true,
                xs: 12
              },
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisCoursesCreate);
