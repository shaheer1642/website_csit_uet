import '../App.css';
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Box, Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography} from '@mui/material';

const tabStyle = {
  indicatorColor: {
    sx: {
      backgroundColor: 'orange',
    },
  },
  label: {
    color: 'white'
  },
  active: {
    color: 'orange'
  },
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
      <div className="App">
        <header className="Page-header">
            <Box sx={{ width: '100%' }}>
              <img src="https://www.uetpeshawar.edu.pk/images/banner.jpg" style={{width: "100%", marginTop: 5}} alt="uet_banner"/>
              <header className="Tab-header">
                <Tabs value={this.state.tabValue} onChange={(event, newValue) => this.setState({tabValue: newValue})} TabIndicatorProps={tabStyle.indicatorColor}>
                      <Tab label="Home" to="/" component={Link} style={ this.state.tabValue === 0 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="About" to="/login" component={Link} style={ this.state.tabValue === 1 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Academics" to="/about" component={Link} style={ this.state.tabValue === 2 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Centers" to="/login" component={Link} style={ this.state.tabValue === 3 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Admission" to="/about" component={Link} style={ this.state.tabValue === 4 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Campuses" to="/about" component={Link} style={ this.state.tabValue === 5 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="CMS" to="/about" component={Link} style={ this.state.tabValue === 6 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="QEC" to="/about" component={Link} style={ this.state.tabValue === 7 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="ORIC" to="/about" component={Link} style={ this.state.tabValue === 8 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="CDC" to="/about" component={Link} style={ this.state.tabValue === 9 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="ALUMNI" to="/about" component={Link} style={ this.state.tabValue === 10 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Download" to="/about" component={Link} style={ this.state.tabValue === 11 ? tabStyle.active : tabStyle.label}/>
                      <Tab label="Contacts" to="/about" component={Link} style={ this.state.tabValue === 12 ? tabStyle.active : tabStyle.label}/>
                </Tabs>
              </header>
              <div style={{maxWidth: "100%", margin: 0}}>
              < Outlet />
              </div>
            </Box>
        </header>
            <Box sx={{ width: '100%' }}>
              <footer className="Page-footer">
                <Grid container spacing={2} style={{margin: 10}}>
                  <Grid xs={4}>
                    <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
                      Quick Links
                    </Typography>
                    <List style={{color: '#fc7d56'}}>
                      <ListItem button>
                        <ListItemText primary="Home" /> 
                      </ListItem>
                      <Divider />
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
                  <Grid xs={4}>
                    <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
                      Important Links
                    </Typography>
                    <List style={{color: '#fc7d56'}}>
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
                  <Grid xs={4}>
                    <Typography variant="h6" style={{color: 'white', textAlign: 'left', marginLeft: 15}}>
                      Contact Us
                    </Typography>
                    <List style={{color: '#fc7d56'}}>
                      <ListItem>
                        <Typography variant="body1" style={{color: '#bababa', textAlign: 'left', marginLeft: 15}}>
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
              </footer>
            </Box>
      </div>
      );
  }
}

export default MainLayout;