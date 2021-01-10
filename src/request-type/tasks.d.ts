export interface Task {
  id: string;
  status: number;
  weight: number;
  description: string | null;
  maxTime: number; // milliseconds
  timeElapsed: number; // milliseconds
  createdAt: string;
  finishedAt: string | null;
}

export enum TaskStatus {
  completed = 3,
  paused = 3,
  running = 1,
  pending = 0,
}
