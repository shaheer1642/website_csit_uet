/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress, Card, Box, CardContent, CardActions } from "@mui/material";
import { DeleteOutline, Edit, Menu } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

class SubmitApplication extends React.Component {
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
    socket.addEventListener("applicationsTemplates/listener/changed",this.fetchApplicationsTemplates);
  }

  componentWillUnmount() {
    socket.removeEventListener("applicationsTemplates/listener/changed",this.fetchApplicationsTemplates);
  }

  fetchApplicationsTemplates = () => {
    this.setState({loading: true})
    socket.emit("applicationsTemplates/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          applicationsTemplatesArr: res.data.filter(o => o.submit_to != this.props.user?.user_id),
          loading: false,
        });
      }
    });
  }

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 10000)
  }

  applicationCard = (applicationTemplate) => {
    return (
        <Card sx={{":hover": {backgroundColor: 'primary.main', color: 'common.white', padding: 3}, padding: 2, transition: '0.2s', color: 'primary.dark', border: '2px solid', borderColor: 'primary.main'}} onClick={() => this.props.navigate('draft', {state: {template_id: applicationTemplate.template_id}})}>
            <CardContent>
                <Typography variant='h3'> 
                    {applicationTemplate.application_title}
                </Typography>
            </CardContent>
        </Card>
    )
  }

  render() {
    return (
        this.state.loading ? <CircularProgress /> :
        <CustomCard>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h3'>Please choose application type:</Typography>
            </Grid>
            {this.state.applicationsTemplatesArr.map((applicationTemplate,index) => {
                return <Grid key={index} item xs='auto'>
                    {this.applicationCard(applicationTemplate)}
                </Grid>
            })}
        </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(SubmitApplication);
