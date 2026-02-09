import { useParams } from "react-router-dom";

import { useGetTagsQuery } from "@/entities/tag/api/tag-api";
import { useGetTaskByIdQuery, useUpdateTaskMutation } from "@/entities/task/api/task-api";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { ErrorWithRetry } from "@/shared/components/error-with-retry/ErrorWithRetry";
import { MUINotification } from "@/shared/components/mui-notification/MUINotification";
import { TaskCrudPageHeader } from "@/shared/components/task-crud-page-header/TaskCrudPageHeader";
import { TaskForm } from "@/shared/components/task-form/TaskForm";
import type { TaskFormValues } from "@/shared/components/task-form/types/task-form-types";
import { mapTaskToFormValues } from "./helpers/task-edit-helpers";

const TaskEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: task, error: getTaskError, refetch } = useGetTaskByIdQuery(id!);

  const [updateTask, { isError, isSuccess, reset }] = useUpdateTaskMutation();
  const { data: tags = [] } = useGetTagsQuery();

  const handleSubmit = (data: TaskFormValues) => {
    updateTask({
      id: id!,
      patch: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  if (getTaskError) return <ErrorWithRetry error={getTaskError} onRetry={refetch} />;
  if (!task) return null;

  const availableTagNames = tags.map((tag) => tag.name);

  return (
    <ErrorBoundary onReset={refetch}>
      <MUINotification
        open={isSuccess || isError}
        message={isSuccess ? "Задача успешно создана" : "Не удалось создать задачу"}
        severity={isSuccess ? "success" : "error"}
        onClose={reset}
      />

      <TaskCrudPageHeader disabled={false} maxWidth={600} />

      <TaskForm
        mode="edit"
        defaultValues={mapTaskToFormValues(task)}
        onSubmit={handleSubmit}
        isSuccess={isSuccess}
        availableTags={availableTagNames}
      />
    </ErrorBoundary>
  );
};

export default TaskEditPage;
