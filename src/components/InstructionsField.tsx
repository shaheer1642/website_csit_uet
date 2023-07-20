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
        this.fetchInstruction()
      }
    })
  }

  render() {
    return (
        this.state.fetchingInstruction ? <LoadingIcon /> :
        <CustomRichTextField 
            readOnly={this.props.readOnly}
            editorState={this.state.instruction} 
            onChange={(e) => this.setState({instruction: e})} 
            onSave={this.updateInstruction} 
            onCancel={this.fetchInstruction}
        />
    );
  }
}