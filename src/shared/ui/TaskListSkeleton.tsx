import { Grid, Box, Skeleton, Stack } from "@mui/material";
import { TaskCardSkeleton } from "./TaskCardSkeleton";
import { ITEMS_PER_PAGE } from "../constants/constants";

interface TasksListSkeletonProps {
  count?: number;
}

//если будет изменение количества в пагинации - использовать то число
export const TasksListSkeleton = ({ count = ITEMS_PER_PAGE }: TasksListSkeletonProps) => (
  <Box>
    <Grid container spacing={2} alignItems="stretch">
      {Array.from({ length: count }, (_, index) => (
        <Grid key={index} size={3}>
          <TaskCardSkeleton />
        </Grid>
      ))}
    </Grid>

    <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} variant="circular" width={32} height={32} />
      ))}
    </Stack>
  </Box>
);
