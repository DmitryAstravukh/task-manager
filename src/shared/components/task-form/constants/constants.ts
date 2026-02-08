import { TASK_STATUS_LABEL, TASK_PRIORITY_LABEL } from "@/entities/task/constants/task-constants";
import { mapRecordToSelectItems } from "@/shared/helpers/helpers";
import type { TaskFormValues } from "../types/types";

export const STATUS_ITEMS = mapRecordToSelectItems(TASK_STATUS_LABEL);
export const PRIORITY_ITEMS = mapRecordToSelectItems(TASK_PRIORITY_LABEL);

export const CREATE_FORM_VALUES: Partial<TaskFormValues> = {
  title: "",
  description: "",
  status: undefined,
  priority: undefined,
  deadline: "",
  tags: [],
};
