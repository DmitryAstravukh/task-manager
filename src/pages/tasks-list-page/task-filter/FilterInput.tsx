import { useEffect } from "react";
import { debounce } from "@/shared/helpers/shared-helpers";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";

type FilterInputProps = {
  value: string;
  setFilterValue: (value: string) => void;
  isLoading: boolean;
};

export const FilterInput = ({ value, setFilterValue, isLoading }: FilterInputProps) => {
  const [text, setText] = useState<string>("");

  const debouncedSetValue = useMemo(() => debounce(setFilterValue, 300), [setFilterValue]);

  // синхронизация локального текста с внешним value
  useEffect(() => {
    setText(value);
  }, [value]);

  // отменяем debounce при размонтировании чтобы не было setState after unmount
  useEffect(() => {
    return () => {
      debouncedSetValue.cancel();
    };
  }, [debouncedSetValue]);

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
      disabled={isLoading}
      fullWidth
    />
  );
};
