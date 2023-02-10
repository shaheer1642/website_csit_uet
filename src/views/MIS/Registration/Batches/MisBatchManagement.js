/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography, Button, ButtonGroup, IconButton } from '@mui/material';
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
import MisStudents from './Students/MisStudents';
import MisSemesters from './Semesters/MisSemesters';
import GoBackButton from '../../../../components/GoBackButton';

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

class MisBatchManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.batch_id = this.props.location.state.batch_id
    this.batch_name = this.props.location.state.batch_name
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Grid container >
        <GoBackButton context={this.props.navigate}/>
        <Grid item>
          <MisStudents/>
        </Grid>
        <Grid item>
          <MisSemesters/>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisBatchManagement);