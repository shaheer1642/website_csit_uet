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
import { Collapse, Grid, Tooltip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import * as Icon from '@mui/icons-material';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as uuid from 'uuid';
import { generateNewToken } from '../websocket/socket';
import { withRouter } from '../withRouter';
import { socket, socketHasConnected } from '../websocket/socket';
import * as Color from "@mui/material/colors";
import SocketConnection from '../views/SocketConnection';

const drawerWidth = 300;

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

function MisLayout(props) {
  const theme = useTheme();
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [currentMenu, setCurrentMenu] = React.useState('home');
  const [applicationsOpen, setApplicationsOpen] = React.useState(false);

  useEffect(() => {
    console.log('[MisLayout] componentDidMount')
    if (!props.user) navigate("/login")
    // else console.log('[MisLayout] user=',user)

    return () => {
      console.log('[MisLayout] componentWillUnmount')
    }
  })

  useEffect(() => {
    console.log('[MisLayout] componentDidUpdate')
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onLogoutClick = () => {
    console.log('[onLogoutClick]')
    props.logout()
    navigate('/')
    // generateNewToken()
    //navigate("/login")
  }

  const LogoText = () => {
    return (
      <React.Fragment>
        <Box component="img" sx={{ mr: 1, width: "48px" }} alt="UET Logo" src="logo512.png" />
        {/* <img src={'logo512.png'} style={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: "50px" }} alt="uet_banner" /> */}
        {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'TimesNewRoman',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            ":hover": {
              color: 'primary.light'
            }
          }}
        >
          Computer Science & IT (MIS)
        </Typography>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            fontFamily: 'TimesNewRoman',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            ":hover": {
              color: 'primary.light'
            }
          }}
        >
          CS & IT (MIS)
        </Typography>
      </React.Fragment>
    )
  }

  const DrawerItem = (props) => {
    return (
      <Tooltip title={props.name} placement='right' disableHoverListener={open}>
        <ListItemButton
          component={props.navigation ? Link : undefined}
          to={props.navigation}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            textDecoration: 'none',
            ':hover': {
              color: 'primary.main'
            }
          }}
          onClick={() => props.onClick ? props.onClick() : setCurrentMenu(props.name)}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <props.icon sx={{ color: currentMenu == props.name ? 'primary.main' : props.iconColor }} />
          </ListItemIcon>
          <ListItemText primary={props.name} sx={{ opacity: open ? 1 : 0, color: currentMenu == props.name ? 'primary.main' : undefined, '&:hover': { color: 'primary.main' } }} />
        </ListItemButton>
      </Tooltip>
    )
  }

  return (
    !props.user ? <Navigate to={'/login'} /> :
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
            {LogoText()}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <List>

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Documents" navigation="documents" icon={Icon.Description} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Department Management" navigation="departments" icon={Icon.Apartment} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Batch Management" navigation="batches" icon={Icon.People} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Student Management" navigation="students" icon={Icon.ManageAccounts} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Semester Management" navigation="semesters" icon={Icon.CastForEducation} /> : <></>
            }

            {['teacher'].includes(props.user.user_type) ?
              <DrawerItem name="Courses" navigation="tportal/courses" icon={Icon.Book} /> : <></>
            }

            {['student'].includes(props.user.user_type) ?
              <DrawerItem name="Courses" navigation="sportal/courses" icon={Icon.Book} /> : <></>
            }

            {['pga', 'student', 'teacher'].includes(props.user.user_type) ?
              <DrawerItem name={props.user.user_type == 'pga' ? 'Thesis Management' : 'Thesis'} navigation={props.user.user_type == 'student' ? "thesis/manage" : "thesis"} icon={Icon.Article} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Instructors" navigation="teachers" icon={Icon.School} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Courses" navigation="courses" icon={Icon.Book} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Student Performance" navigation="studentPerformance" icon={Icon.Troubleshoot} /> : <></>
            }

            {['admin', 'pga'].includes(props.user.user_type) ?
              <DrawerItem name="Instructors Performance" navigation="teachersPerformance" icon={Icon.QueryStats} /> : <></>
            }

            {['teacher'].includes(props.user.user_type) ?
              <DrawerItem name="Performance Report" navigation="tportal/performance" icon={Icon.QueryStats} /> : <></>
            }

            {['student'].includes(props.user.user_type) ?
              <DrawerItem name="Transcript" navigation="sportal/transcript" icon={Icon.Summarize} /> : <></>
            }

            <Tooltip title='Applications' placement='right' disableHoverListener={open}>
              <ListItemButton
                component={Link}
                to="applications/viewApplications"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => {
                  setCurrentMenu('viewApplications')
                  setApplicationsOpen(!applicationsOpen)
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Applications" sx={{ opacity: open ? 1 : 0, '&:hover': { color: 'primary.main' } }} />
                {open ? applicationsOpen ? <Icon.ExpandLess /> : <Icon.ExpandMore /> : <></>}
              </ListItemButton>
            </Tooltip>

            <Collapse in={open ? applicationsOpen : false} timeout="auto" unmountOnExit>

              <ListItemButton
                component={Link}
                to="applications/viewApplications"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  pl: 4,
                  ':hover': {
                    color: 'primary.main'
                  }
                }}
                onClick={() => setCurrentMenu('viewApplications')}
              >
                <ListItemText primary='My Applications' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'viewApplications' ? 'primary.dark' : undefined, '&:hover': { color: 'primary.main' } }} />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="applications/submitApplication"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  pl: 4,
                  ':hover': {
                    color: 'primary.main'
                  }
                }}
                onClick={() => setCurrentMenu('submitApplication')}
              >
                <ListItemText primary='Submit Application' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'submitApplication' ? 'primary.main' : undefined, '&:hover': { color: 'primary.main' } }} />
              </ListItemButton>

              {['admin', 'pga'].includes(props.user.user_type) ?
                <ListItemButton
                  component={Link}
                  to="applications/applicationsTemplates"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    pl: 4,
                    ':hover': {
                      color: 'primary.main'
                    }
                  }}
                  onClick={() => setCurrentMenu('applicationsTemplates')}
                >
                  <ListItemText primary='Applications Templates' sx={{ opacity: open ? 1 : 0, color: currentMenu == 'applicationsTemplates' ? 'primary.main' : undefined, '&:hover': { color: 'primary.main' } }} />
                </ListItemButton> : <></>
              }

            </Collapse>

            <Divider />

            <DrawerItem name="My Profile" navigation="profile" icon={Icon.AccountCircle} />

            <DrawerItem name="Help" navigation="help" icon={Icon.Help} />

            <DrawerItem name="Logout" icon={Icon.PowerSettingsNew} iconColor='Red' onClick={() => onLogoutClick()} />

          </List>
        </Drawer>
        <Box component="main" sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: Color.grey[100],
          minHeight: '100vh',
          maxWidth: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - (${theme.spacing(7)} + 1px))`,
          [theme.breakpoints.up('sm')]: {
            maxWidth: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - (${theme.spacing(8)} + 1px))`,
          },
        }}>
          <DrawerHeader />
          <Outlet />
        </Box>
        <SocketConnection />
      </Box>
  );
}

export default withRouter(MisLayout)