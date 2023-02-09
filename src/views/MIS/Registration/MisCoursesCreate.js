/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../components/FormGenerator";
import { withRouter } from "../../../withRouter";

class MisCoursesCreate extends React.Component {
  constructor(props) {
    super(props);
   
  }

  render() {
    return (
      <FormGenerator
        endpoint="courses"
        formType="create"
        submitSuccessMessage="Courses Created Successfully"
        backgroundColor="white"
        options={{
          course_name: {
            label: "Course Name",
            position: 1,
            xs: 12,
          },
        }}
      />
    );
  }
}

export default withRouter(MisCoursesCreate);
