import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type FormControlProps,
  type SelectProps,
} from "@mui/material";
import type { MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";

type Item = { id: number | string; title: number | string };

//если WithDefault=false, тогда мы устанавливаем только значения из типа V
type MUISelectProps<V, WithDefault extends boolean> = {
  value: WithDefault extends false ? V : V | "";
  setValue: (value: WithDefault extends false ? V : V | "") => void;
  items: Item[];
  formControlProps?: Omit<FormControlProps, "onClick">;
  selectProps?: Omit<SelectProps, "onChange" | "value">;
  withDefaultValue?: WithDefault;
};

export const MUISelect = <V, WithDefault extends boolean>({
  value,
  setValue,
  items,
  formControlProps = {},
  selectProps = {},
  withDefaultValue,
}: MUISelectProps<V, WithDefault>) => {
  const id = uuidv4();

  const _withDefaultValue = withDefaultValue === undefined ? true : withDefaultValue;

  return (
    <FormControl fullWidth onClick={(e: MouseEvent) => e.stopPropagation()} {...formControlProps}>
      {selectProps?.label && <InputLabel id={id}>{selectProps.label}</InputLabel>}

      <Select
        labelId={id}
        value={value ?? ""}
        onChange={(e) => {
          e.stopPropagation();
          setValue(e.target.value as V);
        }}
        input={<OutlinedInput label={selectProps?.label} />}
        sx={{ "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 } }}
        {...selectProps}
      >
        {_withDefaultValue && <MenuItem value="">Все</MenuItem>}

        {items.map(({ id, title }) => (
          <MenuItem key={id} value={id}>
            {title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
