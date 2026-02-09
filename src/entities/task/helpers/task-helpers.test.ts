import { describe, expect, it } from "vitest";
import type { GetTasksArgs } from "../api/task-api";
import type { Task } from "../types/task-types";
import { buildParams, isOverdue } from "./task-helpers";

const task = (partial: Partial<Task> = {}): Task => {
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
};

describe("isTaskOverdue", () => {
  it("возвращает true когда срок прошел и задача не выполнена", () => {
    expect(isOverdue(task({ deadline: "2000-01-01T00:00:00.000Z", status: "todo" }))).toBe(true);
  });

  it("возвращает false когда задача выполнена", () => {
    expect(isOverdue(task({ deadline: "2000-01-01T00:00:00.000Z", status: "done" }))).toBe(false);
  });

  it("возвращает false когда срок ещё не прошел", () => {
    expect(isOverdue(task({ deadline: "2099-01-01T00:00:00.000Z", status: "todo" }))).toBe(false);
  });

  it("возвращает true когда статус inProgress и срок прошел", () => {
    expect(isOverdue(task({ deadline: "2000-01-01T00:00:00.000Z", status: "inProgress" }))).toBe(
      true,
    );
  });
});

describe("buildParams", () => {
  it("ставит все переданные аргументы", () => {
    const args: GetTasksArgs = {
      page: 2,
      limit: 5,
      title: "Test",
      status: "todo",
      priority: "high",
      tagId: "123",
      sort: "deadline",
      order: "asc",
    };

    const params = buildParams(args);
    expect(params.get("_page")).toBe("2");
    expect(params.get("_limit")).toBe("5");
    expect(params.get("_sort")).toBe("deadline");
    expect(params.get("_order")).toBe("asc");
    expect(params.get("status")).toBe("todo");
    expect(params.get("priority")).toBe("high");
    expect(params.get("title_like")).toBe("Test");
    expect(params.get("tags_like")).toBe("123");
  });

  it("не добавляет пустые значения", () => {
    const args: GetTasksArgs = {
      page: 1,
      limit: 5,
      title: "",
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    };

    const params = buildParams(args);
    expect(params.has("title_like")).toBe(false);
    expect(params.has("status")).toBe(false);
    expect(params.has("priority")).toBe(false);
    expect(params.has("tags_like")).toBe(false);
    expect(params.has("_sort")).toBe(false);
    expect(params.has("_order")).toBe(false);
  });

  it("использует дефолтный limit когда не передан", () => {
    const args: GetTasksArgs = {
      page: 1,
      title: "",
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    };

    const params = buildParams(args);
    expect(params.get("_limit")).toBeDefined();
  });

  it("удаляет лишние пробелы title перед отправкой", () => {
    const args: GetTasksArgs = {
      page: 1,
      title: "  test  ",
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    };

    const params = buildParams(args);
    expect(params.get("title_like")).toBe("test");
  });

  it("не добавляет title из одних пробелов", () => {
    const args: GetTasksArgs = {
      page: 1,
      title: "   ",
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    };

    const params = buildParams(args);
    expect(params.has("title_like")).toBe(false);
  });

  it("не падает когда title undefined", () => {
    const args = {
      page: 1,
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    } as GetTasksArgs;

    const params = buildParams(args);
    expect(params.has("title_like")).toBe(false);
  });

  it("использует дефолтную page когда не передана", () => {
    const args = {
      title: "",
      status: "",
      priority: "",
      tagId: "",
      sort: "",
      order: "",
    } as GetTasksArgs;

    const params = buildParams(args);
    expect(params.get("_page")).toBe("1");
  });
});
