/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../components/FormGenerator';
import GoBackButton from '../../../../components/GoBackButton';
import { Grid } from '@mui/material';
import { withRouter } from '../../../../withRouter';


class MisBatchesCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //123
    return (
      <Grid container rowSpacing={"20px"}>
      <GoBackButton context={this.props.navigate}/>
      <Grid item xs={12}>
        <FormGenerator 
          endpoint='batches' 
          formType="create" 
          submitSuccessMessage='Batch Created Successfully'
          backgroundColor='white'
          options={{
            batch_no: {
              label: 'Batch No',
              position: 1,
              xs: 6,
            },
            enrollment_year: {
              label: 'Enrollment Year',
              defaultValue: new Date().getFullYear(),
              position: 1,
              xs: 6,
            },
            enrollment_season: {
              label: 'Enrollment Season',
              position: 2,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['spring', 'fall']
            },
            degree_type: {
              label: 'Degree Type',   
              position: 3,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['ms', 'phd']
            },
            batch_advisor_id: {
              label: 'Batch Advisor Id',
              position: 4,
              xs: 12,
            },
          }}
        />
      </Grid>
      </Grid>
    );
  }
}
export default withRouter(MisBatchesCreate);