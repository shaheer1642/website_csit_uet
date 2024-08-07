/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography, Button, ButtonGroup, IconButton, Tabs, Tab } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import CustomTable from '../../../../components/CustomTable';
import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import * as Color from '@mui/material/colors';
import FormGenerator from '../../../../components/FormGenerator';
import { Navigate } from 'react-router-dom'
import ConfirmationModal from '../../../../components/ConfirmationModal';
import CustomCard from '../../../../components/CustomCard';
import { convertTimestampToSeasonYear, convertUpper } from '../../../../extras/functions';
import CustomSelect from '../../../../components/CustomSelect';
import ContextInfo from '../../../../components/ContextInfo';
import { getUserNameById } from '../../../../objects/Users_List';
import { MakeDELETECall, MakeGETCall } from '../../../../api';

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

class MisBatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchesArr: [],
      loadingBatches: true,
      tabIndex: 0,

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    };
  }

  componentDidMount() {

    this.fetchBatches()

    // socket.emit('batches/fetch', {}, (res) => {
    //   console.log(res)
    //   if (res.code == 200) {
    //     return this.setState({
    //       batchesArr: res.data,
    //       loadingBatches: false
    //     })
    //   }
    // })

    socket.addEventListener('batches_changed', this.fetchBatches)
  }

  componentWillUnmount() {
    socket.removeEventListener('batches_changed', this.fetchBatches)
  }

  fetchBatches = () => {
    MakeGETCall('/api/batches', {
      query: {
        batch_department_id: this.props.user.user_department_id
      }
    }).then(res => {
      return this.setState({
        batchesArr: res,
        loadingBatches: false
      })
    }).catch(console.error)
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    })
  }

  render() {
    const columns = [
      { id: 'batch_no', label: 'Batch Number', format: (value) => value },
      { id: 'batch_stream', label: 'Batch Stream', format: (value) => convertUpper(value) },
      { id: 'degree_type', label: 'Degree Type', format: (value) => convertUpper(value) },
      { id: 'enrollment_season', label: 'Enrollment Season', format: (value) => convertUpper(value) },
      { id: 'enrollment_year', label: 'Enrollment Year', format: (value) => value },
      { id: 'batch_expiration_timestamp', label: 'Degree Expiry', format: (value) => convertTimestampToSeasonYear(value) },
      { id: 'batch_advisor_id', label: 'Batch Advisor', format: (value) => getUserNameById(value) },
      { id: 'registered_students', label: 'Registered Students', format: (value) => value },
    ];
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ContextInfo contextInfo={{ department_name: this.props.user.department_name }} />
        </Grid>
        <Grid item xs={12}>
          <CustomCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2" >Batches</Typography>
              </Grid>
              <Grid item xs={'auto'}>
                <Tabs sx={{ border: 2, borderColor: 'primary.main', borderRadius: 5 }} value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({ tabIndex: newIndex })}>
                  <Tab label="MS" />
                  <Tab label="PhD" />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  margin='0px'
                  loadingState={this.state.loadingBatches}
                  viewButtonLabel='Manage students'
                  onViewClick={(batch) => this.props.navigate('students', { state: { batch_id: batch.batch_id, context_info: batch } })}
                  onRowClick={(batch) => this.props.navigate('students', { state: { batch_id: batch.batch_id, context_info: batch } })}
                  onEditClick={this.props.user.user_type.startsWith('admin') || this.props.user.user_type.startsWith('pga') ? (batch) => this.props.navigate('update', { state: { batch_id: batch.batch_id } }) : undefined}
                  onDeleteClick={this.props.user.user_type.startsWith('admin') || this.props.user.user_type.startsWith('pga') ? (batch) => {
                    this.setState({
                      confirmationModalShow: true,
                      confirmationModalMessage: 'Are you sure you want to delete this batch? This will also delete all the students in the batch',
                      confirmationModalExecute: () => {
                        MakeDELETECall(`/api/batches/${batch.batch_id}`).catch(console.error)
                        // socket.emit('batches/delete', { batch_id: batch.batch_id })
                      }
                    })
                  } : undefined}
                  rows={this.state.batchesArr.filter(batch => (this.state.tabIndex == 0 && batch.degree_type == 'ms') || (this.state.tabIndex == 1 && batch.degree_type == 'phd'))}
                  columns={columns}
                  rowSx={(row) => {
                    return row.batch_expiration_timestamp < new Date().getTime() ? {
                      backgroundColor: Color.red[100]
                    } : undefined
                  }}
                  footerText='Red = Time barred'
                />
              </Grid>
              <Grid item xs={'auto'} display={this.props.user.user_type.startsWith('admin') || this.props.user.user_type.startsWith('pga') ? 'flex' : 'none'}>
                <CustomButton onClick={() => this.props.navigate('create')} label="Create New" />
              </Grid>
              <ConfirmationModal
                open={this.state.confirmationModalShow}
                message={this.state.confirmationModalMessage}
                onClose={() => this.confirmationModalDestroy()}
                onClickNo={() => this.confirmationModalDestroy()}
                onClickYes={() => {
                  this.state.confirmationModalExecute()
                  this.confirmationModalDestroy()
                }}
              />
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisBatches);