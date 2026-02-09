import { generatePath } from "react-router-dom";

export const Routes = {
  home: "/",
  taskDetail: "/task/:id",
  taskEdit: "/task/:id/edit",
  taskCreate: "/task/create",
  error: "*",
};

export const buildRoute = {
  taskDetail: (id: string) => generatePath(Routes.taskDetail, { id }),
  taskEdit: (id: string) => generatePath(Routes.taskEdit, { id }),
  taskCreate: () => generatePath(Routes.taskCreate),
};
