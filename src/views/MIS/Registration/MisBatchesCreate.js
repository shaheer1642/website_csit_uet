// eslint-disable-no-unused-vars
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';

export default class MisBatchesCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //123
    return (
        <FormGenerator 
          endpoint='batches' 
          formType="create" 
          submitSuccessMessage='Event Created Successfully'
          backgroundColor='white'
          options={{
            batch_no: {
              label: 'Title',   
              position: 1,
              xs: 6
            },
            joined_semester: {
              label: 'Title',   
              position: 2,
              xs: 6
            },
            degree_type: {
              label: 'Title',   
              position: 3,
              xs: 12
            },
           
          }}
        />
    );
  }
}