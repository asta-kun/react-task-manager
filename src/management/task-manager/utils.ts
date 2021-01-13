import { TaskStatus } from '../../request-type/tasks.d';

// convert status (number) to string
export const getStatusStrByCode = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.completed:
      return 'completed';

    case TaskStatus.paused:
      return 'paused';

    case TaskStatus.pending:
      return 'pending';

    case TaskStatus.running:
      return 'running';

    default:
      return 'unknown';
  }
};

// simple random number
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
