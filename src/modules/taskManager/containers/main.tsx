import React, { ReactElement } from 'react';
import { Box, Grid } from '@material-ui/core';
import useStyles from './main.style';
import Timer from '../components/timer';
import TasksList from '../components/tasks-list';
import Stats from '../components/stats';
import { TaskStatus } from '../../../request-type/tasks.d';

const MainContainer = (): ReactElement => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Grid container justify="space-between">
        <Grid item xs={7}>
          <Timer />
          <br />
          <TasksList
            showStatus={[TaskStatus.running, TaskStatus.paused, TaskStatus.pending]}
            itemProps={{ showStatus: true, showControls: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <Stats />
          <TasksList
            showStatus={[TaskStatus.completed]}
            itemProps={{ draggable: false, showStatus: true, showControls: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContainer;
