/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
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
          submitSuccessMessage='Batch Created Successfully'
          backgroundColor='white'
          options={{
            batch_no: {
              label: 'Batch No',   
              defaultValue: new Date().getFullYear(),
              position: 1,
              xs: 6
            },
            joined_semester: {
              label: 'Joined Semester',
              placeholder: 'Spring | Fall',
              position: 2,
              xs: 6
            },
            degree_type: {
              label: 'Degree Type',   
              placeholder: 'Msc | Phd',
              position: 3,
              xs: 12
            },
            batch_advisor_id: {
              label: 'Batch Advisor Id',
              position: 4,
              xs: 12,
              required: false
            },
          }}
        />
    );
  }
}