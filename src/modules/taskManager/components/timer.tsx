import { Box, Grid, IconButton } from '@material-ui/core';
import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import useStyles from './timer.style';
import AddIcon from '@material-ui/icons/Add';
import { useTaskManager } from '../../../management/task-manager';
import gsap from 'gsap';
import clsx from 'clsx';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import { useTaskActions } from '../../../api/tasks/list';
import { TaskStatus } from '../../../request-type/tasks.d';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import moment from 'moment';

const Timer = (): ReactElement => {
  const classes = useStyles();
  const { runningTaskId, tasks, countdown, create } = useTaskManager();
  const { update } = useTaskActions();
  const loadingRef = useRef<HTMLDivElement>(null);
  const { current: tl } = useRef(gsap.timeline({ paused: true }));

  // UI Actions
  const handlePause = useCallback(() => {
    runningTaskId && update(runningTaskId, { status: TaskStatus.paused });
  }, [runningTaskId, update]);

  const handleStop = useCallback(() => {
    runningTaskId && update(runningTaskId, { status: TaskStatus.completed, finishedAt: moment().toISOString() });
  }, [runningTaskId, update]);

  const handleReset = useCallback(() => {
    runningTaskId && update(runningTaskId, { timeElapsed: 0 });
  }, [runningTaskId, update]);

  // run animation
  useEffect(() => {
    if (!runningTaskId || !tasks[runningTaskId]) {
      tl.clear()
        .to(loadingRef.current, {
          duration: 0.1,
          width: 0,
        })
        .play();
      return;
    }

    tl.to(loadingRef.current, {
      duration: 0.1,
      width: (tasks[runningTaskId].timeElapsed / tasks[runningTaskId].maxTime) * 100 + '%',
    }).play();
  }, [loadingRef, tasks, countdown]);

  return (
    <Box className={classes.root}>
      <Grid container alignItems="center" justify="space-between">
        <Grid item xs={12} md={8}>
          <Box className={clsx(classes.time, runningTaskId && 'active')}>
            <div className={classes.loading} ref={loadingRef}></div>
            <span>{countdown}</span>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} className={classes.actions}>
          <Grid container justify="space-evenly" alignItems="center">
            <Grid item xs={3}>
              <IconButton onClick={handlePause} disabled={!runningTaskId} className={classes.button}>
                <PauseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={handleStop} disabled={!runningTaskId} className={classes.button}>
                <StopIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={handleReset} disabled={!runningTaskId} className={classes.button}>
                <RotateLeftIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={create} className={classes.button}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Timer;
