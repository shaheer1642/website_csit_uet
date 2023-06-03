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
            batch_stream: {
              label: 'Batch Stream',
              position: 2,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['computer_science', 'data_science','cyber_security']
            },
            enrollment_year: {
              label: 'Enrollment Year',
              position: 3,
              defaultValue: new Date().getFullYear(),
              xs: 6,
            },
            enrollment_season: {
              label: 'Enrollment Season',
              defaultValue: new Date().getMonth() < 7 ? 'spring' : 'fall',
              position: 4,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['spring', 'fall']
            },
            degree_type: {
              label: 'Degree Type',   
              position: 5,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['ms', 'phd']
            },
          }}
        />
      </Grid>
      </Grid>
    );
  }
}
export default withRouter(MisBatchesCreate);