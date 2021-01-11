import { Box, Grid, IconButton } from '@material-ui/core';
import React, { ReactElement, ReactNode, useCallback } from 'react';
import { Task, TaskStatus } from '../../../request-type/tasks.d';
import useStyles from './task-list.item.style';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTaskActions } from '../../../api/tasks/list';
import { useTaskManager } from '../../../management/task-manager';
import { getStatusStrByCode } from '../../../management/task-manager/utils';
import clsx from 'clsx';

export type TaskListOptionalProps = {
  showControls?: boolean;
  showStatus?: boolean;
  draggable?: ReactNode | boolean;
};

type TaskListItemProps = TaskListOptionalProps & {
  task: Task;
};

const TaskListItem = ({
  task,
  draggable = false,
  showStatus = false,
  showControls = false,
}: TaskListItemProps): ReactElement => {
  const classes = useStyles();
  const { remove, update } = useTaskActions();
  const { selectTask, runningTaskId } = useTaskManager();

  const handleRemove = useCallback(() => remove(task.id), [task, remove]);
  const handleSelect = useCallback(() => selectTask(task.id), [task, selectTask]);
  const handlePlay = useCallback(() => {
    update(task.id, { status: TaskStatus.running });
    runningTaskId && update(runningTaskId, { status: TaskStatus.paused });
  }, [update, task]);

  const status = getStatusStrByCode(task.status);

  return (
    <Grid container className={classes.root} justify="space-between" alignItems="center">
      {draggable && (
        <Grid item xs={1}>
          {draggable}
        </Grid>
      )}
      <Grid item xs={4} className={classes.description}>
        {task.description || '(Empty)'}
      </Grid>
      {showStatus && (
        <Grid item xs={1}>
          <Box className={classes.status}>
            <span
              className={clsx({
                [status]: true,
              })}
            >
              {status}
            </span>
          </Box>
        </Grid>
      )}
      <Grid item xs={1}></Grid>
      {showControls && (
        <Grid item xs={3}>
          <Grid container justify="space-between">
            {task.status !== TaskStatus.completed && (
              <Grid item xs={3}>
                <IconButton
                  size="small"
                  disabled={![TaskStatus.pending, TaskStatus.paused].includes(task.status)}
                  onClick={handlePlay}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Grid>
            )}

            <Grid item xs={3}>
              <IconButton size="small" onClick={handleSelect}>
                <SettingsIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <IconButton size="small" onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TaskListItem;
