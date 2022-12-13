// eslint-disable-no-unused-vars
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';

export default class MisBatchesCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
        <FormGenerator 
          endpoint='batches' 
          formType="create" 
          submitSuccessMessage='Batch Created Successfully'
          backgroundColor='white'
          options={{
            batch_no: {
              label: 'Batch Number',   
              position: 1,
              xs: 6
            },
            degree_type: {
              label: 'Degree Type',   
              position: 1,
              xs: 6
            },
            
            joined_semester: {
              label: 'Body',
              position: 3,
              xs: 12
            }
          }}
        />
    );
  }
}