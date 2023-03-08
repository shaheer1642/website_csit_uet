/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import { Grid, Typography } from '@mui/material';
import GoBackButton from '../../../components/GoBackButton';

class MisThesisUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      supervisor_id: '',
      co_supervisor_id: '',
      thesis_type: '',
      thesis_title: '',
      internal_examiner: '',
      external_examiner: '',
      boasar_notification_timestamp: '',
      committee_notification_timestamp: '',
      defense_day_timestamp: '',
      undertaking_timestamp: '',
    }
    this.student_batch_id = this.props.location.state.student_batch_id
    this.thesis_info = this.props.location.state.thesis_info
  }

  componentDidMount() {
    socket.emit('studentsThesis/fetch', {student_batch_id: this.student_batch_id}, (res) => {
      if (res.code == 200) {
        console.log(res)
        const student_thesis = res.data[0]
        this.setState({
          loading: false,

          supervisor_id: student_thesis.supervisor_id,
          co_supervisor_id: student_thesis.co_supervisor_id,
          thesis_type: student_thesis.thesis_type,
          thesis_title: student_thesis.thesis_title,
          internal_examiner: student_thesis.internal_examiner,
          external_examiner: student_thesis.external_examiner,
          boasar_notification_timestamp: student_thesis.boasar_notification_timestamp,
          committee_notification_timestamp: student_thesis.committee_notification_timestamp,
          defense_day_timestamp: student_thesis.defense_day_timestamp,
          undertaking_timestamp: student_thesis.undertaking_timestamp,
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
          <Typography variant='h3'>{this.thesis_info}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGenerator 
            endpoint="studentsThesis"
            formType="update" 
            submitSuccessMessage='Thesis Edited Successfully'
            backgroundColor='white'
            options={{
              student_batch_id: {
                label: "Student Batch ID",
                position: 1,
                defaultValue: this.student_batch_id,
                disabled: true,
                xs: 12,
              },
            
              thesis_title: {
                label: "Thesis Title",
                position: 2,
                defaultValue: this.state.thesis_title,
                xs: 6,
              },
              thesis_type: {
                label: "Thesis Type",
                position: 3,
                defaultValue: this.state.thesis_type,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['research', 'project']
              },
              supervisor_id: {
                label: "Supervisor",
                position: 4,
                defaultValue: this.state.supervisor_id,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/teachers'
              },
              co_supervisor_id: {
                label: "Co-Supervisor",
                position: 5,
                defaultValue: this.state.co_supervisor_id,
                xs: 6,
                fieldType: 'select',
                endpoint: 'autocomplete/teachers'
              },
              internal_examiner: {
                label: "Internal Examiner",
                position: 5,
                defaultValue: this.state.internal_examiner,
                xs: 6,
              },
              external_examiner: {
                label: "External Examiner",
                position: 5,
                defaultValue: this.state.external_examiner,
                xs: 6,
              },
              boasar_notification_timestamp: {
                label: 'BOASAR Notification',
                defaultValue: this.state.boasar_notification_timestamp || 946684800000,
                position: 5,
                xs: 4,
              },
              committee_notification_timestamp: {
                label: 'Committee Notification',
                defaultValue: this.state.committee_notification_timestamp || 946684800000,
                position: 5,
                xs: 4,
              },
              defense_day_timestamp: {
                label: 'Defense Day',
                defaultValue: this.state.defense_day_timestamp || 946684800000,
                position: 5,
                xs: 4,
              },
            }}
      />
        </Grid>
      </Grid>

    );
  }
}

export default withRouter(MisThesisUpdate);