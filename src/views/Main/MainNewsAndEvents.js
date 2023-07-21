import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container, Fade, Stack, Divider, Card, Modal, IconButton, ButtonGroup, } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'
import LoadingIcon from "../../components/LoadingIcon";
import { getCache, setCache } from "../../localStorage";
import { timeLocale } from "../../objects/Time";

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import CustomRichTextField from "../../components/CustomRichTextField";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { withRouter } from "../../withRouter";
import CustomModal from "../../components/CustomModal";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";
import { Delete, Edit } from "@mui/icons-material";
import ConfirmationModal from "../../components/ConfirmationModal";

class MainNewsAndEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchData',
      eventsArr: [],
      event: undefined,
      editing: false,

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  setCallingApi = (value) => this.setState({ callingApi: value })

  fetchData = () => {
    this.setCallingApi('fetchData')

    socket.emit('events/fetch', {}, (res) => {
      if (res.code == 200) {
        this.setState({ eventsArr: this.parseBody(res.data), callingApi: '' })
        if (this.state.event) this.setState((prevState) => ({ event: this.parseBody(res.data).filter(ev => ev.event_id == prevState.event.event_id)?.[0] || undefined }))
        setCache('events/fetch', res.data)
      } else console.error(res)
    })
  }

  parseBody = (data) => {
    return data.map(event => ({ ...event, body: event.body ? EditorState.createWithContent(convertFromRaw(JSON.parse(event.body))) : EditorState.createEmpty() }))
  }

  updateEvent = () => {
    this.setCallingApi('updateEvent')

    socket.emit(this.state.event.type == 'create' ? 'events/create' : 'events/update',
      {
        ...this.state.event,
        body: JSON.stringify(convertToRaw(this.state.event.body.getCurrentContent()))
      }
      , (res) => {
        this.setCallingApi('')
        if (res.code == 200) {
          this.fetchData()
        }
      })
  }

  deleteEvent = (event_id) => {
    this.setCallingApi('updateEvent')

    socket.emit('events/delete', { event_id }, (res) => {
      this.setCallingApi('')
      if (res.code == 200) {
        this.fetchData()
      }
    })
  }

  handleCardClick = (event) => {
    const text = convertToRaw(event.body.getCurrentContent()).blocks[0].text
    console.log(text)
    if (text.split(' ').length == 1 && text.match(/https?:\/\/\S+/gi)) {
      window.open(text, '_blank');
    } else {
      this.setState({ event: event })
    }
  }

  render() {
    return (
      this.state.callingApi == 'fetchData' ? <Box minHeight={'90vh'}><LoadingIcon minHeight='90vh' /></Box> :
        <Grid container padding={2}>
          <Grid item xs={12} justifyContent={'center'} display='flex'>
            <Typography fontWeight={'bold'} variant="h2" sx={{ color: 'primary.main' }}>News & Events</Typography>
          </Grid>
          <Grid item xs={12} minHeight={'90vh'}>
            <Timeline align="left">
              {['admin', 'pga'].includes(this.props.user?.user_type) ?
                <TimelineItem>
                  <TimelineOppositeContent style={{ flex: 0.15 }}>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <CustomButton variant="outlined" label="Create New" onClick={() => this.setState({ event: { type: 'create', body: EditorState.createEmpty(), title: '' }, editing: true })} />
                  </TimelineContent>
                </TimelineItem> : <></>
              }
              {this.state.eventsArr.map((event, index) => {
                return (
                  <TimelineItem key={'timeline-' + index}>
                    <TimelineOppositeContent style={{ flex: 0.15 }}>
                      <Typography variant="h5">
                        {new Date(Number(event.event_creation_timestamp)).toLocaleDateString(...timeLocale)} {event.event_expiry_timestamp ? `- ${new Date(Number(event.event_expiry_timestamp)).toLocaleDateString(...timeLocale)}` : ''}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot sx={{ backgroundColor: event.event_expiry_timestamp ? (Number(event.event_expiry_timestamp) < new Date().getTime() ? undefined : 'primary.main') : new Date().getTime() - Number(event.event_creation_timestamp) > 604800000 ? undefined : 'primary.main' }} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card onClick={() => this.handleCardClick(event)} sx={{ padding: 2, ':hover': { backgroundColor: 'primary.main', color: 'secondary.main', py: 3, transition: '0.2s' }, transition: '0.2s' }}>
                        <Typography variant="h4" flexGrow={1}>
                          {event.title}
                        </Typography>
                        {['admin', 'pga'].includes(this.props.user?.user_type) ?
                          <ButtonGroup>
                            <IconButton onClick={(e) => {
                              e.stopPropagation()
                              this.setState({ event: event, editing: true })
                            }}><Edit sx={{ color: 'primary.light' }} /></IconButton>
                            <IconButton onClick={(e) => {
                              e.stopPropagation()
                              this.setState({
                                confirmationModalShow: true,
                                confirmationModalMessage: `Are you sure you want to delete the event titled "${event.title}"?`,
                                confirmationModalExecute: () => this.deleteEvent(event.event_id)
                              })
                            }}><Delete color='error' /></IconButton>
                          </ButtonGroup> : <></>
                        }
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </Grid>
          <CustomModal open={this.state.event != undefined} onClose={() => this.setState({ event: undefined, editing: false })} width='80vw'>
            <Grid container spacing={2}>
              {this.state.editing ?
                <Grid item container spacing={2}>
                  <Grid item xs={8}>
                    <CustomTextField fullWidth label="Title" required variant="outlined" value={this.state.event?.title} onChange={(e) => this.setState(prevState => ({ event: { ...prevState.event, title: e.target.value } }))} />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField InputLabelProps={{ shrink: true }} label="Event Expiry" type="date" variant="outlined" value={this.state.event?.event_expiry_timestamp ? new Date(Number(this.state.event?.event_expiry_timestamp)).toISOString().split('T')[0] : ''} onChange={(e) => this.setState(prevState => ({ event: { ...prevState.event, event_expiry_timestamp: new Date(e.target.value).getTime() } }))} />
                  </Grid>
                </Grid> :
                <Grid item xs={12} justifyContent={'center'} display='flex'>
                  <Typography variant="h3" fontWeight={'bold'} sx={{ color: 'primary.dark' }}>{this.state.event?.title}</Typography>
                </Grid>
              }
              <Grid item xs={12}>
                <CustomRichTextField
                  readOnly={!this.state.editing}
                  editorState={this.state.event?.body}
                  onChange={(e) => this.setState(prevState => ({ event: { ...prevState.event, body: e } }))}
                  onSave={() => { }}
                  onCancel={this.fetchData}
                />
              </Grid>
              {this.state.editing ?
                <Grid item container spacing={2}>
                  <Grid item>
                    <CustomButton callingApiState={this.state.callingApi == 'updateEvent'} variant="contained" label="Save" onClick={this.updateEvent} />
                  </Grid>
                  <Grid item>
                    <CustomButton variant="outlined" label="Cancel" onClick={this.fetchData} />
                  </Grid>
                </Grid> : <></>
              }
            </Grid>
          </CustomModal>
          <ConfirmationModal
            open={this.state.confirmationModalShow}
            message={this.state.confirmationModalMessage}
            onClose={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
            onClickNo={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
            onClickYes={() => {
              this.state.confirmationModalExecute();
              this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })
            }}
          />
        </Grid>
    );
  }
}


export default withRouter(MainNewsAndEvents);
