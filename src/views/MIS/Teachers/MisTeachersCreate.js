/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../components/FormGenerator";
import { withRouter } from "../../../withRouter";
import { Grid } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton";
class MisTeachersCreate extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <FormGenerator
            endpoint="teachers"
            formType="create"
            submitSuccessMessage="Instructor Created Successfully"
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
              teacher_name: {
                label: "Instructor Name",
                position: 3,
                xs: 6,
              },
              teacher_gender: {
                label: "Gender",
                position: 4,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['male', 'female']
              },
              qualification: {
                label: "Qualification",
                position: 5,
                xs: 6,
              },
              designation: {
                label: "Designation",
                position: 6,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['Dean', 'Assistant to Dean', 'Assistant Professor', 'Lecturer']
              },
              user_email: {
                label: "Email",
                position: 7,
                xs: 6,
              },
              teacher_department_id: {
                label: "Department",
                position: 8,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/departments',
              },
            }}
          />
        </Grid>
      </Grid>

    );
  }
}

export default withRouter(MisTeachersCreate);
