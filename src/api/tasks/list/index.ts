import { useCallback } from 'react';
import useSWR, { mutate as globalMutation } from 'swr';
import { Actions, initialData, PayloadCreate, PayloadUpdate, Response } from './response.d';
import { Task, TaskStatus } from '../../../request-type/tasks.d';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';

const BASE_END_POINT = '/process.api/karts';
const END_POINT_LIST = `${BASE_END_POINT}/list`;

export const mutateList = async () => globalMutation(END_POINT_LIST);

const getAllTask = (startDate: Moment, endDate: Moment) =>
  Object.values(window.localStorage)
    .map((task: string) => JSON.parse(task) as Task)
    .filter((task) => moment(task.createdAt).isSameOrAfter(startDate) && moment(task.createdAt).isBefore(endDate));

export const useTasks = (date: Moment): Response => {
  // date + 1 week
  const fetcher = useCallback(async (date: Moment): Promise<Response> => {
    const startDate = date.clone().set({ day: 0, hour: 0, minute: 0, second: 0 });
    const endDate = startDate.clone().add(7, 'd');
    const tasks = getAllTask(startDate, endDate);

    // generate friendly map
    const data = tasks.reduce(
      (state, task) => {
        state.tasks.push(task.id);
        state.data[task.id] = task;
        return state;
      },
      { tasks: [], data: {}, loading: false } as Response,
    );

    return data;
  }, []);

  const { data } = useSWR(END_POINT_LIST, () => fetcher(date), {
    initialData,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    refreshInterval: 1000 * 30,
    dedupingInterval: 1000 * 5,
  });

  return data as Response;
};

export const useTaskActions = (): Actions => {
  const create = useCallback(async (rawPayload: PayloadCreate) => {
    const startDate = moment().set({ day: 0, hour: 0, minute: 0, second: 0 });
    const endDate = startDate.clone().add(7, 'd');
    const tasks = getAllTask(startDate, endDate);
    const weight =
      tasks.reduce((state, task) => {
        if (task.weight < state) return task.weight;
        return state;
      }, 0) - 1;

    // apply defaults
    const { description = '', status = TaskStatus.pending, maxTime = 1000 * 60 * 30 } = rawPayload;

    const newTask: Task = {
      id: nanoid(),
      description,
      status,
      maxTime,
      weight,
      timeElapsed: 0,
      createdAt: moment().toISOString(),
      finishedAt: null,
    };

    window.localStorage.setItem(newTask.id, JSON.stringify(newTask));

    mutateList();

    return newTask.id;
  }, []);

  const update = useCallback(async (taskId: string, rawPayload: PayloadUpdate) => {
    const rawTask: string = window.localStorage.getItem(taskId) || '';
    if (!rawTask) throw new Error();
    const task = JSON.parse(rawTask) as Task;

    // overwrite fields
    const updatedTask: Task = {
      ...task,
      ...rawPayload,
    };

    window.localStorage.setItem(updatedTask.id, JSON.stringify(updatedTask));
    mutateList();
  }, []);

  const remove = useCallback(async (taskId: string) => {
    window.localStorage.removeItem(taskId);
    mutateList();
  }, []);

  return { create, update, remove };
};
