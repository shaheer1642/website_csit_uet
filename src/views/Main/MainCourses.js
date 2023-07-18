import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container } from "@mui/material";
import { socket } from "../../websocket/socket";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as Color from '@mui/material/colors'

class MainCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Grid container minHeight={'90vh'} justifyContent={'center'} alignItems={'center'} display='flex'>
        <Typography variant='h1' fontWeight={'bold'}>This is courses page</Typography>
      </Grid>
    );
  }
}


export default MainCourses;
