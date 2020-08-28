import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import PersonImage from '../images/person1.png';

import Evidence from './Evidence';
import AddEvidence from './AddEvidence';

const drawerWidth = 90;

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
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Dashboard() {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [files, setFiles] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getFiles() {
        try{
            const { data } = await axios.get('http://localhost:4000/api/file');

            setFiles(data.files);
            console.log(data.files)
        } catch(err){
            console.error(err);
        }
    }
    
    getFiles();
  }, [value]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Evidence" {...a11yProps(0)} />
            <Tab label="Add Evidence" {...a11yProps(1)} />
            <Tab label="Pending Review" {...a11yProps(1)} />
            <Tab label="Sign" {...a11yProps(2)} />
            <Tab label="Submit" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
          <List>
            <ListItem button>
              <ListItemIcon>
                <Avatar className={classes.userImage} alt="User" src={PersonImage} />
              </ListItemIcon>
            </ListItem>
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
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div role="tabpanel" hidden={value !== 0}>
          <Evidence files={files}/>
        </div>
        <div role="tabpanel" hidden={value !== 1}>
          <AddEvidence setValue={setValue}/>
        </div>
      </main>
    </div>
  );
}