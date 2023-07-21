/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import { Grid } from "@mui/material";
import React from "react";
import FormGenerator from "../../../../components/FormGenerator";
import { withRouter } from "../../../../withRouter";
import GoBackButton from "../../../../components/GoBackButton";

class MisSemestersCoursesCreate extends React.Component {
  constructor(props) {
    super(props);
    this.semester_id = this.props.location.state.semester_id
  }

  render() {
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <FormGenerator
            endpoint="semestersCourses"
            formType="create"
            submitSuccessMessage="Course Created Successfully"
            backgroundColor="white"
            options={{
              semester_id: {
                label: "Semester ID",
                defaultValue: this.semester_id,
                disabled: true,
                position: 1,
                xs: 12,
                hidden: true
              },
              teacher_id: {
                label: "Teacher",
                position: 2,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/teachers'
              },
              course_id: {
                label: "Course",
                position: 3,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/courses'
              },
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisSemestersCoursesCreate);
