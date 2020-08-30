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
  },
  btn: {
    backgroundColor: '#0E402D',
    color: 'white',
    marginTop: '1rem'
  }
}));

export default function AddEvidence({setValue}) {
  const classes = useStyles();
  const theme = useTheme();

  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);
  //const [filesList, setFilesList] = React.useState([]);

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
    //setFilesList(files);
    const formData = new FormData();
    formData.append('file', files[0]);

    await axios.post('http://localhost:4000/api/file', formData);
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
      <Typography variant="h4" paragraph>
        Requirements
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <Typography variant="h6">
            1) Compliance with timber legality legislation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography onClick={handleDrawerOpen} paragraph>
              A) The organization shall ensure that its FSC-certified products conform to all applicable timber legality legislation.
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              B) Ensure that FSC-certified products containing pre-consumer reclaimed wood (except reclaimed paper) being sold to companies located in countries where timber legality legislation applies
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              C) Only include pre-consumer reclaimed wood materials that conform to FSC Controlled Wood requirements in accordance with FSC-STD-40-005
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              D) Inform their customers about the presence of pre-consumer reclaimed wood in the product and support their due diligence system as required by applicable timber legality legislation
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
            2) Control of FSC Claims
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography onClick={handleDrawerOpen} paragraph>
              A) All products shall have the same conversion factor. If not, they may still be grouped under the same product group, but the applicable conversion factors shall be applied to the corresponding products for the calculation of the amount of output
            </Typography>
            <Typography onClick={handleDrawerOpen} paragraph>
              B) All products shall be made of the same input material (e.g. pine lumber) or same combination of input materials (e.g. a product group of veneered particle boards, where all products are made of a combination of particle board and veneer of equival
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
            3) Supllementary requirements
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography paragraph>
              A) Only FSC products that are eligible for FSC labelling may be promoted with the FSC trademarks
            </Typography>
            <Typography paragraph>
              A) Products exclusively made of input materials from small and/or community producers are eligible to carry the FSC Small and Community Label
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
            4) Outsourcing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box marginLeft={3}>
            <Typography paragraph>
              A) Activities that are subject to outsourcing agreements are those that are included in the scope of the organization’s CoC certificate, such as purchase, processing, storage, labelling and invoicing of products
            </Typography>
            <Typography paragraph>
              B) The organization shall establish an outsourcing agreement with each non-FSC-certified contractor, specifying at minimum
            </Typography>
            <Typography paragraph>
              C) Notify the organization within the period of 10 business days if the contractor is included in the list of organizations that are disassociated from FSC, in accordance with the FSC-POL-01-004, and therefore subsequently ineligible to provide outsourcing
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Button className={classes.btn} variant="contained" size="large" onClick={() => handleFileOpen()}>
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
