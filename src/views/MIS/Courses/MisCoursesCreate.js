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
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <FormGenerator
            endpoint="courses"
            formType="create"
            submitSuccessMessage="Course Created Successfully"
            backgroundColor="white"
            options={{
              course_id: {
                label: "Course ID",
                position: 1,
                xs: 6
              },
              course_name: {
                label: "Course Title",
                position: 2,
                xs: 6
              },
              course_description: {
                label: 'Course Description',
                position: 3,
                xs: 12,
              },
              course_type: {
                label: 'Course Type',
                position: 4,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['core', 'elective']
              },
              department: {
                label: "Department",
                position: 5,
                defaultValue: true,
                xs: 6
              },
              credit_hours: {
                label: "Credit Hours",
                position: 6,
                xs: 12,
                width: '150px'
              },
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisCoursesCreate);
