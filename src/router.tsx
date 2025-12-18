import { createBrowserRouter } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import NewPlace from "./pages/NewPlace"
import PlaceDetail from "./pages/PlaceDetail"
import Book from "./pages/Book"

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/places/new", element: <NewPlace /> },
      { path: "/places/:id", element: <PlaceDetail /> },
      { path: "/book", element: <Book /> },
    ],
  },
])
