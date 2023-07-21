/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Typography, } from '@mui/material';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import CustomTable from '../../../../components/CustomTable';
import CustomCard from '../../../../components/CustomCard';
import GoBackButton from '../../../../components/GoBackButton';
import { convertUpper } from '../../../../extras/functions';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
}

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  }
}

class MisStudentBatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentBatchesArr: [],
      loading: true,
    };
    this.student_id = this.props.location?.state?.student_id
  }

  componentDidMount() {
    console.log('[MisStudentBatches] mounted')
    socket.emit('students/fetch', { student_id: this.student_id }, (res) => {
      if (res.code == 200) {
        if (res.data.length == 1) return this.redirect(res.data[0])
        return this.setState({
          studentBatchesArr: res.data,
          loading: false
        })
      }
    })
  }

  componentWillUnmount() {
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    })
  }

  redirect = (studentBatch) => {
    this.props.navigate(this.props.location.state.redirect, { state: { ...this.props.location?.state, student_batch: studentBatch } })
  }

  render() {
    const columns = [
      { id: 'batch_no', label: 'Batch Number', format: (value) => value },
      { id: 'degree_type', label: 'Degree Type', format: (value) => convertUpper(value) },
      { id: 'enrollment_season', label: 'Enrollment Season', format: (value) => convertUpper(value) },
      { id: 'enrollment_year', label: 'Enrollment Year', format: (value) => value },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2" style={{ margin: '10px' }}>Select Batch</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loading}
              onRowClick={this.redirect}
              rows={this.state.studentBatchesArr} columns={columns} />
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisStudentBatches);