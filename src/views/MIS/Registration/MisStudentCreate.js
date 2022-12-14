/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../components/FormGenerator";

export default class MisStudentCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormGenerator
        endpoint="students"
        formType="create"
        submitSuccessMessage="Student Created Successfully"
        backgroundColor="white"
        options={{
            student_id: {
            label: "Student ID",
            position: 1,
            xs: 6,
          },
            student_name: {
            label: "Student Name",
            position: 1,
            xs: 6,
          },
            batch_id: {
            label: "Batch ID",
            position: 3,
            xs: 6,
          },
            student_father_name: {
            label: "Father Name",
            position: 1,
            xs: 6,
          },
            student_address: {
            label: "Address",
            position: 1,
            xs: 6,
          },
        }}
      />
    );
  }
}
