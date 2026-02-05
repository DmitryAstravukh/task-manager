import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../ui/Layout";
import { TasksListPage } from "@/pages/tasks-list-page/TasksListPage";
import { ErrorPage } from "@/pages/error-page/ErrorPage";

const TaskDetailPage = lazy(() => import("@/pages/task-detail-page/TaskDetailPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TasksListPage />,
      },
      {
        path: "task/:id",
        element: <TaskDetailPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
