import { buildRoute } from "@/app/router/routes.ts";
import { isOverdue } from "@/entities/task/helpers/task-helpers";
import type { Task } from "@/entities/task/types/task-types.ts";
import { TaskData } from "@/shared/components/task-data/TaskData.tsx";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";
type TaskCardProps = {
  task: Task;
  tagId: string;
  setTagId: (value: string) => void;
};

export const TaskCard = ({ task, tagId, setTagId }: TaskCardProps) => {
  const overdue = isOverdue(task);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        backgroundColor: "background.paper",
        border: overdue ? "2px solid" : "1px solid",
        borderColor: overdue ? "error.main" : "divider",
      }}
    >
      <CardActionArea
        //меняем на div чтобы не было вложенности кнопка в кнопке(но при этом при наведении на карточку url перехода высвечивается)
        slots={{ root: "div" }}
        sx={{
          height: "100%",
        }}
      >
        <Link
          to={buildRoute.taskDetail(task.id)}
          style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
        >
          <TaskData task={task} tagId={tagId} setTagId={setTagId} tagIsFilter isTrimDescription />
        </Link>
      </CardActionArea>
    </Card>
  );
};
