import { Box, Collapse, Grid, IconButton } from '@material-ui/core';
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { Task, TaskStatus } from '../../../request-type/tasks.d';
import useStyles from './task-list.item.style';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTaskActions } from '../../../api/tasks/list';
import { useTaskManager } from '../../../management/task-manager';
import { getStatusStrByCode } from '../../../management/task-manager/utils';
import clsx from 'clsx';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import moment from 'moment';

export type TaskListOptionalProps = {
  showControls?: boolean;
  showStatus?: boolean;
  draggable?: ReactNode | boolean;
  showDetails?: boolean;
};

type TaskListItemProps = TaskListOptionalProps & {
  task: Task;
};

const TaskListItem = ({
  task,
  draggable = false,
  showStatus = false,
  showControls = false,
  showDetails = false,
}: TaskListItemProps): ReactElement => {
  const classes = useStyles();
  const { remove, update } = useTaskActions();
  const { selectTask, runningTaskId } = useTaskManager();
  const status = getStatusStrByCode(task.status);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');
  const [active, setActive] = useState<boolean>(false);

  // UI actions
  const handleRemove = useCallback(() => remove(task.id), [task, remove]);
  const handleSelect = useCallback(() => selectTask(task.id), [task, selectTask]);
  const handleToggleActive = useCallback(() => !draggable && setActive(!active), [active, draggable]);
  const handlePlay = useCallback(() => {
    update(task.id, { status: TaskStatus.running });
    runningTaskId && update(runningTaskId, { status: TaskStatus.paused });
  }, [update, task]);

  // generate placeholder
  useEffect(() => {
    if (!task.timeElapsed) return;
    const placeholder = moment(task.timeElapsed)
      .set({ h: 0, s: 0, ms: 0, m: 0 })
      .add(task.timeElapsed, 'ms')
      .format('HH:mm');

    setTimeElapsed(placeholder);
  }, [task.timeElapsed]);

  return (
    <>
      <Grid
        container
        className={clsx(classes.root, active && 'active')}
        justify="space-between"
        alignItems="center"
        onClick={handleToggleActive}
      >
        {draggable && (
          <Grid item xs={1}>
            {draggable}
          </Grid>
        )}
        <Grid item xs={3} sm={3} className={clsx(classes.description, active && 'active')}>
          {task.description || '(Empty)'}
        </Grid>
        {showStatus && (
          <Grid item xs={1}>
            <Box className={classes.status}>
              <span
                className={clsx({
                  [status]: true,
                  active: active,
                })}
              >
                {status}
              </span>
            </Box>
          </Grid>
        )}
        <Grid item xs={1} className={clsx(classes.timeElapsed, active && 'active')}>
          <span>{timeElapsed}</span>
        </Grid>

        {showControls && (
          <Grid item xs={4} md={3}>
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

        {showDetails && (
          <Grid item xs={1}>
            <ArrowBackIosIcon fontSize="small" className={clsx(classes.iconDetails, active && 'active')} />
          </Grid>
        )}
      </Grid>
      {showDetails && (
        <Collapse in={active}>
          <Grid container justify="center">
            <Grid item xs={10} className={classes.details}>
              <span>Task finished at </span>
              <span>{moment(task.finishedAt).format('DD/MM/YYYY h:mm A')}</span>
            </Grid>
          </Grid>
        </Collapse>
      )}
    </>
  );
};

export default TaskListItem;
