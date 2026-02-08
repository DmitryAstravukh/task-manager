import { useDeleteTaskMutation, useGetTaskByIdQuery } from "@/entities/task/api/task-api";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { TaskDataSkeleton } from "@/shared/components/task-data/ui/TaskDataSkeleton";
import { Box, Button, Paper, Stack } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorWithRetry } from "@/shared/components/error-with-retry/ErrorWithRetry";
import { TaskData } from "@/shared/components/task-data/TaskData";
import { useState } from "react";
import { buildRoute, Routes } from "@/app/router/routes";
import { DeleteConfirmationDialog } from "@/shared/components/delete-confirmation-dialog/DeleteConfirmationDialog";
import { MUINotification } from "@/shared/components/mui-notification/MUINotification";

export const TaskDetailPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const {
    data: task,
    isLoading: isGetTaskLoading,
    error: getTaskError,
    refetch,
  } = useGetTaskByIdQuery(id!);

  const [
    deleteTask,
    { isError: isDeleteError, isSuccess: isDeleteSuccess, reset, isLoading: isDeleteLoading },
  ] = useDeleteTaskMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const buttonsDisabled = isGetTaskLoading || isDeleteLoading;

  return (
    <ErrorBoundary onReset={refetch}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "16px",
          boxSizing: "border-box",
          borderRadius: 3,
          marginBottom: "24px",
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(Routes.home)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
          disabled={buttonsDisabled}
        >
          Назад
        </Button>

        <Box sx={{ display: "flex" }}>
          {!!getTaskError && <ErrorWithRetry error={getTaskError} onRetry={refetch} />}

          {!getTaskError && (
            <>
              <Button
                component={Link}
                to={buildRoute.taskEdit(id!)}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                disabled={buttonsDisabled}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              >
                Редактировать
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={buttonsDisabled}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500, marginLeft: "24px" }}
              >
                Удалить
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Stack direction="row" spacing={3}>
        {isGetTaskLoading && <TaskDataSkeleton />}

        {!isGetTaskLoading && !getTaskError && task && <TaskData task={task} tagIsFilter={false} />}
      </Stack>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        handleCancel={() => setDeleteDialogOpen(false)}
        handleConfirm={async () => {
          await deleteTask(id!);
          setDeleteDialogOpen(false);
          navigate(Routes.home, { replace: true });
        }}
      />

      <MUINotification
        open={isDeleteError || isDeleteSuccess}
        onClose={reset}
        message={isDeleteError ? "Не удалось удалить задачу" : "Задача успешно удалена"}
        severity={isDeleteError ? "error" : "success"}
      />
    </ErrorBoundary>
  );
};

export default TaskDetailPage;
