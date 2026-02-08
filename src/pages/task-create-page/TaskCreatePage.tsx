import { useGetTagsQuery } from "@/entities/tag/api/tag-api";
import { useCreateTaskMutation } from "@/entities/task/api/task-api";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { MUINotification } from "@/shared/components/mui-notification/MUINotification";
import { TaskCrudPageHeader } from "@/shared/components/task-crud-page-header/TaskCrudPageHeader";
import { TaskForm } from "@/shared/components/task-form/TaskForm";
import type { TaskFormValues } from "@/shared/components/task-form/types/types";
import { v4 as uuidv4 } from "uuid";

const TaskCreatePage = () => {
  const [createTask, { isError, isSuccess, reset }] = useCreateTaskMutation();
  const { data: tags = [] } = useGetTagsQuery();

  const handleSubmit = (data: TaskFormValues) => {
    const now = new Date().toISOString();

    createTask({
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    });
  };

  const availableTagNames = tags.map((tag) => tag.name);

  return (
    <ErrorBoundary>
      <MUINotification
        open={isSuccess || isError}
        message={isSuccess ? "Задача успешно создана" : "Не удалось создать задачу"}
        severity={isSuccess ? "success" : "error"}
        onClose={reset}
      />

      <TaskCrudPageHeader disabled={false} maxWidth={600} />

      <TaskForm
        mode="create"
        onSubmit={handleSubmit}
        isSuccess={isSuccess}
        availableTags={availableTagNames}
      />
    </ErrorBoundary>
  );
};

export default TaskCreatePage;
