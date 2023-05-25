/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  Zoom,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import GoBackButton from "../../../../components/GoBackButton";
import { user } from "../../../../objects/User";
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import LoadingIcon from "../../../../components/LoadingIcon";
import MisCourseGradeDistribution from "./MisCourseGradeDistribution";
import MisCourseGradeMarking from "./MisCourseGradeMarking";
import MisCourseAttendance from "./MisCourseAttendance";

class MisCourseGradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalOpen: false,
      formModalHtml: '',
      fetchingForm: ''
    };
    this.course_name = this.props.location.state.course_name
    this.sem_course_id = this.props.location.state.sem_course_id
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  fetchForm = (endpoint) => {
    this.setState({fetchingForm: endpoint})
    socket.emit(`forms/${endpoint}`, {
      sem_course_id: this.sem_course_id,
    }, (res) => {
      console.log(res)
      this.setState({fetchingForm: ''})
      var printWindow = window.open('', '', 'height=800,width=600');
      printWindow.document.write(res.code == 200 ? res.data : `<html><body><p>${res.message || 'Error occured fetching form'}</p></body></html>`);
    })
  }

  render() {
    return (
      <Grid container rowSpacing={"20px"} maxWidth='90vw'>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
          <Typography variant="h2">
            {this.course_name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MisCourseGradeDistribution />
        </Grid>
        <Grid item xs={12}>
          <MisCourseGradeMarking />
        </Grid>
        <Grid item xs={12}>
          <MisCourseAttendance />
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.fetchingForm == 'resultFormG2A'} label={this.state.fetchingForm == 'resultFormG2A' ? <CircularProgress size='20px'/> : "Generate Form G-2A"} onClick={() => this.fetchForm('resultFormG2A')}/>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.fetchingForm == 'resultFormG2B'} label={this.state.fetchingForm == 'resultFormG2B' ? <CircularProgress size='20px'/> : "Generate Form G-2B"} onClick={() => this.fetchForm('resultFormG2B')}/>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisCourseGradeManagement);
