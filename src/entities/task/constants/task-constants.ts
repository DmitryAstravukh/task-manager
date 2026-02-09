import type {
  TaskPriority,
  TaskPriorityColor,
  TaskStatus,
} from "@/entities/task/types/task-types.ts";
import type { SortOrder } from "@/shared/types/shared-types";

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

export const TASK_PRIORITY_COLOR: Record<TaskPriority, TaskPriorityColor> = {
  low: "success",
  medium: "warning",
  high: "error",
};

export const TASK_DEADLINE_SORT: Record<SortOrder, string> = {
  asc: "Сначала срочные",
  desc: "Сначала не срочные",
};

export const TASK_CREATED_AT_SORT: Record<SortOrder, string> = {
  asc: "Сначала старые",
  desc: "Сначала новые",
};
