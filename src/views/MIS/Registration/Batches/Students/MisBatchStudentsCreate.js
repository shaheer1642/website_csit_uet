/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import { Grid } from "@mui/material";
import React from "react";
import FormGenerator from "../../../../../components/FormGenerator";
import { withRouter } from "../../../../../withRouter";
import GoBackButton from "../../../../../components/GoBackButton";

class MisStudentsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.batch_id = this.props.location.state.batch_id
  }

  render() {
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
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
                position: 2,
                xs: 6,
              },
              student_name: {
                label: "Student Name",
                position: 3,
                xs: 6,
              },
              batch_id: {
                label: "Batch ID",
                defaultValue: this.batch_id,
                disabled: true,
                position: 4,
                xs: 6,
                hidden: true,
              },
              student_father_name: {
                label: "Father Name",
                position: 5,
                xs: 6,
              },
              student_gender: {
                label: "Gender",
                position: 6,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['male', 'female']
              },
              student_admission_status: {
                label: "Admission Status",
                position: 7,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['open_merit', 'rationalized', 'afghan_student']
              },
              user_email: {
                label: "Email",
                position: 8,
                xs: 6,
              },
              student_contact_no: {
                label: "Contact #",
                position: 9,
                xs: 6,
              },
              student_address: {
                label: "Address",
                position: 10,
                xs: 6,
              },
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentsCreate);
