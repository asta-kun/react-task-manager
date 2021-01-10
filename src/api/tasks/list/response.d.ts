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

export interface PayloadCreate {
  status: number;
  description: string | null;
  maxTime: number; // milliseconds
}

export interface PayloadUpdate {
  status?: number;
  description?: string | null;
  maxTime?: number; // milliseconds
  weight?: number;
}

export interface Actions {
  create: (state: PayloadCreate) => Promise<string>; // returns id
  update: (taskId: string, state: PayloadUpdate) => Promise<void>; // throw error
  remove: (taskId: string) => Promise<void>; // throw error
}
