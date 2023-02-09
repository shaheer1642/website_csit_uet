/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { Grid } from '@mui/material';
import GoBackButton from '../../../components/GoBackButton';
import { withRouter } from "../../../withRouter";
class MisEventsCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Grid container >
          <GoBackButton context={this.props.navigate}/>
         <FormGenerator 
          endpoint='events' 
          formType="create" 
          submitSuccessMessage='Event Created Successfully'
          backgroundColor='white'
          options={{
            title: {
              label: 'Title',
              position: 1,
              xs: 6
            },
            event_expiry_timestamp: {
              label: 'Event Expiry',
              position: 2,
              xs: 6,
              defaultValue: new Date().getTime()
            },
            body: {
              label: 'Body',
              position: 3,
              xs: 12
            }
          }}
        />
        </Grid>
      
    );
  }
}
export default withRouter(MisEventsCreate);
