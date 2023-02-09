/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../components/FormGenerator';

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
              position: 1,
              xs: 12,
              width: '30%'
            },
            enrollment_year: {
              label: 'Enrollment Year',   
              defaultValue: new Date().getFullYear(),
              position: 1,
              xs: 12,
              width: '30%'
            },
            enrollment_season: {
              label: 'Enrollment Season',
              position: 2,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['Spring', 'Fall']
            },
            degree_type: {
              label: 'Degree Type',   
              position: 3,
              xs: 6,
              fieldType: 'radiobox',
              fieldTypeOptions: ['Msc', 'Phd']
            },
            batch_advisor_id: {
              label: 'Batch Advisor Id',
              position: 4,
              xs: 12,
            },
          }}
        />
    );
  }
}