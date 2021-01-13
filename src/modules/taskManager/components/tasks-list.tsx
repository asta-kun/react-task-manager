import { Box, IconButton } from '@material-ui/core';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import TaskListItem, { TaskListOptionalProps } from './tasks-list.item';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskManager } from '../../../management/task-manager';
import { Task, TaskStatus } from '../../../request-type/tasks.d';
import useStyles from './task-list.style';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import TaskListFilters, { FilterItem } from './task-list.filters';
import { isEmpty } from 'lodash';

type State = {
  [taskId: string]: Task;
};

type TaskListProps = {
  showStatus?: TaskStatus[];
  itemProps?: TaskListOptionalProps;
};

export type Filter = {
  search: string;
  duration: FilterItem;
};

const TasksList = ({
  showStatus = [TaskStatus.paused, TaskStatus.pending, TaskStatus.running, TaskStatus.completed],
  itemProps = {},
}: TaskListProps): ReactElement => {
  const classes = useStyles();
  const { sortedTask, tasks } = useTaskManager();
  const [state, setState] = useState<State>(tasks);
  const [filters, setFilters] = useState<Filter>({ search: '', duration: FilterItem.all });

  // interal sort for the list (ignore real indexs)
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

  // check data is fully charged (prevent undefined indexs)
  const filteredTasks = useMemo(
    () =>
      sortedTask.filter((taskId) => {
        if (isEmpty(state[taskId])) return false;

        // always show running
        // if (state[taskId].status === TaskStatus.running) return true;

        // description (can be null)
        if (filters.search && !(state[taskId].description || '').toLowerCase().includes(filters.search.toLowerCase()))
          return false;

        // duration short
        if (filters.duration === FilterItem.short) {
          if (state[taskId].timeElapsed > 1000 * 60 * 30) return false;
        }

        // medium
        if (filters.duration === FilterItem.medium) {
          if (!(state[taskId].timeElapsed > 1000 * 60 * 30 && state[taskId].timeElapsed < 1000 * 60 * 60)) return false;
        }

        // long
        if (filters.duration === FilterItem.long) {
          if (state[taskId].timeElapsed <= 1000 * 60 * 60) return false;
        }

        return true;
      }),
    [sortedTask, showStatus, state, filters],
  );

  const handleUpdateFIlters = useCallback((newFilters: Filter) => setFilters({ ...filters, ...newFilters }), [
    setFilters,
    filters,
  ]);

  // apply custom filters
  const realFilteredTask = useMemo(() => filteredTasks.filter((taskId) => showStatus.includes(state[taskId].status)), [
    state,
    filteredTasks,
    showStatus,
  ]);

  return (
    <Box className={classes.root}>
      {/* filters */}
      <TaskListFilters updateState={handleUpdateFIlters} />

      {/* items */}
      {(realFilteredTask.length > 0 &&
        filteredTasks.map(
          (taskId) =>
            (itemProps.draggable && (
              <Draggable draggableId={taskId} index={state[taskId].weight} key={taskId}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                    <Box style={{ margin: '.9em 0' }}>
                      {showStatus.includes(state[taskId].status) && (
                        <TaskListItem
                          {...itemProps}
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
                        />
                      )}
                    </Box>
                  </div>
                )}
              </Draggable>
            )) ||
            (showStatus.includes(state[taskId].status) && (
              <TaskListItem key={taskId} task={state[taskId]} {...itemProps} />
            )),
        )) || (
        <Box className={classes.error}>
          <span>
            <ErrorOutlineOutlinedIcon fontSize="large" />
          </span>
          <span>Add some task</span>
        </Box>
      )}
    </Box>
  );
};

const Wrapper = ({ listId, ...props }: TaskListProps & { listId: string }): ReactElement => {
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
      <Droppable droppableId={listId}>
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
