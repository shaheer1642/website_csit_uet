/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography } from '@mui/material';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import * as Color from '@mui/material/colors';
import FormGenerator from '../../../components/FormGenerator';

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

class MisEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsArr: [],
      modalTitle: '',
      modalBody: '',
      modalShow: false,

    };
  }

  componentDidMount() {
    socket.emit('events/fetch', {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          eventsArr: res.data
        })
      }
    })

    socket.addEventListener('events/listener/insert', this.eventsListenerInsert)
    socket.addEventListener('events/listener/update', this.eventsListenerUpdate)
    socket.addEventListener('events/listener/delete', this.eventsListenerDelete)
  }

  componentDidUpdate() {
    console.log('MisEvents Updated',this.state)
  }

  componentWillUnmount() {
    socket.removeEventListener('events/listener/insert', this.eventsListenerInsert)
    socket.removeEventListener('events/listener/update', this.eventsListenerUpdate)
    socket.removeEventListener('events/listener/delete', this.eventsListenerDelete)
  }

  eventsListenerInsert = (data) => {
    return this.setState({
      eventsArr: [data, ...this.state.eventsArr]
    })
  }
  eventsListenerUpdate = (data) => {
    this.setState(state => {
        const eventsArr = state.eventsArr.map((event, index) => {
          if (event.event_id === data.event_id) return data;
          else return event
        });
        return {
          eventsArr,
        }
    });
  }
  eventsListenerDelete = (data) => {
    return this.setState({
      eventsArr: this.state.eventsArr.filter((event) => event.event_id != data.event_id)
    })
  }

  render() {
    const columns = [
      { id: 'title', label: 'Title', format: (value) => value },
      { id: 'body', label: 'Body', format: (value) => value },
      { id: 'event_creation_timestamp', label: 'Created At', format: (value) => new Date(Number(value)).toLocaleDateString() },
      { id: 'event_expiry_timestamp', label: 'Expires', format: (value) => new Date(Number(value)).toLocaleDateString() }
    ];
    return (
      <Grid container >
        <Typography variant="h1" style={{ margin: '10px' }}>Events</Typography>
        <CustomTable
          onRowClick={(event) => this.setState({ modalTitle: event.title, modalBody: event.body, modalShow: true })}
          onEditClick={(event) => this.props.navigate('update', {state: {event_id: event.event_id}})}
          onDeleteClick={(event) => socket.emit('events/delete', { event_id: event.event_id })}
          rows={this.state.eventsArr}
          columns={columns}
        />
        <CustomButton sx={{ margin: '10px' }} onClick={() => this.props.navigate('create')} label="Create New" />
        <CustomModal title={this.state.modalTitle} body={this.state.modalBody} open={this.state.modalShow} onClose={() => this.setState({ modalShow: false })} />
      </Grid>
    );
  }
}

export default withRouter(MisEvents);