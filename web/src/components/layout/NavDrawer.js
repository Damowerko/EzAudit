import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import PersonImage from '../../images/person1.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: '2.4rem',
        marginTop: '.5rem',
        marginBottom: '.5rem'
    },
    userImage: {
        width: '4rem',
        height: '4rem'
    },
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function NavDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      <Drawer
        variant="permanent"
      >
        <div className={classes.toolbar}>
          <IconButton>
            <Avatar className={classes.userImage} alt="User" src={PersonImage} />
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button>
              <ListItemIcon>
                  <HomeOutlinedIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                  <ChatOutlinedIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                  <CalendarTodayIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                  <VideocamOutlinedIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                  <DescriptionOutlinedIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
        </List>
      </Drawer>
    </div>
  );
}