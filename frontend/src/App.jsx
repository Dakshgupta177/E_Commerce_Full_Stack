import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { increament } from "./store/cartSlice";
function App() {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [loading, setloading] = useState(true);
  const Products = useSelector((state) => state.products);

  const handleSearchbar = (e) => {
    if (e.key == "Enter") {
      navigate(`/search/${query}`);
    }
  };
  const handleSearchLogo = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleproduct = async (id) => {
    setloading(true);
    try {
      const response = await axios.post(
        "/api/cart/addtocart",
        { productId: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(increament());
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const getProducts = async () => {
    setproducts(Products.products);
  };
  useEffect(() => {
    setloading(false);
    getProducts();
  }, [Products]);

  return products ? (
    <div
      className="flex flex-col flex-wrap mx-auto overflow-hidden min-h-screen "
      loading="lazy"
    >
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      <div className="max-w-md mx-auto my-8 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={handleSearchbar}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black min-w-48 sm:min-w-96 "
        />
        <FcSearch
          className="size-14 max-sm:size-10 cursor-pointer"
          onClick={handleSearchLogo}
        />
      </div>
      <section className=" w-full py-16 px-6 md:px-12 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Big Savings on{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Top Products
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Shop the latest gadgets, fashion, home essentials and more — all
              in one place.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1532074205216-d0e1f4b87368"
            alt="Shopping Illustration"
            className="w-full max-w-md rounded-xl shadow-md contrast-[1.2] max-sm:mx-auto hidden dark:block mx-auto"
          />
          <img
            src="https://images.pexels.com/photos/1030895/pexels-photo-1030895.jpeg"
            alt="Shopping Illustration"
            className="w-full max-w-md rounded-xl shadow-md contrast-[1.2] max-sm:mx-auto dark:hidden mx-auto"
          />
        </div>
      </section>

      <div className="flex flex-wrap mx-auto overflow-hidden">
        {products.slice(80, 100).map((item) => {
          return (
            <div
              key={item._id}
              className="max-w-90 min-w-60 m-4 mx-auto bg-white rounded-lg shadow-md p-5 w-full transition-transform transform hover:-translate-y-1 hover:shadow-xl"
            >
              <Link to={`/product/${item.name}`}>
                <img
                  className="h-48 mx-auto object-cover"
                  src={item.image}
                  alt="Product Image"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 max-sm:hidden">
                    {item.description}
                  </p>
                </div>
              </Link>

              <div className="mt-4 flex items-center justify-between px-4">
                <span className="text-green-600 font-bold text-lg">
                  ₹
                  {(Number(item.price) * 80 * 0.8).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                  <span className="max-sm:block">(20% off)</span>
                </span>
                <button
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer"
                  onClick={(e) => handleproduct(item._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <h1>Login to see products</h1>
  );
}

export default App;
