// import type { Meta, StoryObj } from "@storybook/react";
// import { Provider } from "react-redux";

// import { TaskCard } from "./TaskCard";
// import type { Task } from "@/entities/task/types/task-types";
// import { within, userEvent } from "@storybook/testing-library";
// import { expect } from "@storybook/jest";
// import { store } from "@/app/store/store";
// import { MemoryRouter } from "react-router-dom";

// const meta: Meta<typeof TaskCard> = {
//   title: "Shared/TaskCard",
//   component: TaskCard,
//   decorators: [
//     (Story) => (
//       <Provider store={store}>
//         <MemoryRouter>
//           <Story />
//         </MemoryRouter>
//       </Provider>
//     ),
//   ],
// };
// export default meta;

// type Story = StoryObj<typeof TaskCard>;

// const baseTask: Task = {
//   id: "1",
//   title: "Карточка задачи",
//   description: "Описание задачи для карточки",
//   status: "todo",
//   priority: "high",
//   deadline: new Date("2026-12-31T23:59:59Z").toISOString(),
//   tags: ["frontend", "backend"],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// export const Default: Story = {
//   args: {
//     task: baseTask,
//     tagId: "",
//     setTagId: (val: string) => console.log("setTagId", val),
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     expect(canvas.getByText("Карточка задачи")).toBeInTheDocument();

//     expect(canvas.getByText("Описание задачи для карточки")).toBeInTheDocument();

//     expect(canvas.getByText("frontend")).toBeInTheDocument();

//     await userEvent.click(canvas.getByText("frontend"));
//     expect(canvas.getByText("frontend")).toBeInTheDocument();
//   },
// };

// export const Overdue: Story = {
//   args: {
//     task: {
//       ...baseTask,
//       id: "2",
//       title: "Просроченная задача",
//       // вчера
//       deadline: new Date(Date.now() - 86400000).toISOString(),
//     },
//     tagId: "",
//     setTagId: (val: string) => console.log("setTagId", val),
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     const card = canvas.getByRole("link").closest("div");
//     expect(card).toHaveStyle("border-color: var(--mui-palette-error-main)");
//   },
// };

// export const WithTagFilter: Story = {
//   args: {
//     task: {
//       ...baseTask,
//       id: "3",
//       title: "Задача с фильтром",
//       tags: ["frontend", "backend", "design"],
//     },
//     tagId: "frontend",
//     setTagId: (val: string) => console.log("setTagId", val),
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const tagChip = canvas.getByText("frontend");
//     expect(tagChip).toHaveClass("MuiChip-colorPrimary");
//   },
// };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { TaskCard } from "./TaskCard";
import type { Task } from "@/entities/task/types/task-types";
import { store } from "@/app/store/store";

import { within, userEvent, expect, fn } from "storybook/test";

const meta: Meta<typeof TaskCard> = {
  title: "Shared/TaskCard",
  component: TaskCard,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TaskCard>;

const baseTask: Task = {
  id: "1",
  title: "Карточка задачи",
  description: "Описание задачи для карточки",
  status: "todo",
  priority: "high",
  deadline: new Date("2026-12-31T23:59:59Z").toISOString(),
  tags: ["frontend", "backend"],
  createdAt: new Date("2026-01-01T00:00:00Z").toISOString(),
  updatedAt: new Date("2026-01-02T00:00:00Z").toISOString(),
};

// маленький хелпер, чтобы стабильно находить корневой Card
const getCardRoot = (canvasElement: HTMLElement) => {
  const el = canvasElement.querySelector(".MuiCard-root") as HTMLElement | null;
  expect(el).not.toBeNull();
  return el!;
};

export const Default: Story = {
  args: {
    task: baseTask,
    tagId: "",
    setTagId: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Карточка задачи")).toBeInTheDocument();
    expect(canvas.getByText("Описание задачи для карточки")).toBeInTheDocument();

    // теги на месте
    expect(canvas.getByText("frontend")).toBeInTheDocument();
    expect(canvas.getByText("backend")).toBeInTheDocument();

    // кликаем по тегу -> должен вызваться setTagId("frontend")
    await userEvent.click(canvas.getByText("frontend"));
    expect(args.setTagId).toHaveBeenCalledTimes(1);
    expect(args.setTagId).toHaveBeenCalledWith("frontend");

    // не просроченная карточка -> border 1px
    const card = getCardRoot(canvasElement);
    const style = window.getComputedStyle(card);
    expect(style.borderTopWidth).toBe("1px");
  },
};

export const Overdue: Story = {
  args: {
    task: {
      ...baseTask,
      id: "2",
      title: "Просроченная задача",
      // фиксированно в прошлом, чтобы тест не зависел от "сегодня"
      deadline: new Date("2000-01-01T00:00:00Z").toISOString(),
    },
    tagId: "",
    setTagId: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Просроченная задача")).toBeInTheDocument();

    const card = getCardRoot(canvasElement);
    const style = window.getComputedStyle(card);

    // overdue -> border "2px solid"
    expect(style.borderTopWidth).toBe("2px");
  },
};

export const WithTagFilter: Story = {
  args: {
    task: {
      ...baseTask,
      id: "3",
      title: "Задача с фильтром",
      tags: ["frontend", "backend", "design"],
    },
    tagId: "frontend",
    setTagId: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const chipLabel = canvas.getByText("frontend");
    const chipRoot = chipLabel.closest(".MuiChip-root");
    expect(chipRoot).not.toBeNull();

    // выбранный тег должен быть primary
    expect(chipRoot!).toHaveClass("MuiChip-colorPrimary");

    // клик по выбранному тегу -> логика в TaskData делает setTagId("")
    await userEvent.click(chipLabel);
    expect(args.setTagId).toHaveBeenCalledTimes(1);
    expect(args.setTagId).toHaveBeenCalledWith("");
  },
};
