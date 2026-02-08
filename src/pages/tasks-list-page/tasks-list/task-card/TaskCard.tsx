import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { TaskData } from "@/shared/components/task-data/TaskData.tsx";
import type { Task } from "@/entities/task/types/task-types.ts";
import { buildRoute } from "@/app/router/routes.ts";
import { isOverdue } from "@/entities/task/helpers/is-overdue";

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
        sx={{
          height: "100%",
        }}
      >
        <Link
          to={buildRoute.taskDetail(task.id)}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <TaskData task={task} tagId={tagId} setTagId={setTagId} tagIsFilter />
        </Link>
      </CardActionArea>
    </Card>
  );
};
