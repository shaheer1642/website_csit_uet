/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../components/FormGenerator';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import LoadingIcon from '../../../../components/LoadingIcon';
import { Grid } from '@mui/material';
import GoBackButton from '../../../../components/GoBackButton';

class MisBatchesUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      batch_no: '',
      batch_stream: '',
      joined_semester: '',
      degree_type: '',
      batch_advisor_id: ''
    }
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    socket.emit('batches/fetch', { batch_id: this.batch_id }, (res) => {
      console.log('[batches/fetch] response:', res)
      if (res.code == 200) {
        const batch = res.data[0]
        this.setState({
          loading: false,
          batch_no: batch.batch_no,
          batch_stream: batch.batch_stream,
          enrollment_year: batch.enrollment_year,
          enrollment_season: batch.enrollment_season,
          degree_type: batch.degree_type,
          batch_expiration_timestamp: batch.batch_expiration_timestamp,
          batch_advisor_id: batch.batch_advisor_id
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon /> :
        <Grid container spacing={2}>
          <GoBackButton context={this.props.navigate} />
          <Grid item xs={12}>
            <FormGenerator
              endpoint="batches"
              formType="update"
              submitSuccessMessage='Batch Edited Successfully'
              backgroundColor='white'
              options={{
                batch_id: {
                  label: "Batch ID",
                  defaultValue: this.batch_id,
                  disabled: true,
                  position: 1,
                  xs: 12,
                  hidden: true
                },
                batch_no: {
                  label: 'Batch No',
                  defaultValue: this.state.batch_no,
                  position: 2,
                  xs: 6
                },
                batch_stream: {
                  label: 'Batch Stream',
                  defaultValue: this.state.batch_stream,
                  position: 3,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['computer_science', 'data_science', 'cyber_security']
                },
                enrollment_year: {
                  label: 'Enrollment Year',
                  defaultValue: this.state.enrollment_year,
                  position: 4,
                  xs: 6
                },
                enrollment_season: {
                  label: 'Enrollment Season',
                  defaultValue: this.state.enrollment_season,
                  position: 5,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['spring', 'fall'],
                },
                degree_type: {
                  label: 'Degree Type',
                  defaultValue: this.state.degree_type,
                  position: 6,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['ms', 'phd'],
                  disabled: true
                },
                batch_expiration_timestamp: {
                  label: 'Degree Expiry',
                  defaultValue: this.state.batch_expiration_timestamp,
                  position: 7,
                  xs: 6,
                },
                batch_advisor_id: {
                  label: "Batch Advisor",
                  defaultValue: this.state.batch_advisor_id,
                  position: 8,
                  xs: 6,
                  fieldType: 'select',
                  endpoint: 'autocomplete/teachers',
                  endpointData: { include_roles: ['batch_advisor'] },
                  selectMenuItems: [{ id: '', label: 'None' }]
                },
              }}
            />
          </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisBatchesUpdate);