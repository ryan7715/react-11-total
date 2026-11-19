
import { createBrowserRouter, type RouteObject } from "react-router";

import MainLayout from "../layouts/MainLayout.tsx";

import Home from "../pages/Home.tsx";
import TodoList from "../pages/TodoList.tsx";
import CoinTracker from "../pages/CoinTracker.tsx";
import Movie from "../pages/Movie.tsx";
import Books from "../pages/Books.tsx";
import Product from "../pages/Product.tsx";
import Board from "../pages/Board.tsx";

const AppRouter = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "todo", element: <TodoList /> },
        { path: "coin", element: <CoinTracker /> },
        { path: "movie", element: <Movie /> },
        { path: "books", element: <Books /> },
        { path: "product", element: <Product /> },
        { path: "board", element: <Board /> },
      ],
    },
  ];

  return createBrowserRouter(routes);
};

export default AppRouter;

