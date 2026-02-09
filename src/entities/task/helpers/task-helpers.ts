import type { Task } from "@/entities/task/types/task-types.ts";
import type { GetTasksArgs } from "../api/task-api";
import { ITEMS_PER_PAGE } from "@/shared/constants/shared-constants";

export const isOverdue = (task: Task): boolean => {
  if (task.status === "done") return false;

  return new Date(task.deadline).getTime() < Date.now();
};

export const buildParams = (args: GetTasksArgs) => {
  const p = new URLSearchParams();

  const page = args.page ?? 1;
  const limit = args.limit ?? ITEMS_PER_PAGE;
  p.set("_page", String(page));
  p.set("_limit", String(limit));

  if (args.sort) p.set("_sort", args.sort);
  if (args.order) p.set("_order", args.order);

  if (args.status) p.set("status", args.status);
  if (args.priority) p.set("priority", args.priority);

  if (args.title?.trim()) p.set("title_like", args.title.trim());

  if (args.tagId) p.set("tags_like", args.tagId);

  return p;
};
