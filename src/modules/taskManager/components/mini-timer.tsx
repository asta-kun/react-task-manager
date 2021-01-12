import { Grid } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useTaskManager } from '../../../management/task-manager';
import useStyles from './mini-timer.style';

const MiniTimer = (): ReactElement => {
  const { countdown } = useTaskManager();
  const classes = useStyles();
  return (
    <Grid container className={classes.root} justify="center" alignItems="center">
      <Grid item>
        <span>{countdown}</span>
      </Grid>
    </Grid>
  );
};

export default MiniTimer;
