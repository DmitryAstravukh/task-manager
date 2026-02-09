import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/app/components/Layout";
import { TasksListPage } from "@/pages/tasks-list-page/TasksListPage.tsx";
import { ErrorPage } from "@/pages/error-page/ErrorPage";
import { Routes } from "@/app/router/routes.ts";

const TaskDetailPage = lazy(() => import("@/pages/task-detail-page/TaskDetailPage"));
const TaskEditPage = lazy(() => import("@/pages/task-edit-page/TaskEditPage"));
const TaskCreatePage = lazy(() => import("@/pages/task-create-page/TaskCreatePage"));

export const router = createBrowserRouter([
  {
    path: Routes.home,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TasksListPage />,
      },
      {
        path: Routes.taskDetail,
        element: <TaskDetailPage />,
      },
      {
        path: Routes.taskEdit,
        element: <TaskEditPage />,
      },
      {
        path: Routes.taskCreate,
        element: <TaskCreatePage />,
      },

      {
        path: Routes.error,
        element: <ErrorPage />,
      },
    ],
  },
]);
