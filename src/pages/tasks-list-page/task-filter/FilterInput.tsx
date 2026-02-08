import { debounce } from "@/shared/helpers/helpers";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";

type FilterInputProps = {
  setFilterValue: (value: string) => void;
};

export const FilterInput = ({ setFilterValue }: FilterInputProps) => {
  const [text, setText] = useState<string>("");

  const debouncedSetValue = useMemo(() => debounce(setFilterValue, 300), [setFilterValue]);

  console.log("text value", text);

  const setValue = (value: string) => {
    setText(value);
    debouncedSetValue(value);
  };

  return (
    <TextField
      label="Введите название задачи"
      value={text}
      onChange={(e) => {
        setValue(e.target.value ?? "");
      }}
      variant="outlined"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      slotProps={{
        input: {
          endAdornment: text && (
            <InputAdornment position="end">
              <IconButton
                aria-label="очистить"
                onClick={() => setValue("")}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      fullWidth
    />
  );
};
