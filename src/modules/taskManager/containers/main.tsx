import React, { ReactElement } from 'react';
import { Box, Grid } from '@material-ui/core';
import useStyles from './main.style';
import Timer from '../components/timer';
import TasksList from '../components/tasks-list';
import Stats from '../components/stats';

const MainContainer = (): ReactElement => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Grid container justify="space-between">
        <Grid item xs={7}>
          <Timer />
          <br />
          <TasksList />
        </Grid>
        <Grid item xs={4}>
          <Stats />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContainer;
