import { describe, it, expect, vi } from "vitest";
import { formatDate, formatDateTime, debounce, mapRecordToSelectItems } from "./shared-helpers";

describe("formatDate", () => {
  it("форматирует дату в формате dd.mm.yyyy", () => {
    const result = formatDate("2026-02-09T00:00:00.000Z");
    expect(result).toBe("09.02.2026");
  });
});

describe("formatDateTime", () => {
  it("форматирует дату и время в формате dd.mm.yyyy, hh:mm", () => {
    const result = formatDateTime("2026-02-09T15:45:00.000Z");
    expect(result).toMatch(/09\.02\.2026.*18:45/); // проверка по локали UTC+3
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("вызывает функцию только один раз после задержки", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("a");
    debounced("b");

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("сбрасывает таймер при повторных вызовах до истечения задержки", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("first");
    vi.advanceTimersByTime(50);
    debounced("second");

    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");
  });

  it("cancel() отменяет отложенный вызов", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("x");
    debounced.cancel();

    vi.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();
  });
});

describe("mapRecordToSelectItems", () => {
  it("преобразует объект в массив {id, title}", () => {
    const record = {
      todo: "Сделать",
      done: "Готово",
    } as const;

    const result = mapRecordToSelectItems(record);

    expect(result).toEqual([
      { id: "todo", title: "Сделать" },
      { id: "done", title: "Готово" },
    ]);
  });

  it("работает с пустым объектом", () => {
    const record = {} as Record<string, string>;
    const result = mapRecordToSelectItems(record);
    expect(result).toEqual([]);
  });
});
