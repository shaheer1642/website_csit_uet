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
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import LoadingIcon from "../../../../components/LoadingIcon";
import MisCourseGradeDistribution from "./MisCourseGradeDistribution";
import MisCourseGradeMarking from "./MisCourseGradeMarking";
import MisCourseAttendance from "./MisCourseAttendance";
import FormCB5 from "../../FormsGenerator/FormCB5";
import ContextInfo from "../../../../components/ContextInfo";

class MisCourseGradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingForm: ''
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.context_info = this.props.location.state.context_info
    this.student_view = this.props.user.user_type == 'student'
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  fetchForm = (endpoint) => {
    this.setState({ fetchingForm: endpoint })
    socket.emit(`forms/${endpoint}`, {
      sem_course_id: this.sem_course_id,
    }, (res) => {
      console.log(res)
      this.setState({ fetchingForm: '' })
      var printWindow = window.open('', '', 'height=800,width=600');
      printWindow.document.write(res.code == 200 ? res.data : `<html><body><p>${res.message || 'Error occured fetching form'}</p></body></html>`);
    })
  }

  render() {
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <ContextInfo contextInfo={this.context_info} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2"> {this.course_name} </Typography>
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
        {this.student_view ? <></> :
          <Grid container item spacing={2}>
            <Grid item xs={'auto'}>
              <CustomButton disabled={this.state.fetchingForm == 'resultFormG2A'} label={this.state.fetchingForm == 'resultFormG2A' ? <CircularProgress size='20px' /> : "Generate Form G-2A"} onClick={() => this.fetchForm('resultFormG2A')} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton disabled={this.state.fetchingForm == 'resultFormG2B'} label={this.state.fetchingForm == 'resultFormG2B' ? <CircularProgress size='20px' /> : "Generate Form G-2B"} onClick={() => this.fetchForm('resultFormG2B')} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton disabled={this.state.fetchingForm == 'resultFormCB5'} label={this.state.fetchingForm == 'resultFormCB5' ? <CircularProgress size='20px' /> : "Generate Form CB-5"} onClick={() => this.fetchForm('resultFormCB5')} />
            </Grid>
          </Grid>}
        <FormCB5 open={this.state.fetchingForm == 'resultFormCB5' ? true : false} onClose={() => this.setState({ fetchingForm: '' })} />
      </Grid>
    );
  }
}

export default withRouter(MisCourseGradeManagement);
