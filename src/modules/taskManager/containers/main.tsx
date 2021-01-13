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
        <Grid item md={7} xs={12}>
          <Timer />
          <br />
          <TasksList
            showStatus={[TaskStatus.running, TaskStatus.paused, TaskStatus.pending]}
            itemProps={{ showStatus: true, showControls: true, draggable: true }}
            listId="1"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Stats />
          <TasksList
            listId="2"
            showStatus={[TaskStatus.completed]}
            itemProps={{ draggable: false, showStatus: true, showDetails: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContainer;
