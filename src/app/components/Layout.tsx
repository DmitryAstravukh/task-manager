import { Loader } from "@/app/components/Loader.tsx";
import { Box } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Box
      sx={{
        width: "1600px",
        minHeight: "100dvh",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <Loader />

      <Suspense fallback={<Loader forcedOn />}>
        <Outlet />
      </Suspense>
    </Box>
  );
};
