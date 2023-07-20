// @ts-nocheck
import React from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Box, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { CancelOutlined, Check, Edit } from '@mui/icons-material';
import { global_documents } from '../objects/Documents';
import { socket } from '../websocket/socket';

interface IProps {
  readOnly?: boolean,
  defaultEditorState: EditorState,
  editorState: EditorState,
  onChange: Function,
  onSave?: Function,
  onCancel?: Function
}

interface IState {
}

export default class CustomRichTextField extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      showDocumentsMenu: false,
      menuEl: null
    };
  }

  componentDidUpdate() {
  }

  addDocumentLink = (url) => {
    this.setState({
      instruction: `${this.state.instruction} ${url} `
    })
  }

  uploadCallback = (file) => {
    console.log('uploadCallback')
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append(file.name, file)
      socket.emit('documents/create', { document: file, document_name: file.name }, (res) => {
        resolve({ data: { link: res.data.document_url } });
      })
    });
  }

  render() {
    return (
      <Box sx={{ position: 'relative' }}>
        {
          <Box sx={{
            position: 'absolute',
            right: this.state.editing ? 20 : this.props.editorState.getCurrentContent().hasText() ? 5 : undefined,
            top: this.state.editing ? { xs: 200, sm: 150, md: 110, xl: 80 } : undefined,
            zIndex: 10
          }}>
            {
              this.state.editing ?
                <ButtonGroup size='medium'>
                  <Tooltip title="Save">
                    <IconButton size='medium' color='primary' onClick={() => this.setState({ editing: false }, () => this.props.onSave())}>
                      <Check fontSize='14px' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton size='medium' color='primary' onClick={() => this.setState({ editing: false }, () => this.props.onCancel())}>
                      <CancelOutlined />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup> :
                this.props.readOnly ? <></> :
                  <Tooltip title="Edit">
                    <IconButton size='medium' color='primary' onClick={() => this.setState({ editing: true })}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
            }
          </Box>
        }
        {/* {this.props.editable && !this.props.readOnly && !this.state.editing ? 
            <IconButton sx={{position: 'absolute',right: this.props.editorState.getCurrentContent().hasText() ? 5 : undefined, zIndex: 10}} onClick={() => this.setState({editing: true})}>
              <Edit fontSize='medium' sx={{color:'primary.main'}} />
            </IconButton> : <></>}
          {this.state.editing ? 
            <IconButton 
              sx={{position: 'absolute',right:80,top:120,zIndex: 10}}  
              onClick={() => {
                  if (this.props.onSave) this.props.onSave()
                  this.setState({editing: false})
                }
              }
            >
              <Check fontSize='medium' sx={{color:'primary.main'}}/>
            </IconButton> : <></>}
          {this.state.editing ? 
            <IconButton 
              sx={{position: 'absolute',right:20,top:120,zIndex: 10}}  
              onClick={() => {
                  if (this.props.onCancel) this.props.onCancel()
                  this.setState({editing: false})
                }
              }
            >
              <CancelOutlined fontSize='medium' sx={{color:'primary.main'}}/>
            </IconButton> : <></>} */}
        <Editor

          defaultEditorState={this.props.defaultEditorState}
          editorState={this.props.editorState}
          onEditorStateChange={this.props.onChange}
          readOnly={this.props.readOnly || !this.state.editing}
          toolbarHidden={this.props.readOnly || !this.state.editing}

          toolbar={{
            image: {
              uploadEnabled: true,
              uploadCallback: this.uploadCallback,
              previewImage: false,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
          wrapperStyle={this.props.readOnly ? undefined : !this.state.editing ? undefined : {
            padding: '1rem',
            border: '1px solid #ccc'
          }}
          editorStyle={this.props.readOnly ? undefined : !this.state.editing ? undefined : {
            backgroundColor: 'lightgray',
            padding: '1rem',
            border: '1px solid #ccc',
            minHeight: '300px'
          }}
          toolbarStyle={this.props.readOnly ? undefined : !this.state.editing ? undefined : {
            border: '1px solid #ccc'
          }}
          mention={{
            separator: ' ',
            trigger: '@',
            suggestions: global_documents.map((doc) => ({ text: doc.document_name, value: doc.document_name, url: doc.document_url }))
          }}
        />
      </Box>
    );
  }
}