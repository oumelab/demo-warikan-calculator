import {createHashRouter, Navigate, RouterProvider} from "react-router";
import DemoApp from "./pages/demo-app";
import ModelApp from "./pages/model-app";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

const router = createHashRouter([
  {
    index: true,
    Component: () => Navigate({ to: "/demo-app" }),
  },
  {
    path: "demo-app",
    element: <DemoApp />,
  },
  {
    path: "/model-app",
    element: <ModelApp />,
  },
  {
    path: "*",
    Component: NotFound,
  },
])