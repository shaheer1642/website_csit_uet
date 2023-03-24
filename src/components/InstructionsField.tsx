// @ts-nocheck
import React from 'react';
import { CircularProgress, TextField, InputAdornment, IconButton, Typography, Link, Grid, Menu, MenuItem, Tooltip } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import { socket } from '../websocket/socket';
import { Edit, Check, CancelOutlined, NoteAdd } from '@mui/icons-material';
import { ButtonGroup } from 'reactstrap';
import { global_documents, getNameForUrl } from '../objects/Documents';

const defaultStyles = {
    colors: {
        inputTextColor: 'black',

        labelColor: 'grey',
        labelFocusedColor: Color.deepPurple[700],

        underlineColor: 'grey',
        underlineFocusedColor: Color.deepPurple[700],
    },
    font: {
        size: "18px",
        family: "Arial"
    }
}

interface IProps {
    instruction_id: number,
    instruction_detail_key: string,
    readonly: boolean,
}

export default class InstructionsField extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {
        instruction_obj: undefined,
        editable: false,
        showDocumentsMenu: false,
        menuEl: null
    }
  }

  componentDidMount(): void {
    this.fetchInstruction()
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
      console.log(this.state.instruction_obj)
  }

  fetchInstruction = () => {
    socket.emit('instructions/fetch', {instruction_id: this.props.instruction_id}, (res) => {
      if (res.code == 200) {
        this.setState({
            instruction_obj: res.data[0]
        })
      }
    })
  }

  updateInstruction = () => {
    socket.emit('instructions/update', this.state.instruction_obj, (res) => {
      if (res.code == 200) {
        this.setState({
            editable: false,
        })
      }
      this.fetchInstruction()
      console.log(res)
    })
  }

  onChange = (e) => {
    const instruction_obj = this.state.instruction_obj
    instruction_obj.detail[this.props.instruction_detail_key] = e.target.value
    this.setState({
        instruction_obj: {...instruction_obj}
    })
  }

  addDocumentLink = (url) => {
    const instruction_obj = this.state.instruction_obj
    instruction_obj.detail[this.props.instruction_detail_key] += ` ${url} `
    this.setState({
        instruction_obj: {...instruction_obj}
    })
  }

  render() {
    return (
        this.state.instruction_obj ? 
            <Grid container rowSpacing={'5px'} style={{border: '1px solid grey',padding: '10px', borderRadius: '5px'}}>
                <Grid item xs='auto' display='flex' alignItems={'center'}>
                    <Typography variant='h4'>Instructions</Typography>
                </Grid>
                <Grid item xs='auto'>
                    {this.state.editable ?
                        <ButtonGroup>
                            <Tooltip title="Save">
                                <IconButton size='small' color='primary' onClick={() => this.updateInstruction()}>
                                    <Check fontSize='14px'/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <IconButton size='small' color='primary' onClick={() => this.setState({editable: false}, () => this.fetchInstruction())}>
                                    <CancelOutlined />
                                </IconButton>
                            </Tooltip>
                            <div>
                                <Tooltip title="Insert Document Link">
                                    <IconButton 
                                        aria-controls={this.state.showDocumentsMenu ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={this.state.showDocumentsMenu ? 'true' : undefined}
                                        size='small' color='primary' onClick={(e) => this.setState({showDocumentsMenu: true, menuEl: e.currentTarget})}>
                                        <NoteAdd />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    open={this.state.showDocumentsMenu}
                                    onClose={() => this.setState({showDocumentsMenu: false})}
                                    anchorEl={this.state.menuEl}
                                >
                                    {global_documents.map((doc,index) => 
                                        <MenuItem key={`menuitem-${index}`} onClick={() => this.addDocumentLink(doc.document_url)}>{doc.document_name}</MenuItem>
                                    )}
                                </Menu>
                            </div>
                        </ButtonGroup>:
                        this.props.readonly ? <></>:
                        <Tooltip title="Edit">
                            <IconButton size='small' color='primary' onClick={() => this.setState({editable: true})}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                    }
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    {this.state.editable ?
                        <TextField
                        fullWidth
                        color="primary"
                        disabled={!this.state.editable}
                        value={this.state.instruction_obj.detail[this.props.instruction_detail_key] || ''}
                        variant={'outlined'}
                        onChange={this.onChange}
                        type={'text'}
                        multiline={true}
                        maxRows={10}
                        />:
                        <React.Fragment>
                            {this.state.instruction_obj.detail[this.props.instruction_detail_key]?.replace(/\r\n/g,'\n').split('\n').map((line,index) => 
                                <Typography key={`text-${index}`}>
                                    {line?.split(' ')
                                    .map((word,index) => getNameForUrl(word) ? <Link key={`link-${index}`} href={word}>{`${getNameForUrl(word)} `}</Link> : `${word} `) || '\u200b'}
                                </Typography>
                            )}
                        </React.Fragment>
                    }
                </Grid>
            </Grid>
        : <CircularProgress />
    )
  }
}