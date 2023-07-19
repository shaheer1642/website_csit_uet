import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'
import InstructionsField from "../../components/InstructionsField";
import { withRouter } from "../../withRouter";

class MainDownloads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uetdownloads: '',
    };
  }

  componentDidMount() {

    // fetch('http://localhost:3001/api/uetdownloads').then(res => res.text()).then(res => {
    //   console.log('componentDidMount res',res)
    //   this.setState({uetdownloads: res})
    // }).catch(console.error)
  }

  render() {
    return (
      <Grid container minHeight={'90vh'} padding={2}>
        <Grid item xs={12}>
          <InstructionsField 
            readOnly={this.props.user ? ['admin','pga'].includes(this.props.user.user_type) ? false : true : true} 
            instruction_id={3} 
            instruction_detail_key={'main'} />
        </Grid>
        {/* <Grid item xs={12}>
          <iframe src={'https://www.uetpeshawar.edu.pk/downloads.php#table'}/> 
        </Grid> */}
        {/* <div style={{position: 'relative'}}>
        </div> */}
        {/* <div dangerouslySetInnerHTML={{__html: this.state.uetdownloads }}></div> */}
        {/* <Typography variant='h1' fontWeight={'bold'}>This is downloads page</Typography> */}
      </Grid>
    );
  }
}


export default withRouter(MainDownloads);
