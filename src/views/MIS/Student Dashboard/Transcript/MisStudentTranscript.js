/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Navigate } from 'react-router-dom'
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup
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
import { getUserNameById } from "../../../../objects/Users_List";
import { convertUpper } from "../../../../extras/functions";
import LoadingIcon from "../../../../components/LoadingIcon";
import jsPDF from "jspdf";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)",
    ],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
};

class MisStudentTranscript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentTranscript: undefined,
    };
    this.student_batch = this.props.location?.state?.student_batch
  }
  componentDidMount() {
    this.fetchStudenTranscript();
  }

  componentWillUnmount() {
  }

  fetchStudenTranscript = () => {
    if (!this.student_batch) return
    socket.emit("forms/studentTranscript", {student_batch_id: this.student_batch?.student_batch_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentTranscript: res.data,
          loading: false,
        });
      }
    });
  }

  downloadPDF = () => {
    var printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write(this.state.studentTranscript);
    setTimeout(() => {
      printWindow.print()
    }, 1000);
  }

  render() {
    if (!this.student_batch) return <Navigate to='/mis/sportal/batches' state={{...this.props.location?.state, redirect: '/mis/sportal/transcript'}} />
    return (
      this.state.loading ? <LoadingIcon /> :
      <Grid container rowSpacing={"20px"}>
        <Grid item xs={12}>
          <CustomButton label='Print & Download' onClick={this.downloadPDF} />
        </Grid>
        <Grid item xs={12}>
          <div dangerouslySetInnerHTML={{__html: this.state.studentTranscript.replace('<button class="noprint" type="button" onClick="print()">Print Form</button>','')}} />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentTranscript);
