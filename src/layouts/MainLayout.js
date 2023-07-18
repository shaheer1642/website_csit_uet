/* eslint eqeqeq: "off", no-unused-vars: "off" */
import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography, tabsClasses, ListItemButton } from '@mui/material';
import footerImg from '../images/website_footer.jpg'
import bannerImg from '../images/website_banner.jpg'
import { socket, socketHasConnected } from '../websocket/socket'
import EstablishingConnection from '../views/EstablishingConnection';
import * as Color from '@mui/material/colors'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Facebook, Instagram, Mail, Phone, Twitter } from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";


function ResponsiveAppBar() {
  const tabs = [{
    label: 'Home',
    path: '/'
  },{
    label: 'Courses',
    path: '/courses'
  },{
    label: 'Instructors',
    path: '/instructors'
  },{
    label: 'Downloads',
    path: '/downloads'
  },{
    label: 'News & Events',
    path: '/newsAndEvents'
  },]

  const location = useLocation()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [value, setValue] = React.useState(tabs.findIndex((tab) => tab.path == location.pathname));
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    console.log('handleChange',newValue)
    setValue(newValue);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const LogoText = (display) => {
    return (
      <React.Fragment>
        <Box component="img" sx={{ display: display, mr: 1, width: "48px" }} alt="UET Logo" src="logo512.png" />
        {/* <img src={'logo512.png'} style={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: "50px" }} alt="uet_banner" /> */}
        {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
        <Typography
          variant={display?.xs == 'none' ? "h6" : "h5"}
          noWrap
          sx={{
            mr: 2,
            display: display,
            flexGrow: display?.xs == 'none' ? 0 : 1,
            fontFamily: 'TimesNewRoman',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {display?.xs == 'none' ? 'Computer Science & IT' : 'CS & IT'}
        </Typography>
      </React.Fragment>
    )
  }

  return (
    <AppBar position="static">
      <Container maxWidth='100%'>
        <Toolbar disableGutters>
          {LogoText({ xs: 'none', md: 'flex' })}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {tabs.map((page) => (
                <MenuItem key={page.label} onClick={() => {
                  navigate(page.path)
                  handleCloseNavMenu()
                }}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="visible arrows tabs example"
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                  '&.Mui-disabled': { opacity: 0.3 },
                },
              }}
            >
              {tabs.map(page => <Tab label={page.label} onClick={() => navigate(page.path)} />)}
            </Tabs>
          </Box>
          {LogoText({ xs: 'flex', md: 'none' })}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CS & IT
          </Typography> */}
          <Box>
            <Button onClick={() => navigate('/login')} color="secondary" variant="outlined" >MIS Login</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const Footer = () => {

  const footerRef = React.useRef(null)

  const list1 = ['Home','Statutes & Rules','Scholarships & Awards','Research & Development','Clubs & Societies','UET Committee\'s','Seniority List']
  const list2 = ['HEC','PEC','ETEA','PCATP','Admissions','MIS Login','Digital Library']

  React.useEffect(() => {
    var animationTimeout = false;
    const handleAnimationRestart = () => {
      const isScrolledToBottom = window.innerHeight + window.scrollY + footerRef.current.clientHeight >= document.documentElement.scrollHeight;
      if (animationTimeout || isScrolledToBottom  ) return
      else {
        setTimeout(() => animationTimeout = false, 5000);
        animationTimeout = true
      }
      ['.animated-list1-items','.animated-list2-items'].forEach(className => {
        document.querySelectorAll(className).forEach((item,index) => {
          item.style.animation='none';
          setTimeout(function () {item.style.animation='';item.style.animationDelay=`${index * 300}ms`},100)
        });
      })
    };
  
    window.addEventListener('scroll', handleAnimationRestart);
  
    return () => {
      window.removeEventListener('scroll', handleAnimationRestart);
    };
  }, []);

  const FooterContainer = styled('footer')(({ theme }) => ({
    backgroundImage: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.common.white,
    borderTop: `5px solid ${theme.palette.primary.dark}`,
  }));
  
  const FooterSection = styled('div')(({ theme }) => ({
    // marginBottom: theme.spacing(2),
  }));
  
  const slideInAnimation = keyframes`
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  const AnimatedListItem = styled(ListItem)(({ theme }) => ({
    opacity: 0,
    disableGutters: true,
    padding: 0,
    animation: `${slideInAnimation} 0.3s ${theme.transitions.easing.easeInOut}`,
    animationFillMode: 'forwards',
  }));

  return (
    <FooterContainer ref={footerRef}>
      <Grid container>
        <Grid item container columnSpacing={4} padding={4}>
          <Grid item xs={12} md={4} lg={4}>
            <Grid item container>
              <Grid item xs={12}>
                <Typography variant="h5">Quick Links</Typography>
              </Grid>
              <Grid item>
                <List>
                  {list1.map((label, index) => 
                    <React.Fragment>
                      <AnimatedListItem className="animated-list1-items" key={index} style={{ animationDelay: `${index * 300}ms` }}>
                        <ListItemButton>
                          <ListItemText primary={label} />
                        </ListItemButton>
                      </AnimatedListItem>
                      {index !== list1.length - 1 && (
                        <Divider sx={{ backgroundColor: 'primary.light' }} />
                      )}
                    </React.Fragment>
                  )}
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Grid item container>
              <Grid item xs={12}>
                <Typography variant="h5">Important Links</Typography>
              </Grid>
              <Grid item>
                <List>
                  {list2.map((label, index) => 
                    <React.Fragment>
                      <AnimatedListItem className="animated-list2-items" key={index} style={{ animationDelay: `${index * 300}ms` }}>
                        <ListItemButton>
                          <ListItemText primary={label} />
                        </ListItemButton>
                      </AnimatedListItem>
                      {index !== list2.length - 1 && (
                        <Divider sx={{ backgroundColor: 'primary.light' }} />
                      )}
                    </React.Fragment>
                  )}
                </List>
              </Grid>
            </Grid>
            {/* <FooterSection>
              <Typography variant="h5">Important Links</Typography>
              <List>
                {list2.map((label, index) => 
                  <React.Fragment>
                    <AnimatedListItem className="animated-list2-items" key={index} style={{ animationDelay: `${index * 300}ms` }}>
                      <ListItemButton>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </AnimatedListItem>
                    {index !== list2.length - 1 && (
                      <Divider sx={{ backgroundColor: 'primary.light' }} />
                    )}
                  </React.Fragment>
                )}
              </List>
            </FooterSection> */}
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <FooterSection>
              <Typography variant="h5">Contact Us</Typography>
              <List>
                <ListItem>
                  <Typography variant="body1">
                    University of Engineering & Technology, Jamrud Road Peshawar, Khyber Pakhtunkhwa, Pakistan
                  </Typography>
                </ListItem>
                <Divider sx={{backgroundColor: 'primary.light'}} />
                <ListItem>
                  <Grid container columnSpacing={4} rowSpacing={1}>
                    <Grid item xs={12}>
                      <Typography>UET Exchange</Typography>
                    </Grid>
                    <Grid item ml={2}>
                      <Typography>Tel No:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>(+92-91) 9216796-8</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Fax No:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>(+92-91) 9216663</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider sx={{backgroundColor: 'primary.light'}} />
                <ListItem>
                  <Grid container columnSpacing={4} rowSpacing={1}>
                    <Grid item xs={12}>
                      <Typography>Vice-Chancellor</Typography>
                    </Grid>
                    <Grid item ml={2}>
                      <Typography>Tel No:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>(+92-91) 9222212</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Fax No:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>(+92-91) 9222213</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider sx={{backgroundColor: 'primary.light'}} />
                <ListItem>
                  <Grid container columnSpacing={4} rowSpacing={1}>
                    <Grid item xs={12}>
                      <Typography>Registrar</Typography>
                    </Grid>
                    <Grid item ml={2}>
                      <Typography>Tel No:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>(+92-91) 9222215</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Email:</Typography>
                      <Typography style={{ color: Color.grey[400] }}>registrar@uetpeshawar.edu.pk</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </FooterSection>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={12} padding={1} justifyContent={'center'} alignItems={'center'} display='flex' sx={{backgroundColor: 'primary.dark'}} direction={'column'}>
            <Typography>Developed by the FYP team Muhammad Shaheer Qureshi, Sameer Shahzad, and Muqaddas Ishaq under the supervision of Dr. M. Imran Khan Khalil</Typography>
            <Typography>Copyright © 2023 - University of Engineering & Technology, Peshawar. All Rights Reserved.</Typography>
          </Grid>
        </Grid>
      </Grid>
    </FooterContainer>
  );
};

const styles = {
  tabStyle: {
    background: {
      color: Color.deepPurple[500]
    },
    indicatorColor: {
      sx: {
        backgroundColor: Color.deepPurple[500],
      },
    },
    label: {
      color: 'white'
    },
    active: {
      color: Color.deepPurple[500]
    },
  },
  footer: {
    paddingTop: 20,
    borderTop: `4px solid ${Color.deepPurple[500]}`,
    backgroundImage: `url(${footerImg})`,
    backgroundSize: 'cover',
  },
  list: {
    color: Color.deepPurple[500],
    width: 300
  }
}

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      socketConnecting: true,
    };
  }

  componentDidMount() {
    console.log('[MainLayout] componentDidMount')
    socketHasConnected().then(() => this.setState({ socketConnecting: false })).catch(console.error)
    socket.on('connect', this.SocketConnectedListener)
    socket.on('disconnect', this.SocketDisconnectedListener)
  }

  componentWillUnmount() {
    console.log('[MainLayout] componentWillUnmount')
    socket.removeListener(this.SocketConnectedListener)
    socket.removeListener(this.SocketDisconnectedListener)
  }

  SocketConnectedListener = () => this.setState({ socketConnecting: false })
  SocketDisconnectedListener = () => this.setState({ socketConnecting: true })

  render() {
    return (
      <React.Fragment>
        {this.state.socketConnecting ? <EstablishingConnection /> :
          <Grid container>
            <Grid item xs={12}>
              <ResponsiveAppBar />
            </Grid>
            <Grid item xs={12}>
              <Outlet />
            </Grid>
            <Grid item xs={12}>
              <Footer />
            </Grid>
            {/* <Grid container style={styles.footer}>
              <Grid item xs={12} md={4} lg={4}>
                <Typography variant="h6" style={{ color: 'white', textAlign: 'left', marginLeft: 15 }}>
                  Quick Links
                </Typography>
                <List style={styles.list}>
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
              <Grid item xs={12} md={4} lg={4}>
                <Typography variant="h6" style={{ color: 'white', textAlign: 'left', marginLeft: 15 }}>
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
                <Typography variant="h6" style={{ color: 'white', textAlign: 'left', marginLeft: 15 }}>
                  Contact Us
                </Typography>
                <List style={styles.list}>
                  <ListItem>
                    <Typography variant="body1" style={{ color: '#bababa', textAlign: 'left' }}>
                      University of Engineering & Technology, Jamrud Road Peshawar, Khyber Pakhtunkhwa, Pakistan
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <div style={{ flex: true, flexDirection: 'column' }}>
                      <Typography>
                        UET Exchange:
                      </Typography>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Tel No:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          (+92-91)9216796-8
                        </Typography>
                      </div>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Fax No:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          (+92-91) 9216663
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <div style={{ flex: true, flexDirection: 'column' }}>
                      <Typography>
                        Vice-Chancellor:
                      </Typography>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Tel No:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          (+92-91) 9222212
                        </Typography>
                      </div>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Fax No:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          (+92-91) 9222213
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <div style={{ flex: true, flexDirection: 'column' }}>
                      <Typography>
                        Registrar:
                      </Typography>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Tel No:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          (+92-91) 9222215
                        </Typography>
                      </div>
                      <div style={{ marginLeft: 10, flexDirection: 'row', display: 'flex' }}>
                        <Typography>
                          Email:
                        </Typography>
                        <Typography style={{ color: '#bababa', marginLeft: 5 }}>
                          registrar@uetpeshawar.edu.pk
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                </List>
              </Grid>
            </Grid> */}
          </Grid>
        }
      </React.Fragment>
    );
  }
}

export default MainLayout;