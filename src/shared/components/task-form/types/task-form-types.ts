import type { TaskPriority, TaskStatus } from "@/entities/task/types/task-types";

type BaseTaskFormProps = {
  onSubmit: (data: TaskFormValues) => void;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  availableTags?: string[];
};

type CreateFormProps = BaseTaskFormProps & {
  mode: "create";
  defaultValues?: Partial<TaskFormValues>;
};

type EditFormProps = BaseTaskFormProps & {
  mode: "edit";
  defaultValues: TaskFormValues;
};

export type TaskFormProps = CreateFormProps | EditFormProps;

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  tags: string[];
};
