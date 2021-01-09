import { Task } from '../../../request-type/tasks';

export interface Response {
  tasks: string[];
  data: {
    [key: string]: Task;
  };
  loading: boolean;
}
export const initialData: Response = {
  tasks: [],
  data: {},
  loading: true,
};

export interface Payload {
  status?: number;
  notes?: string;
  transponder?: string;
  track_id?: number;
}

export interface Actions {
  update: (taskId: number, payload: Payload) => Promise<void>;
}
