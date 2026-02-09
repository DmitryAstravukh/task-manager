import { describe, it, expect, vi } from "vitest";
import { taskFormSchema } from "./task-form-schema";
import { taskPriorityValues, taskStatusValues } from "@/shared/constants/shared-constants";

describe("taskFormSchema", () => {
  // фиксируем "текущее время" (локальное)
  const NOW = new Date(2026, 1, 9, 12, 0, 0, 0); // 9 Feb 2026 12:00:00

  const pad = (n: number) => String(n).padStart(2, "0");

  // формат для input[type="datetime-local"]: "YYYY-MM-DDTHH:mm"
  const toDateTimeLocal = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes(),
    )}`;

  const makeValidForm = () => ({
    title: "hello world",
    description: "desc",
    status: taskStatusValues[0],
    priority: taskPriorityValues[0],
    deadline: toDateTimeLocal(new Date(2026, 1, 9, 12, 30, 0, 0)), // +30 минут от NOW
    tags: ["react"],
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("принимает валидные данные", () => {
    const result = taskFormSchema.safeParse(makeValidForm());
    expect(result.success).toBe(true);
  });

  it("тримит title", () => {
    const result = taskFormSchema.safeParse({ ...makeValidForm(), title: "  hello world  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("hello world");
    }
  });

  it("отклоняет title короче 5 символов", () => {
    const result = taskFormSchema.safeParse({ ...makeValidForm(), title: "abc" });
    expect(result.success).toBe(false);
  });

  it("отклоняет title из пробелов (после trim < 5)", () => {
    const result = taskFormSchema.safeParse({ ...makeValidForm(), title: "    " });
    expect(result.success).toBe(false);
  });

  it("удаляет дубли тегов", () => {
    const result = taskFormSchema.safeParse({
      ...makeValidForm(),
      tags: ["react", "react", "vue"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["react", "vue"]);
    }
  });

  it("удаляет пустые теги", () => {
    const result = taskFormSchema.safeParse({
      ...makeValidForm(),
      tags: ["react", "", "  "],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["react"]);
    }
  });

  it("отклоняет пустой массив тегов", () => {
    const result = taskFormSchema.safeParse({ ...makeValidForm(), tags: [] });
    expect(result.success).toBe(false);
  });

  it("отклоняет пустой deadline", () => {
    const result = taskFormSchema.safeParse({ ...makeValidForm(), deadline: "" });
    expect(result.success).toBe(false);
  });

  it("отклоняет deadline раньше текущего времени", () => {
    const past = toDateTimeLocal(new Date(2026, 1, 9, 11, 59, 0, 0)); // -1 минута
    const result = taskFormSchema.safeParse({ ...makeValidForm(), deadline: past });
    expect(result.success).toBe(false);
  });

  it("принимает deadline равный текущему времени (>= Date.now)", () => {
    const nowAsInput = toDateTimeLocal(NOW); // 2026-02-09T12:00
    const result = taskFormSchema.safeParse({ ...makeValidForm(), deadline: nowAsInput });
    expect(result.success).toBe(true);
  });

  it("отклоняет невалидный status", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = taskFormSchema.safeParse({ ...makeValidForm(), status: "wrong" as any });
    expect(result.success).toBe(false);
  });
});
