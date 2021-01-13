import { useContext } from 'react';
import { TaskManagerContext } from './context';

const useTaskManager = (): TaskManagerContext => useContext(TaskManagerContext);

export default useTaskManager;
