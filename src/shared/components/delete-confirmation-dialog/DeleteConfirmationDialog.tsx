import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DeleteDialogProps = {
  open: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
};

export const DeleteConfirmationDialog = ({
  open,
  handleCancel,
  handleConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 360 } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 600,
        }}
      >
        Подтверждение удаления
      </DialogTitle>

      <DialogContent>
        <DialogContentText>Вы уверены? Это действие нельзя будет отменить</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleCancel} variant="outlined" sx={{ borderRadius: 2 }}>
          Отмена
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
          autoFocus
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
