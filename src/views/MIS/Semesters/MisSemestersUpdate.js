/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import GoBackButton from '../../../components/GoBackButton';
import { Grid } from '@mui/material';
class MisSemestersUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      semester_year: '',
      semester_season: '',
      semester_start_timestamp: 0,
      semester_end_timestamp: 0,
      semester_coordinator_id: ''
    }
    this.semester_id = this.props.location.state.semester_id
  }

  componentDidMount() {
    socket.emit('semesters/fetch', { semester_id: this.semester_id }, (res) => {
      console.log('[semesters/fetch] response:', res)
      if (res.code == 200) {
        const semester = res.data[0]
        console.log('setting state')
        this.setState({
          loading: false,
          semester_year: semester.semester_year,
          semester_season: semester.semester_season,
          semester_start_timestamp: Number(semester.semester_start_timestamp),
          semester_end_timestamp: Number(semester.semester_end_timestamp),
          semester_coordinator_id: semester.semester_coordinator_id,
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
              endpoint="semesters"
              formType="update"
              submitSuccessMessage='Semester Edited Successfully'
              backgroundColor='white'
              options={{
                semester_id: {
                  label: "Semester ID",
                  defaultValue: this.semester_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                  hidden: true
                },
                semester_year: {
                  label: "Semester Year",
                  defaultValue: this.state.semester_year,
                  position: 1,
                  xs: 6,
                },
                semester_season: {
                  label: "Semester Season",
                  defaultValue: this.state.semester_season,
                  position: 1,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['spring', 'fall']
                },
                semester_start_timestamp: {
                  label: 'Semester Start Time',
                  position: 2,
                  xs: 6,
                  defaultValue: this.state.semester_start_timestamp
                },
                semester_end_timestamp: {
                  label: 'Semester End Time',
                  position: 2,
                  xs: 6,
                  defaultValue: this.state.semester_end_timestamp
                },
                semester_coordinator_id: {
                  label: "Semester Coordinator",
                  defaultValue: this.state.semester_coordinator_id,
                  position: 10,
                  xs: 6,
                  fieldType: 'select',
                  endpoint: 'autocomplete/teachers',
                  selectMenuItems: [{ id: '', label: 'None' }]
                },
              }}
            />
          </Grid>
        </Grid>

    );
  }
}

export default withRouter(MisSemestersUpdate);