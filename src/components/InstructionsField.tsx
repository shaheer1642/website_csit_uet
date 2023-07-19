// @ts-nocheck

import React from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import CustomRichTextField from './CustomRichTextField';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';

interface IProps {
    instruction_id: number,
    instruction_detail_key: string,
    readOnly: boolean,
}

export default class InstructionsField extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {
        fetchingInstruction: true,
        instruction: undefined,
        editable: false,
    };
  }

  componentDidMount() {
    this.fetchInstruction()
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.instruction_detail_key != prevProps.instruction_detail_key) this.fetchInstruction()
  }

  fetchInstruction = () => {
    this.setState({fetchingInstruction: true})
    socket.emit('instructions/fetch', {instruction_id: this.props.instruction_id}, (res) => {
        console.log(res)
        if (res.code == 200) {
            const detail = res.data[0].detail[this.props.instruction_detail_key]
            this.setState({
                instruction: detail ? EditorState.createWithContent(convertFromRaw(JSON.parse(detail))) : EditorState.createEmpty(),
                fetchingInstruction: false
            })
        }
    })
  }
  
  updateInstruction = () => {
    socket.emit('instructions/update', {
        instruction_id: this.props.instruction_id,
        instruction_detail_key: this.props.instruction_detail_key,
        instruction: JSON.stringify(convertToRaw(this.state.instruction.getCurrentContent()))
    }, (res) => {
      if (res.code == 200) {
        this.setState({
            editable: false,
        })
        this.fetchInstruction()
      }
    })
  }

  render() {
    return (
        this.state.fetchingInstruction ? <LoadingIcon /> :
        <CustomRichTextField 
            readOnly={this.props.readOnly}
            editable={true} 
            editorState={this.state.instruction} 
            onChange={(e) => this.setState({instruction: e})} 
            onSave={this.updateInstruction} 
            onCancel={this.fetchInstruction}
        />
    );
  }
}

// import React from 'react';
// import { CircularProgress, TextField, InputAdornment, IconButton, Typography, Link, Grid, Menu, MenuItem, Tooltip } from '@mui/material';
// import * as Color from '@mui/material/colors';
// import { SxProps, Theme } from '@mui/material';
// import { socket } from '../websocket/socket';
// import { Edit, Check, CancelOutlined, NoteAdd } from '@mui/icons-material';
// import { global_documents, getNameForUrl } from '../objects/Documents';
// import LoadingIcon from './LoadingIcon';

// const defaultStyles = {
//     colors: {
//         inputTextColor: 'black',

//         labelColor: 'grey',
//         labelFocusedColor: Color.deepPurple[700],

//         underlineColor: 'grey',
//         underlineFocusedColor: Color.deepPurple[700],
//     },
//     font: {
//         size: "18px",
//         family: "Arial"
//     }
// }

// interface IProps {
//     instruction_id: number,
//     instruction_detail_key: string,
//     readOnly: boolean,
// }

// export default class InstructionsField extends React.Component<IProps> {
//   constructor(props) {
//     super(props);
//     this.state = {
//         instruction: undefined,
//         editable: false,
//         showDocumentsMenu: false,
//         menuEl: null
//     }
//   }

//   componentDidMount(): void {
//     this.fetchInstruction()
//   }

//   fetchInstruction = () => {
//     socket.emit('instructions/fetch', {instruction_id: this.props.instruction_id}, (res) => {
//       if (res.code == 200) {
//         this.setState({
//             instruction: res.data[0].detail[this.props.instruction_detail_key] || ''
//         })
//       }
//     })
//   }

//   updateInstruction = () => {
//     socket.emit('instructions/update', {
//         instruction_id: this.props.instruction_id,
//         instruction_detail_key: this.props.instruction_detail_key,
//         instruction: this.state.instruction
//     }, (res) => {
//       if (res.code == 200) {
//         this.setState({
//             editable: false,
//         })
//       }
//       this.fetchInstruction()
//     //   console.log(res)
//     })
//   }

//   onChange = (e) => {
//     this.setState({
//         instruction: e.target.value
//     })
//   }

//   addDocumentLink = (url) => {
//     this.setState({
//         instruction: `${this.state.instruction} ${url} `
//     })
//   }

//   render() {
//     return (
//         this.state.instruction != undefined ? 
//             <Grid container rowSpacing={'5px'} style={{border: '1px solid grey',padding: '10px', borderRadius: '5px'}}>
//                 <Grid item xs='auto' display='flex' alignItems={'center'}>
//                     <Typography variant='h4'>Instructions</Typography>
//                 </Grid>
//                 <Grid item xs='auto'>
//                     {this.state.editable ?
//                         <ButtonGroup>
//                             <Tooltip title="Save">
//                                 <IconButton size='small' color='primary' onClick={() => this.updateInstruction()}>
//                                     <Check fontSize='14px'/>
//                                 </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Cancel">
//                                 <IconButton size='small' color='primary' onClick={() => this.setState({editable: false}, () => this.fetchInstruction())}>
//                                     <CancelOutlined />
//                                 </IconButton>
//                             </Tooltip>
//                             <div>
//                                 <Tooltip title="Insert Document Link">
//                                     <IconButton 
//                                         aria-controls={this.state.showDocumentsMenu ? 'basic-menu' : undefined}
//                                         aria-haspopup="true"
//                                         aria-expanded={this.state.showDocumentsMenu ? 'true' : undefined}
//                                         size='small' color='primary' onClick={(e) => this.setState({showDocumentsMenu: true, menuEl: e.currentTarget})}>
//                                         <NoteAdd />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Menu
//                                     open={this.state.showDocumentsMenu}
//                                     onClose={() => this.setState({showDocumentsMenu: false})}
//                                     anchorEl={this.state.menuEl}
//                                 >
//                                     {global_documents.map((doc,index) => 
//                                         <MenuItem key={`menuitem-${index}`} onClick={() => this.addDocumentLink(doc.document_url)}>{doc.document_name}</MenuItem>
//                                     )}
//                                 </Menu>
//                             </div>
//                         </ButtonGroup>:
//                         this.props.readOnly ? <></>:
//                         <Tooltip title="Edit">
//                             <IconButton size='small' color='primary' onClick={() => this.setState({editable: true})}>
//                                 <Edit />
//                             </IconButton>
//                         </Tooltip>
//                     }
//                 </Grid>
//                 <Grid item xs={12}></Grid>
//                 <Grid item xs={12}>
//                     {this.state.editable ?
//                         <TextField
//                         fullWidth
//                         color="primary"
//                         disabled={!this.state.editable}
//                         value={this.state.instruction}
//                         variant={'outlined'}
//                         onChange={this.onChange}
//                         type={'text'}
//                         multiline={true}
//                         maxRows={10}
//                         />:
//                         <React.Fragment>
//                             {this.state.instruction?.replace(/\r\n/g,'\n').split('\n').map((line,index) => 
//                                 <Typography key={`text-${index}`}>
//                                     {line?.split(' ')
//                                     .map((word,index) => getNameForUrl(word) ? <Link key={`link-${index}`} href={word}>{`${getNameForUrl(word)} `}</Link> : `${word} `) || '\u200b'}
//                                 </Typography>
//                             )}
//                         </React.Fragment>
//                     }
//                 </Grid>
//             </Grid>
//         : <LoadingIcon />
//     )
//   }
// }