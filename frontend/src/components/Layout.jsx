import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { getProducts } from "../store/productSlice";

const Layout = () => {
  let isLogined = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const getUser = async () => {
    try {
      const response = await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/product/getallproducts", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);
      
      const Products = response.data.products;
      dispatch(getProducts({ products: Products }));
    } catch (error) {
      console.log(error || "Products not found");
    }
    try {
      setloading(true);
      const response = await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/user/userprofile");
      await axios.post("https://e-commerce-full-stack-backend-7by3.onrender.com/api/user/refresh/token");
      dispatch(login({ userData: response.data.data }));
      setloading(false);
    } catch (error) {
      setloading(true);
      setTimeout(() => {
        navigate("/user/signup");
        setloading(false);
      }, 2000);
      throw new Error(error.response.data.message);
    }
  };
  useEffect(() => {
    getUser();
    setloading(false);
  }, [isLogined]);

  return (
    <div>
      {loading ? (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 "
          alt="Loading..."
        />
      ) : null}
      <Navbar />
      <main className="bg-[#f9f9f9] dark:bg-zinc-950 text-black dark:text-white min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
