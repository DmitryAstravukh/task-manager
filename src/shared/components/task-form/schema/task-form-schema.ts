import { taskPriorityValues, taskStatusValues } from "@/shared/constants/shared-constants";
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(5, "Минимум 5 символов").max(100, "Максимум 100 символов"),

  description: z.string().trim().max(500, "Максимум 500 символов").optional().default(""),

  status: z.enum(taskStatusValues, "Выберите статус"),

  priority: z.enum(taskPriorityValues, "Выберите приоритет"),

  deadline: z
    .string()
    .min(1, "Укажите дедлайн")
    .refine((val) => {
      const d = new Date(val);
      return !Number.isNaN(d.getTime()) && d.getTime() >= Date.now();
    }, "Дедлайн не может быть раньше текущего времени"),

  tags: z
    .array(z.string().trim())
    .transform((tags) => [...new Set(tags.filter(Boolean))])
    .pipe(z.array(z.string()).min(1, "Добавьте минимум 1 тег")),
});
