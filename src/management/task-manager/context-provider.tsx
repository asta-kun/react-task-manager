import moment from 'moment';
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTaskActions, useTasks } from '../../api/tasks/list';
import TaskCreate from '../../components/task-create';
import { TaskManagerContext } from './context';

type TaskManagerContextProps = {
  children: ReactNode;
};

const TaskManagerContextProvider = ({ children }: TaskManagerContextProps): ReactElement => {
  const { update } = useTaskActions();
  const { tasks, data } = useTasks(moment());
  const sortedTask = useMemo(() => tasks.sort((a, b) => data[a].weight - data[b].weight), [data, tasks]);

  const [openCreateNew, setOpenCreateNew] = useState<boolean>(false);

  // open modal to create new tasks
  const handleToggleCreateNew = useCallback(() => setOpenCreateNew(!openCreateNew), [openCreateNew]);

  // change positions
  const handleChangePosition = useCallback(
    (_: string, source: number, destination: number) => {
      const upDown = source < destination ? 1 : 0;
      let newSorted = [...sortedTask];
      const taskId = sortedTask[source];
      newSorted[source] = '';
      newSorted.splice(destination + upDown, 0, taskId);
      newSorted = newSorted.filter((item) => item);

      Promise.all(
        newSorted.map((taskId, index) => {
          return update(taskId, {
            weight: index,
          });
        }),
      );
    },
    [sortedTask],
  );

  return (
    <TaskManagerContext.Provider
      value={{ create: handleToggleCreateNew, changePosition: handleChangePosition, sortedTask, tasks: data }}
    >
      {children}
      <TaskCreate open={openCreateNew} onClose={handleToggleCreateNew} />
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerContextProvider;
