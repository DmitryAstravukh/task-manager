import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useMemo, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import type { SyntheticEvent } from "react";
import type { AutocompleteChangeReason } from "@mui/material/useAutocomplete";
import type { TaskFormValues } from "../types/task-form-types";
import { useCreateTagMutation } from "@/entities/tag/api/tag-api";

type TaskTagsFieldProps = {
  availableTags?: string[];
  disabled?: boolean;
};

export const TaskTagsField = ({ availableTags = [], disabled = false }: TaskTagsFieldProps) => {
  const { control, setError, clearErrors } = useFormContext<TaskFormValues>();

  const { field, fieldState } = useController({
    name: "tags",
    control,
  });

  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  // чтобы не отправлять один и тот же тег повторно пока список availableTags ещё не обновился
  const creatingRef = useRef(new Set<string>());

  const availableTagsSet = useMemo(() => new Set(availableTags), [availableTags]);

  const normalizeTags = (tags: string[]) => {
    const cleaned = tags.map((t) => t.trim()).filter(Boolean);
    return Array.from(new Set(cleaned));
  };

  const handleChange = async (
    _event: SyntheticEvent,
    newValue: string[],
    reason: AutocompleteChangeReason,
  ) => {
    const normalized = normalizeTags(newValue);

    //обновляем форму
    field.onChange(normalized);

    //создаём на сервере только когда пользователь реально создал опцию
    if (reason !== "createOption") return;

    const toCreate = normalized.filter(
      (name) => !availableTagsSet.has(name) && !creatingRef.current.has(name),
    );
    if (toCreate.length === 0) return;

    toCreate.forEach((name) => creatingRef.current.add(name));

    const results = await Promise.all(toCreate.map((name) => createTag({ name })));

    const failed = results.filter((r) => "error" in r);
    if (failed.length) {
      console.error(
        "createTag failed",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        failed.map((r) => (r as any).error),
      );
      setError("tags", {
        type: "server",
        message: "Не удалось создать тег. Попробуйте ещё раз.",
      });
    } else {
      clearErrors("tags");
    }

    toCreate.forEach((name) => creatingRef.current.delete(name));
  };

  return (
    <Autocomplete<string, true, false, true>
      multiple
      freeSolo
      disableCloseOnSelect
      options={availableTags}
      filterSelectedOptions
      value={field.value ?? []}
      disabled={disabled}
      onChange={(event, newValue, reason) => {
        // MUI не ждёт Promise из onChange — запускаем async “в фоне”
        void handleChange(event, newValue, reason);
      }}
      onBlur={field.onBlur}
      slotProps={{
        chip: { size: "small" },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Теги"
          required
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? "Введите тег и нажмите Enter"}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isCreatingTag ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};
