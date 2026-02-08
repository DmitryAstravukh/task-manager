import { useNavigate, useRouteError } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Routes } from "@/app/router/routes.ts";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const navigate = useNavigate();

  const handleClick = () => navigate(Routes.home);

  return (
    <div id="error-page">
      <Box
        sx={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "400",
            margin: "0 0 42px 0",
            color: "grey",
            padding: 0,
          }}
        >
          Что-то пошло не так
        </Typography>

        <Button
          onClick={handleClick}
          color="primary"
          variant="contained"
          sx={{ padding: "18px 40px" }}
        >
          На главную
        </Button>
      </Box>
    </div>
  );
};
