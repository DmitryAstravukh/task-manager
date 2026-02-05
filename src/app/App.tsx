import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/router.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
