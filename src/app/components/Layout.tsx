import { Loader } from "@/app/components/Loader.tsx";
import { NonAdaptivePlaceholder } from "@/shared/ui/NonAdaptivePlaceholder";
import { Box, useTheme } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ display: { xs: "block", xl: "none" } }}>
        <NonAdaptivePlaceholder />
      </Box>

      <Box
        sx={{
          display: { xs: "none", xl: "block" },
          width: `${theme.breakpoints.values.xl}px`,
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
    </>
  );
};
