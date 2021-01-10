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

export interface Actions {
  create: (PayloadCreate: Payload) => Promise<string>; // returns id
}
