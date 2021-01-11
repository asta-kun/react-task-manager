import { TaskStatus } from '../../request-type/tasks.d';

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
