import {createBrowserRouter, Navigate, RouterProvider} from "react-router";
import DemoApp from "./pages/demo-app";
import ModelApp from "./pages/model-app";

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

const router = createBrowserRouter([
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
  }
])