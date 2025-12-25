import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./page/Home";
import NewPlace from "./page/NewPlace";
import PlaceDetail from "./page/PlaceDetail";
import Book from "./page/Book";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    element: <Layout />,
    children: [
      { path: "/places/new", element: <NewPlace /> },
      { path: "/places/:id", element: <PlaceDetail /> },
      { path: "/book", element: <Book /> },
    ],
  },
]);
