import { createContext } from 'react';
import { Task } from '../../request-type/tasks.d';

/* definitions */

export type TaskManagerContext = {
  create: () => void;
  changePosition: (taskId: string, source: number, destination: number) => void;
  selectTask: (taskId: string) => void;
  countdown: string;
  addRandomTasks: () => Promise<void>;
  sortedTask: string[];
  selectedTask: string | null;
  runningTaskId: string | null;
  tasks: {
    [taskId: string]: Task;
  };
};

export const TaskManagerContext = createContext<TaskManagerContext>({
  // defaults
  addRandomTasks: async () => {
    // do nothing
  },
  create: () => {
    // do nothing
  },
  changePosition: (taskId: string, source: number, destination: number) => {
    // do nothing
  },
  selectTask: (taskId: string) => {
    // do nothing
  },
  countdown: '',
  sortedTask: [],
  tasks: {},
  selectedTask: null,
  runningTaskId: null,
});
