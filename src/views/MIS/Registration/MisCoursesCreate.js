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
          // cnic: {
          //   label: "CNIC",
          //   position: 1,
          //   xs: 6,
          // },
          // reg_no: {
          //   label: "Registration No",
          //   position: 1,
          //   xs: 6,
          // },
          course_name: {
            label: "Course Name",
            position: 1,
            xs: 6,
          },
      
          // teacher_gender: {
          //   label: "Gender",
          //   position: 1,
          //   xs: 6,
          //   fieldType: 'radiobox',
          //   fieldTypeOptions: ['Male', 'Female']
          // },
         
         
        }}
      />
    );
  }
}

export default withRouter(MisCoursesCreate);
