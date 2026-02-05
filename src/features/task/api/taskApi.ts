import { baseApi } from "@/shared/api/baseApi.ts";
import type { Task, TaskPriority, TaskStatus } from "../model/types";

export type TasksSortField = "createdAt" | "deadline";
export type SortOrder = "asc" | "desc";

export type GetTasksArgs = {
  page?: number;
  limit?: number;

  status?: TaskStatus;
  priority?: TaskPriority;
  tagId?: string;

  title?: string;

  sort?: TasksSortField;
  order?: SortOrder;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

function buildParams(args: GetTasksArgs) {
  const p = new URLSearchParams();

  const page = args.page ?? 1;
  const limit = args.limit ?? 10;
  p.set("_page", String(page));
  p.set("_limit", String(limit));

  if (args.sort) p.set("_sort", args.sort);
  if (args.order) p.set("_order", args.order);

  if (args.status) p.set("status", args.status);
  if (args.priority) p.set("priority", args.priority);

  if (args.title?.trim()) p.set("title_like", args.title.trim());

  // Для массива tags json-server часто работает через *_like
  if (args.tagId) p.set("tags_like", args.tagId);

  return p;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Paginated<Task>, GetTasksArgs>({
      query: (args) => {
        const params = buildParams(args);
        return { url: `/tasks?${params.toString()}` };
      },
      transformResponse: (response: Task[], meta, arg) => {
        const totalHeader = meta?.response?.headers.get("X-Total-Count");
        const total = totalHeader ? Number(totalHeader) : response.length;

        return {
          items: response,
          total,
          page: arg.page ?? 1,
          limit: arg.limit ?? 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Task" as const, id: "LIST" },
              ...result.items.map((t) => ({ type: "Task" as const, id: t.id })),
            ]
          : [{ type: "Task" as const, id: "LIST" }],
    }),

    getTaskById: build.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Task", id }],
    }),

    createTask: build.mutation<Task, Task>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: build.mutation<Task, { id: string; patch: Partial<Task> }>({
      query: ({ id, patch }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Task", id: arg.id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // отдельный PATCH статуса (по требованию)
    patchTaskStatus: build.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Task", id: arg.id },
        { type: "Task", id: "LIST" },
      ],
    }),

    deleteTask: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  usePatchTaskStatusMutation,
  useDeleteTaskMutation,
} = taskApi;
