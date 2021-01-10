import { Box, IconButton } from '@material-ui/core';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import TaskListItem from './tasks-list.item';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskManager } from '../../../management/task-manager';
import { Task } from '../../../request-type/tasks.d';
import { isEmpty } from 'lodash';
import useStyles from './task-list.style';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

type State = {
  [taskId: string]: Task;
};

const TasksList = (): ReactElement => {
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

  return (
    <Box className={classes.root}>
      {sortedTask
        .filter((taskId) => !isEmpty(state[taskId]))
        .map((taskId) => (
          <Draggable draggableId={taskId} index={state[taskId].weight} key={taskId}>
            {(provided) => (
              <div {...provided.draggableProps} ref={provided.innerRef}>
                <TaskListItem
                  task={state[taskId]}
                  draggable={
                    <IconButton {...provided.dragHandleProps}>
                      <DragIndicatorIcon />
                    </IconButton>
                  }
                />
              </div>
            )}
          </Draggable>
        ))}
    </Box>
  );
};

const Wrapper = (): ReactElement => {
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
            <TasksList />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Wrapper;
