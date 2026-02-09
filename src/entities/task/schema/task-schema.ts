import { taskPriorityValues, taskStatusValues } from "@/shared/constants/shared-constants";
import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
  deadline: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskListSchema = z.array(taskSchema);
