import moment from 'moment';
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { mutateList, useTaskActions, useTasks } from '../../api/tasks/list';
import Task, { State } from '../../components/task';
import AddButton from '../../modules/taskManager/components/add-button';
import MiniTimer from '../../modules/taskManager/components/mini-timer';
import { TaskStatus } from '../../request-type/tasks.d';
import { TaskManagerContext } from './context';
import { getRandomInt } from './utils';

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
  const { pathname } = useLocation();
  const { update, create } = useTaskActions();
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

  // trigger when a task is selected
  useEffect(() => {
    if (selectedTask) {
      setSelectedTaskState({ ...data[selectedTask] });
      setOpenTaskEditor(true);
    } else {
      setSelectedTaskState({ ...initialStateSelectedTask });
    }
  }, [selectedTask]);

  //  get index of running task (only one)
  useEffect(() => {
    const runningTask = tasks.find((taskId) => data[taskId].status === TaskStatus.running);
    setRunningTaskId(runningTask || null);
  }, [tasks, data]);

  // detect when a new tasks is started and is updated to first position
  useEffect(() => {
    if (runningTaskId && data[runningTaskId] && data[runningTaskId].weight !== 0) {
      handleChangePosition(
        runningTaskId,
        sortedTask.findIndex((taskId) => taskId === runningTaskId),
        0,
      );
    }
  }, [runningTaskId, data]);

  // controller to running tasks
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

        update(runningTaskId, {
          status: TaskStatus.completed,
          timeElapsed: data[runningTaskId].maxTime,
          finishedAt: moment().toISOString(),
        });
        setRunningTaskId(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTaskId, data, selectedTask]);

  // generate 50 random tanks
  const handleAddRandomTasks = useCallback(async () => {
    const maxTimes = [
      1000 * 60 * 60 * 2, // super long
      1000 * 60 * 60, // long
      1000 * 60 * 45, // medium
      1000 * 60 * 30, // short
    ];
    let count = 50;
    const _status = [TaskStatus.completed, TaskStatus.pending, TaskStatus.paused];
    while (count >= 0) {
      const day = getRandomInt(0, 6);
      const hour = getRandomInt(0, 23);
      const maxTime = maxTimes[getRandomInt(0, 3)];
      const timeElapsed = maxTime - (maxTime * getRandomInt(0, 20)) / 100;
      const status = _status[getRandomInt(0, 2)];

      const taskId = await create({ description: `Task #${count}`, status, maxTime }, false);

      await update(
        taskId,
        {
          timeElapsed: status !== TaskStatus.pending ? timeElapsed : 0,
          createdAt: moment().set({ day, hour }).toISOString(),
          finishedAt:
            status !== TaskStatus.pending ? moment().set({ day, hour }).add(timeElapsed, 'ms').toISOString() : null,
        },
        false,
      );

      count--;
    }

    mutateList();
  }, [create, update, mutateList]);

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
        addRandomTasks: handleAddRandomTasks,
      }}
    >
      {children}
      {/* global component to edit/create tasks */}
      {openTaskEditor && <Task open={openTaskEditor} onClose={handleToggleTaskEditor} task={selectedTaskState} />}
      {/* mini countdown 7u7 */}
      {pathname !== '/taskManager' && <MiniTimer />}
      {/* add 50 random tasks */}
      <AddButton />
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerContextProvider;
