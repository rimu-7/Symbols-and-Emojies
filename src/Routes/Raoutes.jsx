import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../ErrorPage/ErrorPage";
import App from "../App";
import Home from "../component/Home";
import EmojiList from "../component/EmojiList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />, // Main layout
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />, // Home Page
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/emoji",
        element: <EmojiList />,
      },
    ],
  },
]);
