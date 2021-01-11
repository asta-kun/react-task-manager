import { Box, IconButton } from '@material-ui/core';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import TaskListItem, { TaskListOptionalProps } from './tasks-list.item';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskManager } from '../../../management/task-manager';
import { Task, TaskStatus } from '../../../request-type/tasks.d';
import { isEmpty } from 'lodash';
import useStyles from './task-list.style';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

type State = {
  [taskId: string]: Task;
};

type TaskListProps = {
  showStatus?: TaskStatus[];
  itemProps?: TaskListOptionalProps;
};

const TasksList = ({
  showStatus = [TaskStatus.paused, TaskStatus.pending, TaskStatus.running, TaskStatus.completed],
  itemProps = {},
}: TaskListProps): ReactElement => {
  const classes = useStyles();
  const { sortedTask, tasks } = useTaskManager();
  const [state, setState] = useState<State>(tasks);

  // interal sort for the list
  useEffect(() => {
    let count = 0;
    const items = Object.values(sortedTask).reduce((state, taskId) => {
      state[taskId] = {
        ...tasks[taskId],
        weight: count,
      };
      count += 1;
      return state;
    }, {} as State);
    setState(items);
  }, [tasks, sortedTask]);

  const filteredTasks = useMemo(
    () => sortedTask.filter((taskId) => !isEmpty(state[taskId]) && showStatus.includes(state[taskId].status)),
    [sortedTask, showStatus, state],
  );

  return (
    <Box className={classes.root}>
      {(filteredTasks.length > 0 &&
        filteredTasks.map((taskId) => (
          <Draggable draggableId={taskId} index={state[taskId].weight} key={taskId}>
            {(provided) => (
              <div {...provided.draggableProps} ref={provided.innerRef}>
                <TaskListItem
                  task={state[taskId]}
                  draggable={
                    (state[taskId].status !== TaskStatus.running && (
                      <IconButton {...provided.dragHandleProps}>
                        <DragIndicatorIcon />
                      </IconButton>
                    )) || (
                      <IconButton disabled>
                        <StarBorderIcon />
                      </IconButton>
                    )
                  }
                  {...itemProps}
                />
              </div>
            )}
          </Draggable>
        ))) || (
        <Box className={classes.error}>
          <span>
            <ErrorOutlineOutlinedIcon fontSize="large" />
          </span>
          <span>Not tasks</span>
        </Box>
      )}
    </Box>
  );
};

const Wrapper = (props: TaskListProps): ReactElement => {
  const [inArea, setInArea] = useState<boolean>(true);
  const { changePosition } = useTaskManager();
  const onDragEnd = useCallback(
    (e: DropResult) => {
      e.reason === 'DROP' && inArea && changePosition(e.draggableId, e.source.index, e.destination?.index || 0);
    },
    [changePosition, inArea],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            onMouseEnter={() => setInArea(true)}
            onMouseLeave={() => setInArea(false)}
          >
            <TasksList {...props} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Wrapper;
