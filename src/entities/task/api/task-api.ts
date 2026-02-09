import { baseApi } from "@/shared/api/baseApi.ts";
import type { SortOrder, TasksSortField } from "@/shared/types/shared-types";
import { taskListSchema, taskSchema } from "../schema/task-schema";
import type { Task, TaskPriority, TaskStatus } from "../types/task-types";
import { buildParams } from "../helpers/task-helpers";

export type GetTasksArgs = {
  page: number;
  limit?: number;

  title: string;

  status: TaskStatus | "";
  priority: TaskPriority | "";
  tagId: string;

  sort: TasksSortField | "";
  order: SortOrder | "";
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export const taskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Paginated<Task>, GetTasksArgs>({
      query: (args) => {
        const params = buildParams(args);
        return { url: `/tasks?${params.toString()}` };
      },
      //предполагаем что придет Task[]
      transformResponse: (response: unknown, meta, arg) => {
        //проверяем входящие данные на корректность, выкинет ошибку если не верно
        const items = taskListSchema.parse(response);

        const totalHeader = meta?.response?.headers.get("X-Total-Count");
        const total = totalHeader ? Number(totalHeader) : items.length;

        return {
          items,
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
      transformResponse: (response: unknown) => {
        return taskSchema.parse(response);
      },
      providesTags: (_res, _err, id) => [{ type: "Task", id }],
    }),

    createTask: build.mutation<Task, Task>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        return taskSchema.parse(response);
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: build.mutation<Task, { id: string; patch: Partial<Task> }>({
      query: ({ id, patch }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: unknown) => {
        return taskSchema.parse(response);
      },
      invalidatesTags: (_res, _err, arg) => [
        { type: "Task", id: arg.id },
        { type: "Task", id: "LIST" },
      ],
    }),

    patchTaskStatus: build.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }),
      transformResponse: (response: unknown) => {
        return taskSchema.parse(response);
      },
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
