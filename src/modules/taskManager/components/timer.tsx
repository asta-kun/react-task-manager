import { Box, Grid, IconButton } from '@material-ui/core';
import React, { ReactElement } from 'react';
import useStyles from './timer.style';
import AddIcon from '@material-ui/icons/Add';
import { useTaskManager } from '../../../management/task-manager';

const Timer = (): ReactElement => {
  const classes = useStyles();
  const { create } = useTaskManager();
  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={9}>
          <Box className={classes.time}>
            <span>00:00:00</span>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Grid container>
            <Grid item xs={12}>
              <IconButton onClick={create}>
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
