import {
  TASK_CREATED_AT_SORT,
  TASK_DEADLINE_SORT,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
} from "@/entities/task/constants/task-constants";
import { mapRecordToSelectItems } from "@/shared/helpers/helpers";

export const PRIORITY_ITEMS = mapRecordToSelectItems(TASK_PRIORITY_LABEL);

export const STATUS_ITEMS = mapRecordToSelectItems(TASK_STATUS_LABEL);

export const DEADLINE_ITEMS = mapRecordToSelectItems(TASK_DEADLINE_SORT);

export const CREATED_AT_ITEMS = mapRecordToSelectItems(TASK_CREATED_AT_SORT);
