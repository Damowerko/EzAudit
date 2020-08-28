import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '1rem'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  mb: {
    marginBottom: '1rem'
  }
}));

export default function DrawerFile({ openDrawer, handleDrawerClose }) {
  const classes = useStyles();
  const theme = useTheme();

  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState('');

  const addComment = () => {
    setComments([...comments, comment]);
    setComment('')
  }

  return (
    <Container>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices.
        </Typography>

        <Typography variant="h6">
          Comments
        </Typography>
        {comments && ( comments.map((comment, index) => {
          return (
            <Typography paragraph key={index}>
              {comment}
            </Typography>
          )})
        )}
        
        <TextField
          className={classes.mb}
          label="Add Comment"
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={e => e.key === "Enter" ? addComment() : null} />

        <Typography variant="h6">
          Tags
        </Typography>
        <Box>
          <Chip label="Important" variant="outlined" />
        </Box>
        
      </Drawer>
    </Container>
  );
}
