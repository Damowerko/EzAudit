import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Document from '../images/document.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  image: {
      width: '100%',
      height: '500px'
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Evidence() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper}>
                <img className={classes.image} src={Document} alt="document" />
            </Paper>
        </Grid>
      </Grid>
    </div>
  );
}