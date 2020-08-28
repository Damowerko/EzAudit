import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import GetAppIcon from '@material-ui/icons/GetApp';

import Document from '../images/document.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: '1rem',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Evidence({ files, handleDrawerOpen }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {files.length ? (
          files.map(file => {
            return(
              <Grid item xs={12} sm={6} md={4} lg={3} key={file._id}>
                <Paper className={classes.paper}>
                    <Typography variant="h6" align="left" onClick={handleDrawerOpen}>
                      {file.originalname}
                    </Typography>
                    <a href={'http://localhost:4000/api/file/' + file._id} target="_blank" download>
                      <IconButton>
                        <GetAppIcon />
                      </IconButton>
                    </a>
                    
                </Paper>
            </Grid>
            )
        })) : <p>Loading....</p>}
      </Grid>
    </div>
  );
}