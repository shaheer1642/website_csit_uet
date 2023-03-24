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
      <Grid container rowSpacing={"20px"}>
      <GoBackButton context={this.props.navigate}/>
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
          student_email: {
            label: "Email",
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
            fieldTypeOptions: ['male', 'female']
          },
        }}
      />
      </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentsCreate);
