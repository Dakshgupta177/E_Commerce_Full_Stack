import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import Layout from "./components/Layout.jsx";
import App from "./App.jsx";
import Signup from "./components/User/signup.jsx";
import Login from "./components/User/Login.jsx";
import Profile from "./components/User/Profile.jsx";
import { AddProduct } from "./components/AddProduct.jsx";
import Cart from "./components/Cart.jsx";
import SearchProduct from "./components/SearchProduct.jsx";
import ProductCard from "./components/ProductCard.jsx";
import Success from "./components/Success.jsx";
import Failed from "./components/Failed.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Order from "./components/Order.jsx";
import Admin from "./components/Admin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App></App>,
      },
      {
        path: "/user/signup",
        element: <Signup />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/profile",
        element: <Profile />,
      },
      {
        path: "/products/addproduct",
        element: <AddProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/Search/:item",
        element: <SearchProduct />,
      },
      {
        path: "/product/:title",
        element: <ProductCard />,
      },
      { path: "/success", element: <Success /> },
      {
        path: "/cancel",
        element: <Failed />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      { path: "/orders", element: <Order /> },
      { path: "/adminlogin", element: <Admin /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
