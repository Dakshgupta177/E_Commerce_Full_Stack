import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import axios from "axios";
import { increament } from "../store/cartSlice";

const SearchProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Products = useSelector((state) => state.products);
  const [query, setQuery] = useState("");
  const [loading, setloading] = useState(true)
  const [filteredProd, setFilteredProd] = useState([]);
  const handleproduct = async (id) => {
    setloading(true);
    try {
      const response = await axios.post(
        "https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/addtocart",
        { productId: id }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      dispatch(increament());
    } catch (error) {
      console.log(error);
      
    } finally{
      setloading(false)
    }
  };
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

  const getFilteredProd = () => {
    const filteredProducts = Products?.products?.filter((product) => {
      return (
        product?.name?.toLowerCase().includes(params?.item?.toLowerCase()) ||
        product?.category
          ?.toLowerCase()
          .includes(params?.item?.toLowerCase()) ||
        product?.description
          ?.toLowerCase()
          .includes(params?.item?.toLowerCase())
      );
    });
    setFilteredProd(filteredProducts);
  };
  useEffect(() => {
    setloading(false);
    getFilteredProd();
  }, [Products, params.item]);
  return (
    <div className="flex flex-col flex-wrap">
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
          className="size-14 hover:cursor-pointer"
          onClick={handleSearchLogo}
        />
      </div>
      <div>
        {filteredProd?.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {filteredProd.map((item) => {
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
        ) : (
          <div className="w-screen h-screen">
            <h1 className="relative left-1/3 top-1/3 text-5xl text-white ">
              No Product Found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
