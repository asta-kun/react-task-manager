import { createContext } from 'react';

export type TaskManagerContext = {
  create: () => void;
};

export const TaskManagerContext = createContext<TaskManagerContext>({
  // defaults
  create: () => {
    // do nothing
  },
});
