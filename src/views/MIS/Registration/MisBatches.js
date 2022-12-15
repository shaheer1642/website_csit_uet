/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography, Button, ButtonGroup, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import * as Color from '@mui/material/colors';
import FormGenerator from '../../../components/FormGenerator';
import { Navigate } from 'react-router-dom'

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

class MisBatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchesArr: [],
      loadingBatches: true,
    };
  }

  componentDidMount() {
    socket.emit('batches/fetch', {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          batchesArr: res.data,
          loadingBatches: false
        })
      }
    })

    socket.addEventListener('batches/listener/insert', this.batchesListenerInsert)
    socket.addEventListener('batches/listener/delete', this.batchesListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('batches/listener/insert', this.batchesListenerInsert)
    socket.removeEventListener('batches/listener/delete', this.batchesListenerDelete)
  }

  batchesListenerInsert = (data) => {
    return this.setState({
      batchesArr: [data, ...this.state.batchesArr]
    })
  }
  batchesListenerDelete = (data) => {
    return this.setState({
      batchesArr: this.state.batchesArr.filter((batch) => batch.batch_id != data.batch_id)
    })
  }


  render() {
    const columns = [
      { id: 'batch_no', label: 'Batch Number', format: (value) => value},
      { id: 'degree_type', label: 'Degree Type', format: (value) => value },
    ];
    return (
      <Grid container >
        <Typography variant="h1" style={{ margin: '10px' }}>Batches</Typography>
        <CustomTable 
        loadingState = {this.state.loadingBatches} 
        onRowClick={(batch) => this.props.navigate('students', {state: {batch_id: batch.batch_id, batch_name: `${batch.batch_no} ${batch.degree_type} ${batch.joined_semester}`}})} 
        onEditClick={(batch) => console.log('edit clicked', batch.batch_id)}
        onDeleteClick={(batch) => socket.emit('batches/delete', { batch_id: batch.batch_id })}
        rows={this.state.batchesArr} columns={columns} />
        <CustomButton sx={{ margin: '10px' }} onClick={() => this.props.navigate('create')} label="Create New"/>
      </Grid>
    );
  }
}

export default withRouter(MisBatches);