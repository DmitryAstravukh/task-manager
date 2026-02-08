import { TaskDataSkeleton } from "@/shared/components/task-data/ui/TaskDataSkeleton";
import { Card, CardContent } from "@mui/material";

export const TaskCardSkeleton = () => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      boxShadow: 3,
      overflow: "hidden",
      backgroundColor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        height: "100%",
      }}
    >
      <TaskDataSkeleton />
    </CardContent>
  </Card>
);
