import { useSelector } from "react-redux";
import { Fade, LinearProgress } from "@mui/material";
import type { RootState } from "@/app/store/store.ts";
import { baseApi } from "@/shared/api/baseApi.ts";

type LoaderProps = {
  forcedOn?: boolean;
};

export const Loader = ({ forcedOn = false }: LoaderProps) => {
  const isApiPending = useSelector((state: RootState) => {
    const apiState = state[baseApi.reducerPath];

    const hasPendingQueries = Object.values(apiState.queries).some((q) => q?.status === "pending");

    const hasPendingMutations = Object.values(apiState.mutations).some(
      (m) => m?.status === "pending",
    );

    return hasPendingQueries || hasPendingMutations;
  });

  const isLoading = forcedOn || isApiPending;

  if (!isLoading) return null;

  return (
    <Fade in={isLoading} timeout={500} unmountOnExit>
      <LinearProgress
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: "99999" }}
      />
    </Fade>
  );
};
