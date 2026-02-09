import { Box, Skeleton, Stack } from "@mui/material";

export const TaskDataSkeleton = () => {
  return (
    <>
      <Skeleton variant="text" width="75%" height={28} />

      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Stack>

      <Box sx={{ mt: "auto" }}>
        <Skeleton variant="text" width="40%" height={18} />
      </Box>

      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={90} height={24} />
      </Stack>
    </>
  );
};
