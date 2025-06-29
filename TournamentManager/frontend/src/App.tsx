import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Map from "./pages/Map";
import Teams from "./pages/Teams";
import { BaseLayout } from "./pages/BaseLayout";
import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    Component: BaseLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/schedule",
        Component: Schedule,
      },
      {
        path: "/map",
        Component: Map,
      },
      {
        path: "/teams",
        Component: Teams,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>, // TODO: ERROR PAGE
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;