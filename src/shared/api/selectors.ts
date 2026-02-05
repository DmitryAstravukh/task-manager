// src/shared/api/selectors.ts
import type { RootState } from "@/app/store/store";
import { baseApi } from "@/shared/api/baseApi";

export const selectIsApiPending = (state: RootState) => {
  const apiState = state[baseApi.reducerPath];

  const hasPendingQueries = Object.values(apiState.queries).some((q) => q?.status === "pending");

  const hasPendingMutations = Object.values(apiState.mutations).some(
    (m) => m?.status === "pending",
  );

  return hasPendingQueries || hasPendingMutations;
};
