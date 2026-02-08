// taskForm.schema.ts
import { z } from "zod";
import type { TaskStatus, TaskPriority } from "@/entities/task/types/task-types";

const taskStatusValues: [TaskStatus, ...TaskStatus[]] = ["todo", "inProgress", "done"];
const taskPriorityValues: [TaskPriority, ...TaskPriority[]] = ["low", "medium", "high"];

export const taskFormSchema = z.object({
  title: z.string().min(5, "Минимум 5 символов").max(100, "Максимум 100 символов"),

  description: z.string().max(500, "Максимум 500 символов").default(""),

  status: z.enum(taskStatusValues, "Выберите статус"),

  priority: z.enum(taskPriorityValues, "Выберите приоритет"),

  deadline: z.string().min(1, "Укажите дедлайн"),

  tags: z.array(z.string()).min(1, "Добавьте минимум 1 тег"),
});
