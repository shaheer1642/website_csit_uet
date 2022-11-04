import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography} from '@mui/material';
import footerImg from '../images/image1.jpg'

const styles = {
  tabStyle: {
    background: {
      color: '#FAA567'
    },
    indicatorColor: {
      sx: {
        backgroundColor: '#DE2D18',
      },
    },
    label: {
      color: 'white'
    },
    active: {
      color: '#DE2D18'
    },
  },
  footer: {
    paddingTop: 20,
    borderTop: "4px solid #c16a3f",
    backgroundImage: `url(${footerImg})`,
    backgroundSize: 'cover',
  },
  list: {
    color: '#fc7d56', 
    width: 300
  }
}

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0
    };
  }

  async componentDidMount() {
    console.log('[MainLayout] componentDidMount')
    await socketHasConnected();
    socket.emit("ping", 'custom-data-sent-from-client', (data) => console.log('received data from socket', data))
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          <img src="https://www.uetpeshawar.edu.pk/images/banner.jpg" style={{width: "100%", marginTop: 5}} alt="uet_banner"/>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Tabs variant="scrollable" value={this.state.tabValue} onChange={(event, newValue) => this.setState({tabValue: newValue})} TabIndicatorProps={styles.tabStyle.indicatorColor} style={{backgroundColor: styles.tabStyle.background.color}}>
                <Tab label="Home" to="/" component={Link} style={ this.state.tabValue === 0 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="About" to="/about" component={Link} style={ this.state.tabValue === 1 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Academics" to="/about" component={Link} style={ this.state.tabValue === 2 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Centers" to="/about" component={Link} style={ this.state.tabValue === 3 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Admission" to="/about" component={Link} style={ this.state.tabValue === 4 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Campuses" to="/about" component={Link} style={ this.state.tabValue === 5 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="CMS" to="/login" component={Link} style={ this.state.tabValue === 6 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="QEC" to="/about" component={Link} style={ this.state.tabValue === 7 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="ORIC" to="/about" component={Link} style={ this.state.tabValue === 8 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="CDC" to="/about" component={Link} style={ this.state.tabValue === 9 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="ALUMNI" to="/about" component={Link} style={ this.state.tabValue === 10 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Download" to="/about" component={Link} style={ this.state.tabValue === 11 ? styles.tabStyle.active : styles.tabStyle.label}/>
                <Tab label="Contacts" to="/about" component={Link} style={ this.state.tabValue === 12 ? styles.tabStyle.active : styles.tabStyle.label}/>
          </Tabs>
        </Grid>
        < Outlet />
        <Grid container style={styles.footer}>
          <Grid item xs={12} md={4} lg={4}>
            <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
              Quick Links
            </Typography>
            <List style={styles.list}>
              <ListItem button>
                <ListItemText primary="Home" /> 
              </ListItem>
              <Divider/>
              <ListItem button divider>
                <ListItemText primary="Statutes & Rules" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Scholarships & Awards" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Research & Development" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Clubs & Societies" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="UET Committee's" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Seniority List" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Contact Us" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
              Important Links
            </Typography>
            <List style={styles.list}>
              <ListItem button>
                <ListItemText primary="HEC" /> 
              </ListItem>
              <Divider />
              <ListItem button divider>
                <ListItemText primary="PEC" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="ETEA" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="PCATP" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Admissions" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="CMS Login" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Digital Library" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText primary="Useful Links" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
              Contact Us
            </Typography>
            <List style={styles.list}>
              <ListItem>
                <Typography variant="body1" style={{color: '#bababa', textAlign: 'left'}}>
                  University of Engineering & Technology, Jamrud Road Peshawar, Khyber Pakhtunkhwa, Pakistan
                </Typography>
              </ListItem>
              <Divider />
              <ListItem>
                <div style={{flex: true, flexDirection: 'column'}}>
                  <Typography>
                    UET Exchange:
                  </Typography>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                      Tel No:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                      (+92-91)9216796-8
                    </Typography>
                  </div>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                    Fax No:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                    (+92-91) 9216663
                    </Typography>
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem>
                <div style={{flex: true, flexDirection: 'column'}}>
                  <Typography>
                    Vice-Chancellor:
                  </Typography>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                      Tel No:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                    (+92-91) 9222212
                    </Typography>
                  </div>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                    Fax No:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                    (+92-91) 9222213
                    </Typography>
                  </div>
                </div>
              </ListItem>
              <Divider />
              <ListItem>
                <div style={{flex: true, flexDirection: 'column'}}>
                  <Typography>
                    Registrar:
                  </Typography>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                      Tel No:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                    (+92-91) 9222215
                    </Typography>
                  </div>
                  <div style={{marginLeft: 10, flexDirection: 'row', display: 'flex'}}>
                    <Typography>
                    Email:
                    </Typography>
                    <Typography style={{color: '#bababa', marginLeft: 5}}>
                    registrar@uetpeshawar.edu.pk
                    </Typography>
                  </div>
                </div>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default MainLayout;