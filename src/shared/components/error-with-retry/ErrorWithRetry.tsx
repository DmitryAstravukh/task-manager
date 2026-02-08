import { Alert, Button } from "@mui/material";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ErrorWithRetryProps = {
  error: FetchBaseQueryError | SerializedError | unknown;
  onRetry: () => void;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      const fetchError = error as FetchBaseQueryError;

      if (fetchError.status === "FETCH_ERROR") return "Нет соединения с сервером";
      if (fetchError.status === "TIMEOUT_ERROR") return "Превышено время ожидания";
      if (typeof fetchError.status === "number") return `Ошибка сервера: ${fetchError.status}`;
    }
    if ("message" in error) {
      return (error as SerializedError).message ?? "Неизвестная ошибка";
    }
  }
  return "Произошла ошибка при загрузке данных";
};

export const ErrorWithRetry = ({ error, onRetry }: ErrorWithRetryProps) => (
  <Alert
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={onRetry}>
        Повторить
      </Button>
    }
  >
    {getErrorMessage(error)}
  </Alert>
);
