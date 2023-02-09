/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import { Grid } from '@mui/material';
import GoBackButton from '../../../components/GoBackButton';

class MisEventsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      title: '',
      body: '',
      event_expiry_timestamp: -1
    }
    this.event_id = this.props.location.state.event_id
  }

  componentDidMount() {
    socket.emit('events/fetch', {event_id: this.event_id}, (res) => {
      console.log('[events/fetch] response:',res)
      if (res.code == 200) {
        const event = res.data[0]
        this.setState({
          loading: false,
          title: event.title,
          body: event.body,
          event_expiry_timestamp: Number(event.event_expiry_timestamp),
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid container>
      <GoBackButton context={this.props.navigate}/>
      <FormGenerator 
        endpoint="events"
        formType="update" 
        submitSuccessMessage='Event Edited Successfully'
        backgroundColor='white'
        options={{
          event_id: {
            label: "Event ID",
            defaultValue: this.event_id,
            disabled: true,
            position: 1,
            xs: 12,
          },
          title: {
            label: 'Title',
            defaultValue: this.state.title,
            position: 2,
            xs: 6
          },
          event_expiry_timestamp: {
            label: 'Event Expiry',
            defaultValue: this.state.event_expiry_timestamp,
            position: 3,
            xs: 6,
          },
          body: {
            label: 'Body',
            defaultValue: this.state.body,
            position: 4,
            xs: 12
          }
        }}
      />
      </Grid>
      
    );
  }
}

export default withRouter(MisEventsUpdate);