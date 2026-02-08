import { generatePath } from "react-router-dom";

export const Routes = {
  home: "/",
  taskDetail: "/task/:id",
  error: "*",
};

export const buildRoute = {
  taskDetail: (id: string) => generatePath(Routes.taskDetail, { id }),
};
