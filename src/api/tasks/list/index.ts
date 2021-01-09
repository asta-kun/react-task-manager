import { useCallback } from 'react';
import useSWR, { mutate as globalMutation } from 'swr';
import { Actions, initialData, Payload, Response } from './response.d';
import { isEmpty } from 'lodash';
import { Task } from '../../../request-type/tasks';
import moment, { Moment } from 'moment';
const BASE_END_POINT = '/process.api/karts';
const END_POINT_LIST = `${BASE_END_POINT}/list`;
export const mutateList = async () => globalMutation(END_POINT_LIST);

export const useTasks = (date: Moment): Response => {
  // date + 1 week
  const fetcher = useCallback(async (date: Moment): Promise<Response> => {
    const endRange = date.clone().add(7, 'd');
    const tasks = Object.values(localStorage)
      .map((task: Task) => task)
      .filter((task) => moment(task.createdAt).isSameOrAfter(date) && moment(task.createdAt).isBefore(endRange));

    // generate friendly map
    const data = tasks.reduce(
      (state, task) => {
        state.tasks.push(task.id);
        state.data[task.id] = task;
        return state;
      },
      { ...initialData, loading: false },
    );

    return data;
  }, []);

  const { data } = useSWR((!isEmpty(date) && END_POINT_LIST) || null, () => fetcher(date), {
    initialData,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    refreshInterval: 1000 * 30,
    dedupingInterval: 1000 * 3,
  });

  return data as Response;
};

// export const useKartsActions = (): Actions => {
//   const axios = useAxios();

//   const update = useCallback(
//     async (kartId: number, payload: Payload) => {
//       const url = `${BASE_END_POINT}/${kartId}`;
//       await axios.put(url, payload);
//       mutateList();
//     },
//     [axios]
//   );

//   return { update };
// };
