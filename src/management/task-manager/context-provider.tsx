import React, { ReactElement, ReactNode } from 'react';
import { TaskManagerContext } from './context';

type TaskManagerContextProps = {
  children: ReactNode;
};

const TaskManagerContextProvider = ({ children }: TaskManagerContextProps): ReactElement => {
  return <TaskManagerContext.Provider value={{}}>{children}</TaskManagerContext.Provider>;
};

export default TaskManagerContextProvider;
