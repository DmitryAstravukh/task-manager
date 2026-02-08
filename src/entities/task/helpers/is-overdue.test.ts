import { describe, expect, it } from "vitest";
import { isOverdue } from "./is-overdue";
import type { Task } from "../types/task-types";

function task(partial: Partial<Task> = {}): Task {
  const now = new Date().toISOString();
  return {
    id: "t1",
    title: "xxxxx",
    status: "todo",
    priority: "low",
    deadline: now,
    tags: ["tag-components"],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

describe("isTaskOverdue", () => {
  it("returns true when deadline passed and not done", () => {
    expect(isOverdue(task({ deadline: "2000-01-01T00:00:00.000Z", status: "todo" }))).toBe(true);
  });

  it("returns false when task done", () => {
    expect(isOverdue(task({ deadline: "2000-01-01T00:00:00.000Z", status: "done" }))).toBe(false);
  });
});
