import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { DropzoneDialog } from 'material-ui-dropzone'
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

export default function AddEvidence({setValue}) {
  const classes = useStyles();
  const theme = useTheme();

  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);
  const [filesList, setFilesList] = React.useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleFileClose = () => {
    setOpenUpload(false);
  }

  const handleFileSave = async files => {
    //Saving files to state for further use and closing Modal.
    setFilesList(files);
    const formData = new FormData();
    formData.append('file', files[0]);

    const data = await axios.post('http://localhost:4000/api/file', formData);
    setOpenUpload(false);
    setValue(0);
  }

  const handleFileOpen = () => {
    setOpenUpload(true);
  }

  const addComment = () => {
    setComments([...comments, comment]);
    setComment('')
  }

  return (
    <Container>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <Typography variant="h6">
            1) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography onClick={handleDrawerOpen} paragraph>
              A) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              B) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              A) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions2-content"
          id="additional-actions2-header"
        >
          <Typography variant="h6">
            2) Rhoncus dolor purus non enim praesent elementum facilisis leo vel
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography onClick={handleDrawerOpen} paragraph>
              A) Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions3-content"
          id="additional-actions3-header"
        >
          <Typography variant="h6">
            2) Convallis convallis tellus id interdum velit laoreet id donec ultrices
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography color="textSecondary">
              At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt.
              Lorem donec massa sapien faucibus et molestie ac.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Button variant="contained" color="primary" size="large" onClick={() => handleFileOpen()}>
        Add Image
      </Button>
      <DropzoneDialog
          open={openUpload}
          onSave={(e) => handleFileSave(e)}
          acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={() => handleFileClose()}
      />

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
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
