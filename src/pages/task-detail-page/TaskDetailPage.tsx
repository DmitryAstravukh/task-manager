import { buildRoute, Routes } from "@/app/router/routes";
import { useDeleteTaskMutation, useGetTaskByIdQuery } from "@/entities/task/api/task-api";
import { DeleteConfirmationDialog } from "@/shared/components/delete-confirmation-dialog/DeleteConfirmationDialog";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { ErrorWithRetry } from "@/shared/components/error-with-retry/ErrorWithRetry";
import { MUINotification } from "@/shared/components/mui-notification/MUINotification";
import { TaskCrudPageHeader } from "@/shared/components/task-crud-page-header/TaskCrudPageHeader";
import { TaskData } from "@/shared/components/task-data/TaskData";
import { TaskDataSkeleton } from "@/shared/components/task-data/ui/TaskDataSkeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
      <TaskCrudPageHeader disabled={buttonsDisabled}>
        <>
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
        </>
      </TaskCrudPageHeader>

      <Stack direction="row" spacing={3}>
        {isGetTaskLoading && <TaskDataSkeleton />}

        {!isGetTaskLoading && !getTaskError && task && (
          <TaskData task={task} tagIsFilter={false} isTrimDescription={false} />
        )}
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
