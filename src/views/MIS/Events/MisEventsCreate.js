// eslint-disable-no-unused-vars
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';

export default class MisEventsCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
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
    );
  }
}