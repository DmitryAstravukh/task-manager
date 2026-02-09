import { describe, it, expect } from "vitest";
import { taskSchema, taskListSchema } from "./task-schema";

const validTask = {
  id: "1",
  title: "Test",
  status: "todo",
  priority: "high",
  deadline: "2026-01-01T00:00:00.000Z",
  tags: ["work"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("taskSchema", () => {
  it("принимает валидную задачу", () => {
    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("принимает задачу без description", () => {
    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("принимает задачу с description", () => {
    const result = taskSchema.safeParse({ ...validTask, description: "text" });
    expect(result.success).toBe(true);
  });

  it("отклоняет невалидный status", () => {
    const result = taskSchema.safeParse({ ...validTask, status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("отклоняет невалидный priority", () => {
    const result = taskSchema.safeParse({ ...validTask, priority: "invalid" });
    expect(result.success).toBe(false);
  });

  it("отклоняет отсутствующий id", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...noId } = validTask;
    const result = taskSchema.safeParse(noId);
    expect(result.success).toBe(false);
  });

  it("отклоняет tags не массив", () => {
    const result = taskSchema.safeParse({ ...validTask, tags: "not-array" });
    expect(result.success).toBe(false);
  });
});

describe("taskListSchema", () => {
  it("принимает массив задач", () => {
    const result = taskListSchema.safeParse([validTask, validTask]);
    expect(result.success).toBe(true);
  });

  it("принимает пустой массив", () => {
    const result = taskListSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("отклоняет не массив", () => {
    const result = taskListSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });
});
