import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'

class MainNewsAndEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Grid container minHeight={'90vh'} justifyContent={'center'} alignItems={'center'} display='flex'>
        <Typography variant='h1' fontWeight={'bold'}>This is news & events page</Typography>
      </Grid>
    );
  }
}


export default MainNewsAndEvents;
