
import React from 'react';
import {Grid, Typography} from '@mui/material';

class About extends React.Component {


  render() {
    return (
      <Grid container style={{margin: 20}}>
        <Grid item xs={12}>
          <Typography style={{textAlign: 'left'}} variant="h4">
            This is the about page
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default About;
