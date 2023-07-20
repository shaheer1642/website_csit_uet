// @ts-nocheck
import React from 'react';
import { Button, TextField, Grid, Typography, Stack, Chip, Link, IconButton, CircularProgress } from '@mui/material';
import {UploadFile} from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from '../websocket/socket';

const defaultStyles = {
  chip: {
    color: Color.blue[700], 
    borderColor: 'primary.dark', 
    '& .MuiChip-deleteIcon': {
      color: 'primary.main'
    }
  },
  IconButton: {
    color: 'primary.main', 
  }
}

interface IProps {
  documents: Array<string>,
  label: string,
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined,
  onDelete: Function | undefined,
  readOnly?: boolean
}

export default class CustomFilesField extends React.Component<IProps> {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      documents: {}
    }
  }

  componentDidMount(): void {
    this.fetchDocuments()
    socket.addEventListener("documents/listener/changed",this.fetchDocuments);
  }

  componentWillUnmount(): void {
    socket.removeEventListener("documents/listener/changed",this.fetchDocuments);
  }

  fetchDocuments = () => {
    socket.emit('documents/fetch',{},(res) => {
      if (res.code == 200) {
        const documents = {}
        res.data.forEach(doc => {
          documents[doc.document_id] = doc
        })
        this.setState({
          loading: false,
          documents: documents
        })
      }
    })
  }

  render() {

    return (
      this.state.loading ? <CircularProgress /> :
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography fontWeight={'bold'}>{this.props.label}</Typography>
        </Grid>
        <Grid item xs={'auto'} display='flex' alignItems={'center'}>
          <Stack direction="row" spacing={1}>
          {this.props.documents?.map((doc,index) => 
            <Chip
              label={doc.document ? doc.document_name : this.state.documents[doc.document_id]?.document_name || 'file does not exist'}
              sx={defaultStyles.chip}
              variant="outlined"
              onClick={() => doc.document ? {} : this.state.documents[doc.document_id]?.document_url ? window.open(this.state.documents[doc.document_id]?.document_url, '_blank', 'noopener,noreferrer') : {}}
              onDelete={this.props.readOnly ? undefined : (e) => this.props.onDelete(index)}
              key={`chip-${index}`}
            />
          )}
          </Stack>
        </Grid>
        {this.props.readOnly ? <></> :
          <Grid item xs={'auto'} display='flex' alignItems={'center'}>
            <IconButton sx={defaultStyles.IconButton} component="label">
              <input hidden type="file" multiple onChange={this.props.onChange}/>
              <UploadFile />
            </IconButton>
          </Grid>
        }
      </Grid>
    )
  }
}