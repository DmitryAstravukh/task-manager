import { Alert, Snackbar, type AlertColor } from "@mui/material";

type NotificationProps = {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
  onClose?: () => void;
};

export const MUINotification = ({
  open,
  message,
  severity = "success",
  autoHideDuration = 4000,
  onClose,
}: NotificationProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
