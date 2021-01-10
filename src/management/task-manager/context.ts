import { createContext } from 'react';
import { Task } from '../../request-type/tasks.d';

export type TaskManagerContext = {
  create: () => void;
  changePosition: (taskId: string, source: number, destination: number) => void;
  selectTask: (taskId: string) => void;
  sortedTask: string[];
  tasks: {
    [taskId: string]: Task;
  };
};

export const TaskManagerContext = createContext<TaskManagerContext>({
  // defaults
  create: () => {
    // do nothing
  },
  changePosition: (taskId: string, source: number, destination: number) => {
    // do nothing
  },
  selectTask: (taskId: string) => {
    // do nothing
  },
  sortedTask: [],
  tasks: {},
});
