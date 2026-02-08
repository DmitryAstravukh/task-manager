import { Box, Button, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Routes } from "@/app/router/routes";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

type TaskCrudPageHeaderProps = {
  disabled: boolean;
  maxWidth?: number;
  children?: ReactNode;
};

export const TaskCrudPageHeader = ({ disabled, maxWidth, children }: TaskCrudPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "16px",
        boxSizing: "border-box",
        borderRadius: 3,
        margin: "0px auto 24px auto",
        maxWidth,
      }}
    >
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(Routes.home)}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 500,
        }}
        disabled={disabled}
      >
        Назад
      </Button>

      <Box sx={{ display: "flex", gap: 2 }}>{children}</Box>
    </Paper>
  );
};
