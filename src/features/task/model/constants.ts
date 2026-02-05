import type { TaskPriority, TaskStatus } from "./types";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "К выполнению",
  inProgress: "В работе",
  done: "Готово",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};
