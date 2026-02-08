// TaskForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
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
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect } from "react";
import type { TaskStatus } from "@/entities/task/types/task-types";
import { MUISelect } from "../mui-select/MUISelect";
import { CREATE_FORM_VALUES, PRIORITY_ITEMS, STATUS_ITEMS } from "./constants/constants";
import { taskFormSchema } from "./schema/schema";
import type { TaskFormProps, TaskFormValues } from "./types/types";

export const TaskForm = ({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  isSuccess,
  availableTags = [],
}: TaskFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskFormSchema) as any as Resolver<TaskFormValues>,
    defaultValues: {
      ...CREATE_FORM_VALUES,
      ...defaultValues,
    },
  });

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
  const isSubmitDisabled = isSubmitting || (mode === "edit" && !isDirty);

  return (
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
          Создание задачи
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
                }}
                fullWidth
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={availableTags.filter((tag) => !field.value.includes(tag))}
                value={field.value}
                onChange={(_, newValue) => field.onChange(newValue)}
                onBlur={field.onBlur}
                slotProps={{
                  chip: {
                    size: "small",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Теги"
                    required
                    error={!!errors.tags}
                    helperText={errors.tags?.message ?? "Введите тег и нажмите Enter"}
                  />
                )}
                multiple
                freeSolo
                disableCloseOnSelect
              />
            )}
          />

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
  );
};
