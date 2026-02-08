import type { Task } from "@/entities/task/types/task-types.ts";

/**
 * Возвращает true, если задача просрочена: дедлайн уже прошёл (deadline < now)
 * и задача при этом не имеет статус done.
 *
 * deadline должен  корректно парсится через new Date()
 * (например, ISO-строка)
 */
export function isOverdue(task: Task): boolean {
  if (task.status === "done") return false;

  return new Date(task.deadline).getTime() < Date.now();
}
