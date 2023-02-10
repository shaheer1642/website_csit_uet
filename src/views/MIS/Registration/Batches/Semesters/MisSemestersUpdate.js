/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../../components/FormGenerator';
import { socket } from '../../../../../websocket/socket';
import { withRouter } from '../../../../../withRouter';
import LoadingIcon from '../../../../../components/LoadingIcon';
import GoBackButton from '../../../../../components/GoBackButton';
import { Grid } from '@mui/material';
class MisSemestersUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      semester_no:'',
      semester_year:'',
      semester_season:'',
      semester_start_timestamp:0,
      semester_end_timestamp:0,

    }
    this.semester_id = this.props.location.state.semester_id
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    socket.emit('semesters/fetch', {semester_id: this.semester_id, batch_id: this.batch_id}, (res) => {
      console.log('[semesters/fetch] response:',res)
      if (res.code == 200) {
        const semester = res.data[0]
        console.log('setting state')
        this.setState({
          loading: false,
          semester_no: semester.semester_no,
          semester_year: semester.semester_year,
          semester_season: semester.semester_season,
          semester_start_timestamp: Number(semester.semester_start_timestamp),
          semester_end_timestamp: Number(semester.semester_end_timestamp),
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid>
      <GoBackButton context={this.props.navigate}/>
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
          },
          batch_id: {
            label: "Batch ID",
            defaultValue: this.batch_id,
            disabled: true,
            position: 2,
            xs: 6,
          },
          semester_no: {
            label: "Semester Number",
            defaultValue: this.state.semester_no,
            position: 1,
            xs: 6,
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
            fieldTypeOptions: ['Spring', 'Fall']
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
          
       
        }}
      />
      </Grid>

    );
  }
}

export default withRouter(MisSemestersUpdate);