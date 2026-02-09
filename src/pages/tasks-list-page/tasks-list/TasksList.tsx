import type { Task } from "@/entities/task/types/task-types";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { TaskCard } from "./task-card/TaskCard";
import { ITEMS_PER_PAGE } from "@/shared/constants/shared-constants";

type TasksListProps = {
  tasks: Task[];
  page: number;
  setPage: (page: number) => void;
  tagId: string;
  setTagId: (value: string) => void;
  isFetching: boolean;
  totalItems: number;
};

export const TasksList = ({
  tasks,
  page,
  setPage,
  tagId,
  setTagId,
  isFetching,
  totalItems,
}: TasksListProps) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (!isFetching) setPage(value);
  };

  return (
    <Box
      sx={{
        position: "relative",
        opacity: isFetching ? 0.5 : 1,
        pointerEvents: isFetching ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      <Grid container spacing={2} alignItems="stretch">
        {tasks.map((task) => (
          <Grid key={task.id} size={3}>
            <TaskCard task={task} tagId={tagId} setTagId={setTagId} />
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(totalItems / ITEMS_PER_PAGE)}
        page={page}
        onChange={handlePageChange}
        sx={{ width: "max-content", margin: "32px auto 0px auto" }}
        disabled={isFetching}
      />
    </Box>
  );
};
