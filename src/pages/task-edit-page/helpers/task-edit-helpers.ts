import type { Task } from "@/entities/task/types/task-types";
import type { TaskFormValues } from "@/shared/components/task-form/types/task-form-types";

export const mapTaskToFormValues = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description ?? "",
  status: task.status,
  priority: task.priority,
  deadline: task.deadline,
  tags: task.tags,
});
