import type { TaskPriority, TaskStatus } from "@/entities/task/types/task-types";
import type { SortOrder, TasksSortField } from "@/shared/types/shared-types";
import { useCallback, useMemo, useState } from "react";

export const useTaskFilters = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [tagId, setTagId] = useState("");
  const [createdAtOrder, setCreatedAtOrder] = useState<SortOrder | "">("");
  const [deadlineOrder, setDeadlineOrder] = useState<SortOrder | "">("");
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatus = useCallback((value: TaskStatus | "") => {
    setStatus(value ?? "");
    setPage(1);
  }, []);

  const handlePriority = useCallback((value: TaskPriority | "") => {
    setPriority(value ?? "");
    setPage(1);
  }, []);

  const handleTagId = useCallback((value: string) => {
    setTagId(value);
    setPage(1);
  }, []);

  const handleCreatedAtOrder = useCallback((value: SortOrder | "") => {
    setCreatedAtOrder(value ?? "");
    setDeadlineOrder("");
  }, []);

  const handleDeadlineOrder = useCallback((value: SortOrder | "") => {
    setDeadlineOrder(value ?? "");
    setCreatedAtOrder("");
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setPriority("");
    setTagId("");
    setCreatedAtOrder("");
    setDeadlineOrder("");
    setPage(1);
  }, []);

  const queryParamsSort: TasksSortField | "" = useMemo(
    () => (createdAtOrder ? "createdAt" : deadlineOrder ? "deadline" : ""),
    [createdAtOrder, deadlineOrder],
  );

  const queryParams = useMemo(
    () => ({
      page,
      title: search,
      status,
      priority,
      tagId,
      sort: queryParamsSort,
      order: createdAtOrder || deadlineOrder,
    }),
    [page, search, status, priority, tagId, queryParamsSort, createdAtOrder, deadlineOrder],
  );

  return {
    search,
    setSearch: handleSearch,

    status,
    setStatus: handleStatus,

    priority,
    setPriority: handlePriority,

    tagId,
    setTagId: handleTagId,

    createdAtOrder,
    setCreatedAtOrder: handleCreatedAtOrder,

    deadlineOrder,
    setDeadlineOrder: handleDeadlineOrder,

    page,
    setPage,

    resetFilters,

    queryParams,
  };
};
