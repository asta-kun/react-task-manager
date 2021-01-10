import React, { ReactElement, ReactNode, useState } from 'react';
import TaskCreate from '../../components/task-create';
import { TaskManagerContext } from './context';

type TaskManagerContextProps = {
  children: ReactNode;
};

const TaskManagerContextProvider = ({ children }: TaskManagerContextProps): ReactElement => {
  const [openCreateNew, setOpenCreateNew] = useState<boolean>(false);

  const handleToggleCreateNew = () => setOpenCreateNew(!openCreateNew);

  return (
    <TaskManagerContext.Provider value={{ create: handleToggleCreateNew }}>
      {children}
      <TaskCreate open={openCreateNew} onClose={handleToggleCreateNew} />
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerContextProvider;
