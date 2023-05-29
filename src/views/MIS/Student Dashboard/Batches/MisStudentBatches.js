/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Typography, } from '@mui/material';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import CustomTable from '../../../../components/CustomTable';
import CustomCard from '../../../../components/CustomCard';
import { user } from '../../../../objects/User';
import GoBackButton from '../../../../components/GoBackButton';

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
  }

  componentDidMount() {
    socket.emit('students/fetch', {student_id: user.user_id}, (res) => {
      if (res.code == 200) {
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
      confirmationModalExecute: () => {}
    })
  }

  render() {
    const columns = [
      { id: 'batch_no', label: 'Batch Number', format: (value) => value},
      { id: 'degree_type', label: 'Degree Type', format: (value) => value },
      { id: 'enrollment_year', label: 'Enrollment Year', format: (value) => value },
      { id: 'enrollment_season', label: 'Enrollment Season', format: (value) => value },
      { id: 'registered_students', label: 'Registered Students', format: (value) => value },
    ];
    return (
      <CustomCard cardContent={
      <Grid container >
        <Typography variant="h2" style={{ margin: '10px' }}>Select Batch</Typography>
        <CustomTable 
          loadingState = {this.state.loading}
          onRowClick={(studentBatch) => {
            this.props.navigate(this.props.location.state.redirect, {state: {...this.props.location?.state, student_batch_id: studentBatch.student_batch_id}})
          }}
          rows={this.state.studentBatchesArr} columns={columns} />
      </Grid>
      }/>
    );
  }
}

export default withRouter(MisStudentBatches);