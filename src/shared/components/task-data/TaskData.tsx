import { usePatchTaskStatusMutation } from "@/entities/task/api/task-api";
import {
  TASK_PRIORITY_COLOR,
  TASK_PRIORITY_LABEL,
} from "@/entities/task/constants/task-constants.ts";
import { isOverdue } from "@/entities/task/helpers/is-overdue.ts";
import type { Task, TaskStatus } from "@/entities/task/types/task-types.ts";
import { STATUS_ITEMS } from "@/pages/tasks-list-page/task-filter/constants/constants";
import { formatDate } from "@/shared/helpers/helpers.ts";
import { Flag } from "@mui/icons-material";
import AccessTime from "@mui/icons-material/AccessTime";
import { Box, Chip, Stack, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { MUINotification } from "../mui-notification/MUINotification";
import { MUISelect } from "../mui-select/MUISelect";

type TaskDataBaseProps = {
  task: Task;
};

type WithTagFilter = TaskDataBaseProps & {
  tagIsFilter: true;
  tagId: string;
  setTagId: (value: string) => void;
};

type WithoutTagFilter = TaskDataBaseProps & {
  tagIsFilter?: false;
};

type TaskDataProps = WithTagFilter | WithoutTagFilter;

export const TaskData = (props: TaskDataProps) => {
  const { task } = props;
  const overdue = isOverdue(task);

  const [updateStatus, { isError, isSuccess, reset, isLoading }] = usePatchTaskStatusMutation();

  const handleSetStatusValue = (newStatusId: TaskStatus) => {
    updateStatus({ id: task.id, status: newStatusId });
  };

  const handleTagClick = (tag: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (props.tagIsFilter) {
      if (props.tagId === tag) {
        return props.setTagId("");
      }
      props.setTagId(tag);
    }
  };

  return (
    <>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title || "Название не задано"}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", marginTop: "12px" }}>
          {task.description || "Описание не задано"}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, mt: 3 }}>
          <MUISelect<TaskStatus, false>
            value={task.status}
            setValue={handleSetStatusValue}
            items={STATUS_ITEMS}
            selectProps={{ label: "Выберите статус", size: "small", disabled: isLoading }}
            withDefaultValue={false}
          />

          <Chip
            icon={<Flag />}
            label={TASK_PRIORITY_LABEL[task.priority]}
            size="small"
            color={TASK_PRIORITY_COLOR[task.priority]}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
          <AccessTime fontSize="small" color={overdue ? "error" : "action"} />
          <Typography variant="body2" color={overdue ? "error" : "text.secondary"}>
            {formatDate(task.deadline)}
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {"tagId" in props &&
            task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="filled"
                color={props.tagId === tag ? "primary" : "default"}
                onClick={handleTagClick(tag)}
                sx={{ cursor: props.tagIsFilter ? "pointer" : undefined }}
              />
            ))}
        </Box>
      </CardContent>

      <MUINotification
        open={isError || isSuccess}
        onClose={reset}
        message={isError ? "Не удалось изменить статус" : "Статус успешно изменен"}
        severity={isError ? "error" : "success"}
      />
    </>
  );
};
