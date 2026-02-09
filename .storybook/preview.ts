import type { Preview } from "@storybook/react-vite";

//это нужно для корректного запуска тестов из браузера из‑за того, что TypeScript в файле .storybook/preview.ts компилируется как Node‑окружение,
// а не как браузерное. В Node нет глобального объекта window
declare const window: unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).global = window;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
