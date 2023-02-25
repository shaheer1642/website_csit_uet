/* eslint eqeqeq: "off", no-unused-vars: "off" */
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import * as Icon from '@mui/icons-material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as uuid from 'uuid';
import { generateNewToken } from '../websocket/socket';
import { withRouter } from '../withRouter';
import { socket, socketHasConnected } from '../websocket/socket';
import EstablishingConnection from '../views/EstablishingConnection';
import eventHandler from '../eventHandler';
import {user} from './../objects/User'
import * as Color from "@mui/material/colors";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function MisLayout() {
  const theme = useTheme();
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [currentMenu, setCurrentMenu] = React.useState('home');
  const [socketConnecting, setSocketConnecting] = React.useState(true);

  useEffect(() => {
    console.log('[MisLayout] componentDidMount')
    socketHasConnected().then(() => setSocketConnecting(false)).catch(console.error)
    socket.on('connect', SocketConnectedListener)
    socket.on('disconnect', SocketDisconnectedListener)

    return () => {
      console.log('[MisLayout] componentWillUnmount')
      socket.removeListener(SocketConnectedListener)
      socket.removeListener(SocketDisconnectedListener)
    }
  })

  useEffect(() => {
    console.log('[MisLayout] componentDidUpdate')
    if (!user.login_token)
      navigate("/login")
  });

  const SocketConnectedListener = () => setSocketConnecting(false)
  const SocketDisconnectedListener = () => setSocketConnecting(true)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onLogoutClick = () => {
    console.log('[onLogoutClick]')
    generateNewToken()
    //navigate("/login")
  }

  return (
    <React.Fragment>
      {socketConnecting ? <EstablishingConnection /> :
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography sx={{fontWeight: 'bold'}} variant="h6" noWrap component="div">
                DigiTransform: An Integrated Departmental MIS
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <List>
                {
                  user.user_type == 'admin' ? 
                  (
                    <React.Fragment>
                          <ListItem button component={Link} to="" disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                              }}
                              onClick={() => setCurrentMenu('home')}
                            >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon.Home style={{color: currentMenu == 'home' ? Color.deepPurple[500] : undefined}}/>
                            </ListItemIcon>
                            <ListItemText primary='Home' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'home' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                            </ListItemButton>
                          </ListItem>
                    <ListItem button component={Link} to="events" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                        onClick={() => setCurrentMenu('events')}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon.Campaign style={{color: currentMenu == 'events' ? Color.deepPurple[500] : undefined}}/>
                        </ListItemIcon>
                        <ListItemText primary='Events' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'events' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem button component={Link} to="batches" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                        onClick={() => setCurrentMenu('batches')}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon.ManageAccounts style={{color: currentMenu == 'batches' ? Color.deepPurple[500] : undefined}}/>
                        </ListItemIcon>
                        <ListItemText primary='Batch Management' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'batches' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem button component={Link} to="teachers" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                        onClick={() => setCurrentMenu('teachers')}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon.School  style={{color: currentMenu == 'teachers' ? Color.deepPurple[500] : undefined}}/>
                        </ListItemIcon>
                        <ListItemText primary='Teachers' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'teachers' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem button component={Link} to="courses" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                        onClick={() => setCurrentMenu('courses')}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon.Book style={{color: currentMenu == 'courses' ? Color.deepPurple[500] : undefined}}/>
                        </ListItemIcon>
                        <ListItemText primary='Courses' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'courses' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                      </ListItemButton>
                    </ListItem>
                    </React.Fragment>
                  ) : user.user_type == 'teacher' ?
                  <React.Fragment>
                    <ListItem button component={Link} to="tportal/courses" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                        onClick={() => setCurrentMenu('courses')}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon.Book style={{color: currentMenu == 'courses' ? Color.deepPurple[500] : undefined}}/>
                        </ListItemIcon>
                        <ListItemText primary='Courses' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'courses' ? Color.deepPurple[500] : undefined, '&:hover': {color: Color.deepPurple[700]} }} />
                      </ListItemButton>
                    </ListItem>
                    </React.Fragment>
                    : <></>
                }
              <Divider />
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={onLogoutClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon.PowerSettingsNew style={{ color: 'Red' }} />
                  </ListItemIcon>
                  <ListItemText primary='Logout' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </List>



          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: Color.grey[100], minHeight: '100vh' }}>
            <DrawerHeader />
            <Outlet />
          </Box>
        </Box>
      }
    </React.Fragment>
  );
}

export default withRouter(MisLayout)