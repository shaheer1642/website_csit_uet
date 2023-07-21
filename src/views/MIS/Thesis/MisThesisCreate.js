/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from "react";
import FormGenerator from "../../../components/FormGenerator";
import { withRouter } from "../../../withRouter";
import { Grid } from "@mui/material";
import GoBackButton from "../../../components/GoBackButton";

class MisThesisCreate extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <FormGenerator
            endpoint="studentsThesis"
            formType="create"
            submitSuccessMessage="Thesis Created Successfully"
            backgroundColor="white"
            options={{
              student_batch_id: {
                label: "Student",
                position: 1,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/batchStudents',
                endpointData: { constraints: ['exclude_thesis_students'] }
              },
              thesis_type: {
                label: "Thesis Type",
                position: 1,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['research', 'project']
              },
              thesis_title: {
                label: "Thesis Title",
                position: 1,
                xs: 12,
              },
              supervisor_id: {
                label: "Supervisor",
                position: 2,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/teachers',
              },
              co_supervisor_id: {
                label: "Co-Supervisor",
                position: 2,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/studentsThesisExaminers'
              },
            }}
          />
        </Grid>
      </Grid>

    );
  }
}

export default withRouter(MisThesisCreate);
