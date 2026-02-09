// src/shared/components/task-data/TaskData.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { Provider } from "react-redux";

import type { Task } from "@/entities/task/types/task-types";
import { store } from "@/app/store/store";
import { TaskData } from "./TaskData";

import { within, userEvent, expect, fn } from "storybook/test";

type TaskDataStoryArgs = {
  task: Task;
  isTrimDescription: boolean;

  tagIsFilter?: boolean;
  tagId?: string;
  setTagId?: (value: string) => void;
};

const meta: Meta<TaskDataStoryArgs> = {
  title: "Shared/TaskData",
  component: TaskData as unknown as ComponentType<TaskDataStoryArgs>,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTask: Task = {
  id: "1",
  title: "Тестовая задача",
  description: "Описание задачи",
  status: "todo",
  priority: "high",
  // фиксируем даты, чтобы тесты не зависели от "сегодня"
  deadline: new Date("2026-02-10T12:00:00.000Z").toISOString(),
  tags: ["frontend", "backend"],
  createdAt: new Date("2026-02-01T12:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-02-02T12:00:00.000Z").toISOString(),
};

// моки держим снаружи (и не используем args.setTagId из-за union-типа)
const setTagIdMock_Default = fn<(value: string) => void>();
const setTagIdMock_WithFilter = fn<(value: string) => void>();

export const Default: Story = {
  args: {
    task: mockTask,
    isTrimDescription: false,

    tagIsFilter: true,
    tagId: "",
    setTagId: setTagIdMock_Default,
  },
  play: async ({ canvasElement }) => {
    setTagIdMock_Default.mockClear();

    const canvas = within(canvasElement);

    expect(canvas.getByText("Тестовая задача")).toBeInTheDocument();
    expect(canvas.getByText("Описание задачи")).toBeInTheDocument();
    expect(canvas.getByText(/Высокий/i)).toBeInTheDocument();

    // дата отображается как dd.mm.yyyy
    expect(canvas.getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument();

    // клик по тегу должен дернуть setTagId("frontend")
    await userEvent.click(canvas.getByText("frontend"));
    expect(setTagIdMock_Default).toHaveBeenCalledTimes(1);
    expect(setTagIdMock_Default).toHaveBeenCalledWith("frontend");

    /**
     * MUI Select рендерит список опций в portal (document.body),
     * поэтому options нужно искать не в canvasElement, а в body.
     *
     * Мы только проверяем, что опция видна (не кликаем), чтобы не триггерить RTK Query mutation.
     */
    const combo = canvas.getByRole("combobox", { name: /выберите статус/i });
    await userEvent.click(combo);

    const body = within(canvasElement.ownerDocument.body);
    const listbox = await body.findByRole("listbox");

    expect(within(listbox).getByRole("option", { name: /в работе/i })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
  },
};

export const EmptyFields: Story = {
  args: {
    task: {
      id: "2",
      title: "",
      description: "",
      status: "todo",
      priority: "low",
      deadline: new Date("2026-02-10T12:00:00.000Z").toISOString(),
      tags: [],
      createdAt: new Date("2026-02-01T12:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-02-02T12:00:00.000Z").toISOString(),
    },
    isTrimDescription: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // фолбэки из компонента
    expect(canvas.getByText("Название не задано")).toBeInTheDocument();
    expect(canvas.getByText("Описание не задано")).toBeInTheDocument();
  },
};

export const Overdue: Story = {
  args: {
    task: {
      id: "3",
      title: "Просроченная задача",
      description: "Нужно было сделать вчера",
      status: "inProgress",
      priority: "medium",
      // фиксированно в прошлом => точно overdue
      deadline: new Date("2000-01-01T00:00:00.000Z").toISOString(),
      tags: ["urgent"],
      createdAt: new Date("2026-02-01T12:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-02-02T12:00:00.000Z").toISOString(),
    },
    isTrimDescription: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Просроченная задача")).toBeInTheDocument();

    // overdue => AccessTimeIcon должен иметь error-цвет (MuiSvgIcon-colorError)
    const icon = canvasElement.querySelector('[data-testid="AccessTimeIcon"]');
    expect(icon).not.toBeNull();
    expect(icon as HTMLElement).toHaveClass("MuiSvgIcon-colorError");
  },
};

export const WithTagFilter: Story = {
  args: {
    task: {
      id: "4",
      title: "Задача с тегами",
      description: "Можно фильтровать по тегам",
      status: "done",
      priority: "high",
      deadline: new Date("2026-02-10T12:00:00.000Z").toISOString(),
      tags: ["frontend", "backend", "design"],
      createdAt: new Date("2026-02-01T12:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-02-02T12:00:00.000Z").toISOString(),
    },
    isTrimDescription: false,

    tagIsFilter: true,
    tagId: "frontend",
    setTagId: setTagIdMock_WithFilter,
  },
  play: async ({ canvasElement }) => {
    setTagIdMock_WithFilter.mockClear();

    const canvas = within(canvasElement);

    const chipLabel = canvas.getByText("frontend");
    const chipRoot = chipLabel.closest(".MuiChip-root");
    expect(chipRoot).not.toBeNull();

    // выбранный тег подсвечен primary
    expect(chipRoot!).toHaveClass("MuiChip-colorPrimary");

    // клик по выбранному тегу должен сбросить фильтр (setTagId(""))
    await userEvent.click(chipLabel);
    expect(setTagIdMock_WithFilter).toHaveBeenCalledTimes(1);
    expect(setTagIdMock_WithFilter).toHaveBeenCalledWith("");
  },
};

export const TrimmedDescription: Story = {
  args: {
    task: {
      id: "5",
      title: "Задача с длинным описанием",
      description:
        "Очень длинное описание задачи, которое должно быть обрезано после нескольких строк. " +
        "Это помогает проверить работу стилей и корректность отображения текста в Storybook.",
      status: "todo",
      priority: "low",
      deadline: new Date("2026-02-10T12:00:00.000Z").toISOString(),
      tags: ["test"],
      createdAt: new Date("2026-02-01T12:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-02-02T12:00:00.000Z").toISOString(),
    },
    isTrimDescription: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Задача с длинным описанием")).toBeInTheDocument();
  },
};
