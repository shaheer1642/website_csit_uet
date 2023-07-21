/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, Card, Box, CardContent, CardActions } from "@mui/material";
import { DeleteOutline, Edit, Menu } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import CustomCard from "../../../../components/CustomCard";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

class MisApplicationsTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      applicationsTemplatesArr: [],

      alertMsg: '',
      alertSeverity: 'warning',

      callingDeleteApi: false
    };
    this.timeoutAlertRef = null;
  }

  componentDidMount() {
    this.fetchApplicationsTemplates()
    socket.addEventListener("applicationsTemplates/listener/changed", this.fetchApplicationsTemplates);
  }

  componentWillUnmount() {
    socket.removeEventListener("applicationsTemplates/listener/changed", this.fetchApplicationsTemplates);
  }

  fetchApplicationsTemplates = () => {
    socket.emit("applicationsTemplates/fetch", { restrict_visibility: false }, (res) => {
      if (res.code == 200) {
        return this.setState({
          applicationsTemplatesArr: res.data,
          loading: false,
        });
      }
    });
  }

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 10000)
  }

  updateApplicationTemplate = (applicationTemplate) => {
    this.props.navigate("update", { state: { template_id: applicationTemplate.template_id } })
  }

  deleteApplicationTemplate = (applicationTemplate) => {
    this.setState({ callingDeleteApi: true })
    socket.emit('applicationsTemplates/delete', {
      template_id: applicationTemplate.template_id
    }, (res) => {
      this.setState({ callingDeleteApi: false })
    })
  }

  applicationCard = (applicationTemplate) => {
    return (
      <Card>
        <CardContent>
          <Typography variant='h5'>
            {applicationTemplate.application_title}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton color="info" onClick={() => this.updateApplicationTemplate(applicationTemplate)} disabled={!applicationTemplate.editable}>
            <Edit />
          </IconButton>
          <IconButton color='error' onClick={() => this.deleteApplicationTemplate(applicationTemplate)} disabled={!applicationTemplate.deletable}>
            <DeleteOutline />
          </IconButton>
        </CardActions>
      </Card>
    )
  }

  render() {
    return (
      this.state.loading ? <CircularProgress /> :
        <CustomCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2">Application Templates</Typography>
            </Grid>
            {this.state.applicationsTemplatesArr.map(applicationTemplate => {
              return <Grid item xs='auto'>
                {this.applicationCard(applicationTemplate)}
              </Grid>
            })}
            <Grid item xs={12}>
              <CustomButton label="Create New" onClick={() => this.props.navigate("create")} />
            </Grid>
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(MisApplicationsTemplates);
