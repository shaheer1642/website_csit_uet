/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import GoBackButton from "../../../components/GoBackButton";
import { CircularProgress, Grid, Typography } from "@mui/material";
import CustomCard from '../../../components/CustomCard';
import CustomSelect from '../../../components/CustomSelect';
import ContextInfo from '../../../components/ContextInfo';
import CustomButton from '../../../components/CustomButton';
import CustomAlert from '../../../components/CustomAlert';
import { MakeGETCall, MakePATCHCall } from '../../../api';

class MisDepartmentsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      callingApi: false,
      department: {},
      chairman_id: '',

      alertMsg: '',
      alertSeverity: 'warning',
    }
    this.department_id = this.props.location.state.department_id
    this.context_info = this.props.location.state.context_info

    this.alertTimeout = null
  }

  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  fetchData = () => {
    this.setState({ loading: true })
    MakeGETCall('/api/departments', { query: { department_id: this.department_id } }).then(res => {
      return this.setState({
        loading: false,
        department: res,
        chairman_id: res.chairman_id || 'NULL'
      });
    }).catch(console.error)
    // socket.emit('departments/fetch', { department_id: this.department_id }, (res) => {
    //   if (res.code == 200) {
    //     this.setState({
    //       loading: false,
    //       department: res.data[0],
    //       chairman_id: res.data[0].chairman_id || 'NULL'
    //     })
    //   }
    // })
  }

  updateChairman = () => {
    this.setState({ callingApi: true })
    MakePATCHCall('/api/departments/' + this.department_id + '/updateChairman', { body: { chairman_id: this.state.chairman_id || null } }).then(res => {
      this.setState({
        callingApi: false,
        alertMsg: 'Chairman Updated',
        alertSeverity: 'success'
      });
      this.fetchData()
    }).catch(err => {
      console.error(err)
      this.setState({
        callingApi: false,
        alertMsg: err.message,
        alertSeverity: 'warning'
      });
    })
    // socket.emit('departments/updateChairman', { department_id: this.department_id, chairman_id: this.state.chairman_id }, (res) => {
    //   this.setState({
    //     callingApi: false,
    //     alertMsg: res.code == 200 ? 'Chairman Updated' : `${res.status}: ${res.message}`,
    //     alertSeverity: res.code == 200 ? 'success' : 'warning'
    //   })
    //   this.fetchData()
    // })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon /> :
        <Grid container spacing={2}>
          <GoBackButton context={this.props.navigate} />
          <Grid item xs={12}>
            <ContextInfo contextInfo={this.context_info} overrideIncludeKeys={['department_id', 'department_name']} />
          </Grid>
          <Grid item xs={12}>
            <CustomCard>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='h2'>Update Info</Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomSelect
                    label="Chairman"
                    menuItems={[{ id: null, label: 'None' }]}
                    endpoint='/api/autocomplete/teachers'
                    endpointData={{
                      include_roles: ['chairman']
                    }}
                    sx={{ minWidth: '300px' }}
                    onChange={(e, option) => this.setState({ chairman_id: option.id })}
                    value={this.state.chairman_id}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton disabled={this.state.callingApi} label={this.state.callingApi ? <CircularProgress size='20px' /> : 'Save'} onClick={this.updateChairman} />
                </Grid>
              </Grid>
            </CustomCard>
          </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisDepartmentsUpdate);