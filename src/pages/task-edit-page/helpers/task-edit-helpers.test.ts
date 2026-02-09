import type { Task } from "@/entities/task/types/task-types";
import type { TaskFormValues } from "@/shared/components/task-form/types/task-form-types";
import { describe, it, expect } from "vitest";
import { mapTaskToFormValues } from "./task-edit-helpers";

describe("mapTaskToFormValues", () => {
  it("корректно мапит все поля", () => {
    const task: Task = {
      id: "1",
      title: "Test task",
      description: "Some description",
      status: "todo",
      priority: "high",
      deadline: "2026-02-09T00:00:00.000Z",
      tags: ["work", "urgent"],
      createdAt: "2026-02-01T12:00:00.000Z",
      updatedAt: "2026-02-05T12:00:00.000Z",
    };
    const result: TaskFormValues = mapTaskToFormValues(task);
    expect(result).toEqual({
      title: "Test task",
      description: "Some description",
      status: "todo",
      priority: "high",
      deadline: "2026-02-09T00:00:00.000Z",
      tags: ["work", "urgent"],
    });
  });

  it("ставит пустую строку, если description отсутствует", () => {
    const task: Task = {
      id: "2",
      title: "No description task",
      status: "done",
      priority: "low",
      deadline: "2026-02-09T00:00:00.000Z",
      tags: [],
      createdAt: "2026-02-01T12:00:00.000Z",
      updatedAt: "2026-02-05T12:00:00.000Z",
    };
    const result = mapTaskToFormValues(task);
    expect(result.description).toBe("");
  });
});
