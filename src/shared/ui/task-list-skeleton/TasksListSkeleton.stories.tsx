import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { TasksListSkeleton } from "./TaskListSkeleton";

const meta: Meta<typeof TasksListSkeleton> = {
  title: "pages/TasksList/TasksListSkeleton",
  component: TasksListSkeleton,
  args: {
    count: 12,
  },
} satisfies Meta<typeof TasksListSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByTestId("task-card-skeleton");
    await expect(cards).toHaveLength(args.count ?? 12);

    const dots = canvas.getAllByTestId("pagination-skeleton-dot");
    await expect(dots).toHaveLength(5);
  },
};

export const SmallPageSize: Story = {
  args: { count: 4 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const cards = canvas.getAllByTestId("task-card-skeleton");
    await expect(cards).toHaveLength(args.count ?? 4);
  },
};
