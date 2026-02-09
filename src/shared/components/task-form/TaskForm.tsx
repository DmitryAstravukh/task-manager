// TaskForm.tsx
import type { TaskStatus } from "@/entities/task/types/task-types";
import { toLocalDateTimeInput } from "@/shared/helpers/shared-helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, FormProvider, useForm, type Resolver } from "react-hook-form";
import { MUISelect } from "../mui-select/MUISelect";
import { TaskTagsField } from "./components/TaskTagsField";
import { CREATE_FORM_VALUES, PRIORITY_ITEMS, STATUS_ITEMS } from "./constants/task-form-constants";
import { taskFormSchema } from "./schema/task-form-schema";
import type { TaskFormProps, TaskFormValues } from "./types/task-form-types";

export const TaskForm = ({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  isSuccess,
  availableTags = [],
}: TaskFormProps) => {
  const methods = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskFormSchema) as any as Resolver<TaskFormValues>,
    mode: "onChange",
    defaultValues: {
      ...CREATE_FORM_VALUES,
      ...defaultValues,
      deadline: defaultValues?.deadline ? toLocalDateTimeInput(defaultValues.deadline) : "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      if (mode === "create") {
        reset(CREATE_FORM_VALUES);
      } else {
        reset(undefined, { keepValues: true });
      }
    }
  }, [isSuccess, mode, reset]);

  const submitLabel = mode === "create" ? "Создать задачу" : "Сохранить изменения";
  const isSubmitDisabled = isSubmitting || !isValid || (mode === "edit" && !isDirty);

  const title = mode === "create" ? "Создание задачи" : "Редактирование задачи";

  const minDeadline = () => {
    const d = new Date();
    d.setSeconds(0, 0); // input обычно с точностью до минут
    return toLocalDateTimeInput(d); // "YYYY-MM-DDTHH:mm"
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Paper
          sx={{
            padding: "24px",
            maxWidth: 600,
            mx: "auto",
            borderRadius: 3,
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            {title}
          </Typography>

          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Заголовок"
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message ?? `${field.value.length}/100`}
                  slotProps={{
                    htmlInput: { maxLength: 100 },
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Описание"
                  multiline
                  minRows={3}
                  maxRows={6}
                  error={!!errors.description}
                  helperText={errors.description?.message ?? `${field.value.length}/500`}
                  slotProps={{
                    htmlInput: { maxLength: 500 },
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <MUISelect<TaskStatus, false>
                  value={field.value}
                  setValue={(value) => field.onChange(value)}
                  items={STATUS_ITEMS}
                  withDefaultValue={false}
                  selectProps={{
                    label: "Статус",
                    error: !!errors.status,
                    onBlur: field.onBlur,
                  }}
                  formControlProps={{
                    required: true,
                    error: !!errors.status,
                  }}
                />
              )}
            />
            {errors.status && (
              <FormHelperText error sx={{ mt: -2 }}>
                {errors.status.message}
              </FormHelperText>
            )}

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.priority} required>
                  <FormLabel>Приоритет</FormLabel>
                  <RadioGroup
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    row
                  >
                    {PRIORITY_ITEMS.map(({ id, title }) => (
                      <FormControlLabel key={id} value={id} control={<Radio />} label={title} />
                    ))}
                  </RadioGroup>
                  {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  label="Дедлайн"
                  required
                  error={!!errors.deadline}
                  helperText={errors.deadline?.message}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      min: minDeadline(),
                    },
                  }}
                  fullWidth
                />
              )}
            />

            <TaskTagsField availableTags={availableTags} disabled={isSubmitting} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitDisabled}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ borderRadius: 2 }}
              >
                {isSubmitting ? "Сохранение..." : submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </form>
    </FormProvider>
  );
};
