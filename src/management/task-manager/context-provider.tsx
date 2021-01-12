import moment from 'moment';
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTaskActions, useTasks } from '../../api/tasks/list';
import Task, { State } from '../../components/task';
import { TaskStatus } from '../../request-type/tasks.d';
import { TaskManagerContext } from './context';

const initialStateSelectedTask = {
  description: null,
  id: null,
  status: 0,
  maxTime: 1000 * 60 * 30,
};
const defaultFormat = 'HH:mm:ss';
const initialStateCountdown = '00:00:00';

type TaskManagerContextProps = {
  children: ReactNode;
};

const TaskManagerContextProvider = ({ children }: TaskManagerContextProps): ReactElement => {
  const { update } = useTaskActions();
  const { tasks, data } = useTasks(moment());
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const sortedTask = useMemo(() => tasks.sort((a, b) => data[a].weight - data[b].weight), [data, tasks]);
  const [openTaskEditor, setOpenTaskEditor] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>(initialStateCountdown);
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
      newSorted.splice(destination + upDown + (runningTaskId && taskId !== runningTaskId ? 1 : 0), 0, taskId);
      newSorted = newSorted.filter((item) => item);

      Promise.all(
        newSorted.map((taskId, index) => {
          return update(taskId, {
            weight: index,
          });
        }),
      );
    },
    [sortedTask, runningTaskId],
  );

  // add elapsed time to runningTask
  const handleAddElapsedTime = useCallback(
    (elapsedMS: number) => {
      runningTaskId &&
        update(runningTaskId, {
          timeElapsed: elapsedMS,
        });
    },
    [runningTaskId, update, data],
  );

  useEffect(() => {
    if (selectedTask) {
      setSelectedTaskState({ ...data[selectedTask] });
      setOpenTaskEditor(true);
    } else {
      setSelectedTaskState({ ...initialStateSelectedTask });
    }
  }, [selectedTask]);

  useEffect(() => {
    const runningTask = tasks.find((taskId) => data[taskId].status === TaskStatus.running);
    setRunningTaskId(runningTask || null);
  }, [tasks, data]);

  useEffect(() => {
    if (runningTaskId && data[runningTaskId] && data[runningTaskId].weight !== 0) {
      console.warn(data[runningTaskId].weight);
      handleChangePosition(
        runningTaskId,
        sortedTask.findIndex((taskId) => taskId === runningTaskId),
        0,
      );
    }
  }, [runningTaskId, data]);

  useEffect(() => {
    // nothing running
    if (!runningTaskId || !data[runningTaskId]) return setCountdown(initialStateCountdown);

    const date = moment()
      .set({ hours: 0, minutes: 0, seconds: 0, ms: 0 })
      .add(data[runningTaskId].maxTime, 'ms')
      .add(-data[runningTaskId].timeElapsed, 'ms');

    let elapsed = data[runningTaskId].timeElapsed;

    setCountdown(date.format(defaultFormat));

    if (selectedTask === runningTaskId) return; // stop when modal is opened

    const interval = setInterval(async () => {
      elapsed += 1000;
      date.add(-1, 's');
      handleAddElapsedTime(elapsed);
      const currentCountdown = date.format(defaultFormat);
      setCountdown(currentCountdown);

      if (elapsed >= data[runningTaskId].maxTime) {
        clearInterval(interval);
        runningTaskId &&
          update(runningTaskId, {
            status: TaskStatus.completed,
            timeElapsed: data[runningTaskId].maxTime,
            finishedAt: moment().toISOString(),
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTaskId, data, selectedTask]);

  return (
    <TaskManagerContext.Provider
      value={{
        create: handleToggleTaskEditor,
        changePosition: handleChangePosition,
        sortedTask,
        tasks: data,
        selectTask: handleSelectTask,
        selectedTask,
        runningTaskId,
        countdown,
      }}
    >
      {children}
      {openTaskEditor && <Task open={openTaskEditor} onClose={handleToggleTaskEditor} task={selectedTaskState} />}
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerContextProvider;
