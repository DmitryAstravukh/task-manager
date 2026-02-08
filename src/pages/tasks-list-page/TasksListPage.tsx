import { useGetTasksQuery } from "@/entities/task/api/task-api";
import { TaskFilter } from "@/pages/tasks-list-page/task-filter/TaskFilter.tsx";
import { TasksList } from "@/pages/tasks-list-page/tasks-list/TasksList.tsx";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { Fab, Typography, Box } from "@mui/material";
import { useTaskFilters } from "./hooks/useTaskFilter";
import { TasksListSkeleton } from "@/shared/ui/TaskListSkeleton";
import { buildRoute } from "@/app/router/routes";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

export const TasksListPage = () => {
  const filters = useTaskFilters();

  const { data, isLoading, isFetching, error, refetch } = useGetTasksQuery(filters.queryParams);

  const isHaveData = Array.isArray(data?.items) && data.items.length > 0;

  const isNoData =
    !isLoading && !isFetching && Array.isArray(data?.items) && data.items.length === 0;

  return (
    <ErrorBoundary onReset={refetch}>
      <TaskFilter filters={filters} error={error} refetch={refetch} />

      <Box sx={{ margin: "24px 0" }}>
        {isLoading && <TasksListSkeleton />}

        {isHaveData && (
          <TasksList
            tasks={data.items}
            page={filters.page}
            setPage={filters.setPage}
            tagId={filters.tagId}
            setTagId={filters.setTagId}
            isFetching={isFetching}
            totalItems={data.total}
          />
        )}

        {isNoData && <Typography>Вы не создали ни одной задачи</Typography>}

        {!error && (
          <Fab
            component={Link}
            to={buildRoute.taskCreate()}
            color="info"
            aria-label="Создать"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            disabled={isLoading || isFetching}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
    </ErrorBoundary>
  );
};
