export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: number;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  messages: string[];
}

export interface TodoCreate {
  title: string;
  description: string;
  priority: number;
  dueAt?: string | null;
}

export interface TodoUpdate {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: number;
  dueAt?: string | null;
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}
