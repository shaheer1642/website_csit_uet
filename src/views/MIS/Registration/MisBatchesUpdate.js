/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';

class MisBatchesUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      batch_no: '',
      joined_semester: '',
      degree_type: '',
      batch_advisor_id: ''
    }
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    socket.emit('batches/fetch', {batch_id: this.batch_id}, (res) => {
      console.log('[batches/fetch] response:',res)
      if (res.code == 200) {
        const batch = res.data[0]
        this.setState({
          loading: false,
          batch_no: batch.batch_no,
          joined_semester: batch.joined_semester,
          degree_type: batch.degree_type,
          batch_advisor_id: batch.batch_advisor_id
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <FormGenerator 
        endpoint="batches"
        formType="update" 
        submitSuccessMessage='Batch Edited Successfully'
        backgroundColor='white'
        options={{
          batch_id: {
            label: "Batch ID",
            defaultValue: this.batch_id,
            disabled: true,
            position: 1,
            xs: 12,
          },
          batch_no: {
            label: 'Batch No',
            defaultValue: this.state.batch_no,
            position: 1,
            xs: 6
          },
          joined_semester: {
            label: 'Joined Semester',
            defaultValue: this.state.joined_semester,
            placeholder: 'Spring | Fall',
            position: 2,
            xs: 6
          },
          degree_type: {
            label: 'Degree Type',
            defaultValue: this.state.degree_type,
            placeholder: 'Msc | Phd',
            position: 3,
            xs: 12
          },
          batch_advisor_id: {
            label: 'Batch Advisor Id',
            defaultValue: this.state.batch_advisor_id,
            position: 4,
            xs: 12,
          },
        }}
      />
    );
  }
}

export default withRouter(MisBatchesUpdate);