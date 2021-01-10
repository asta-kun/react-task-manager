import { Box, Grid, IconButton } from '@material-ui/core';
import moment from 'moment';
import React, { ReactElement, ReactNode, RefObject, useCallback } from 'react';
import { Task } from '../../../request-type/tasks';
import useStyles from './task-list.item.style';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import { useTaskActions } from '../../../api/tasks/list';

type TaskListItemProps = {
  task: Task;
  draggable: ReactNode;
};

const TaskListItem = ({ task, draggable }: TaskListItemProps): ReactElement => {
  const classes = useStyles();
  const { remove } = useTaskActions();

  const handleRemove = useCallback(() => remove(task.id), [task, remove]);

  return (
    <Grid container className={classes.root} justify="space-evenly" alignItems="center">
      <Grid item xs={1}>
        {draggable}
      </Grid>
      <Grid item xs={5} className={classes.description}>
        {task.description || '(Empty)'}
      </Grid>
      <Grid item xs={2}>
        <Box className={classes.status}>
          <span>pending</span>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Grid container>
          <Grid item xs={3}>
            <IconButton size="small">
              <PlayArrowIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <IconButton size="small">
              <StopIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <IconButton size="small" onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TaskListItem;
