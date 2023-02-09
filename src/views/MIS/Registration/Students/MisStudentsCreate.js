/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../../components/FormGenerator";
import { withRouter } from "../../../../withRouter";

class MisStudentsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.batch_id = this.props.location.state.batch_id
  }

  render() {
    return (
      <FormGenerator
        endpoint="students"
        formType="create"
        submitSuccessMessage="Student Created Successfully"
        backgroundColor="white"
        options={{
          cnic: {
            label: "CNIC",
            position: 1,
            xs: 6,
          },
          reg_no: {
            label: "Registration No",
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
            defaultValue: this.batch_id,
            disabled: true,
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
          student_gender: {
            label: "Gender",
            position: 1,
            xs: 6,
            fieldType: 'radiobox',
            fieldTypeOptions: ['Male', 'Female']
          },
        }}
      />
    );
  }
}

export default withRouter(MisStudentsCreate);
