import type { TaskPriority, TaskStatus } from "@/entities/task/types/task-types";
import type { SortOrder } from "@/shared/api/types";
import { ErrorWithRetry } from "@/shared/components/error-with-retry/ErrorWithRetry";
import { MUINotification } from "@/shared/components/mui-notification/MUINotification";
import { MUISelect } from "@/shared/components/mui-select/MUISelect";
import { Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { useTaskFilters } from "../hooks/useTaskFilter";
import {
  CREATED_AT_ITEMS,
  DEADLINE_ITEMS,
  PRIORITY_ITEMS,
  STATUS_ITEMS,
} from "./constants/constants";
import { FilterInput } from "./FilterInput";
import { TaskTagFilter } from "./TasksTagFilter";
import { Clear } from "@mui/icons-material";

type TaskFilterProps = {
  filters: ReturnType<typeof useTaskFilters>;
  error: FetchBaseQueryError | SerializedError | undefined;
  refetch: () => void;
};

export const TaskFilter = ({ filters, error, refetch }: TaskFilterProps) => {
  const {
    status,
    priority,
    tagId,
    createdAtOrder,
    deadlineOrder,
    search,
    setSearch,
    setStatus,
    setPriority,
    setTagId,
    setCreatedAtOrder,
    setDeadlineOrder,
    resetFilters,
  } = filters;

  const hasActiveFilters = search || status || priority || tagId || createdAtOrder || deadlineOrder;

  return (
    <>
      <MUINotification
        open={!!error}
        message="Что-то пошло не так, попробуйте еще раз"
        severity="error"
      />

      <Paper sx={{ width: "100%", padding: "16px", boxSizing: "border-box", borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Фильтры</Typography>

          {!error && hasActiveFilters && (
            <Button variant="outlined" startIcon={<Clear />} onClick={resetFilters} size="small">
              Сбросить
            </Button>
          )}

          {!!error && <ErrorWithRetry error={error} onRetry={refetch} />}
        </Stack>

        <FilterInput setFilterValue={setSearch} />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <MUISelect<TaskStatus, true>
            value={status}
            setValue={setStatus}
            items={STATUS_ITEMS}
            selectProps={{ label: "Выберите статус" }}
          />
          <MUISelect<TaskPriority, true>
            value={priority}
            setValue={setPriority}
            items={PRIORITY_ITEMS}
            selectProps={{ label: "Выберите приоритет" }}
          />

          <TaskTagFilter tagId={tagId} setTagId={setTagId} />

          <MUISelect<SortOrder, true>
            value={createdAtOrder}
            setValue={setCreatedAtOrder}
            items={CREATED_AT_ITEMS}
            selectProps={{ label: "Дата создания" }}
          />
          <MUISelect<SortOrder, true>
            value={deadlineOrder}
            setValue={setDeadlineOrder}
            items={DEADLINE_ITEMS}
            selectProps={{ label: "Дедлайн" }}
          />
        </Stack>
      </Paper>
    </>
  );
};
