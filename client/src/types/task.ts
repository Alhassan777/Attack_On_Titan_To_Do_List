export interface Subtask {
  id: number;
  name: string;
  completed: boolean;
  subtasks?: Subtask[];
}

export interface Task {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  collapsed?: boolean;
  subtasks?: Subtask[];
  priority?: string;
}

export type TaskCategory = string;