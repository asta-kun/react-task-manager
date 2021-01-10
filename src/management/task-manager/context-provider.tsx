import moment from 'moment';
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTaskActions, useTasks } from '../../api/tasks/list';
import Task, { State } from '../../components/task';
import { TaskManagerContext } from './context';

const initialStateSelectedTask = {
  description: null,
  id: null,
  status: 0,
  maxTime: 1000 * 60 * 30,
};

type TaskManagerContextProps = {
  children: ReactNode;
};

const TaskManagerContextProvider = ({ children }: TaskManagerContextProps): ReactElement => {
  const { update } = useTaskActions();
  const { tasks, data } = useTasks(moment());
  const sortedTask = useMemo(() => tasks.sort((a, b) => data[a].weight - data[b].weight), [data, tasks]);

  const [openTaskEditor, setOpenTaskEditor] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedTaskState, setSelectedTaskState] = useState<State>({
    ...initialStateSelectedTask,
  });

  const handleSelectTask = useCallback((taskId: string) => setSelectedTask(taskId), [setSelectedTask]);

  // open modal to create/update tasks
  const handleToggleTaskEditor = useCallback(() => {
    openTaskEditor && setSelectedTask(null);

    setOpenTaskEditor(!openTaskEditor);
  }, [openTaskEditor]);

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

  useEffect(() => {
    if (selectedTask) {
      setSelectedTaskState({ ...data[selectedTask] });
      setOpenTaskEditor(true);
    } else {
      setSelectedTaskState({ ...initialStateSelectedTask });
    }
  }, [selectedTask]);

  return (
    <TaskManagerContext.Provider
      value={{
        create: handleToggleTaskEditor,
        changePosition: handleChangePosition,
        sortedTask,
        tasks: data,
        selectTask: handleSelectTask,
      }}
    >
      {children}
      <Task open={openTaskEditor} onClose={handleToggleTaskEditor} task={selectedTaskState} />
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerContextProvider;
