import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { increament } from "../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateData } from "../store/authSlice";

const productCard = () => {
  const params = useParams();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.userData);
  const [loading, setloading] = useState(true);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [error, setError] = useState(null);
  const [curr, setcurr] = useState(0);
  const [prod, setprod] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await axios.post("/api/user/updateaddress", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(updateData({ userData: response.data.user }));
      setError(response.data.message);
      setTimeout(() => {
        setShowAddressPopup(false);
      }, 2000);
    } catch (error) {
      setError(error);
    } finally {
      setloading(false);
    }
  };

  const makePayment = async () => {
    setloading(true);
    if (!user.address) {
      return setShowAddressPopup(true);
    }
    try {
      const stripe = await loadStripe(
        "pk_test_51RbeO8Q3LuoRWPJrOKfyCRgDIU3qnlXvtAv4PAti59rtupo2kJ1YD7r9dgvo9Zk2bnxI42CW8f7oOMxM4L1BEoS7000cnGswbe"
      );
      const response = await axios.post(
        "/api/stripe/checkout",
        {
          product: prod,
        }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      );
      const sessionId = response.data.id;
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const handleproduct = async () => {
    setloading(true);
    try {
      const response = await axios.post(
        "/api/cart/addtocart",
        { productId: prod[0]._id }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      );
      dispatch(increament());
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const prevSlide = () => {
    setcurr((curr) => (curr == 0 ? prod[0].images.length - 1 : curr - 1));
  };
  const nextSlide = () => {
    setcurr((curr) => (curr == prod[0].images.length - 1 ? 0 : curr + 1));
  };
  const getTheProduct = async () => {
    setloading(true);
    try {
      const Product = await axios.post("/api/product/getaproduct", {
        Product_title: params.title,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setprod([Product.data.product]);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    setloading(false);
    getTheProduct();
  }, []);

  return params.title && prod.length > 0 ? (
    <div>
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 z-50"
          alt="Loading..."
        />
      )}
      <div className="md:flex">
        <div className="md:w-1/2 w-screen">
          <div className="sticky h-96 overflow-hidden ">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${curr * 100}%)` }}
            >
              {prod[0].images.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt=""
                  className="w-screen h-96 object-contain flex-shrink-0 dark:bg-white "
                />
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-10 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full hover:bg-gray-500 transition size-10"
            >
              <FaChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full hover:bg-gray-500 transition size-10"
            >
              <FaChevronRight className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            {prod[0].images.map((item, index) => (
              <img
                key={index}
                src={item}
                alt=""
                className={`size-20 border dark:bg-white hover:scale-110 max-sm:size-16`}
                onMouseEnter={() => setcurr(index)}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-8 justify-center items-center ">
            <button
              className="flex items-center gap-2 sm:px-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-9 cursor-pointer rounded shadow "
              onClick={handleproduct}
            >
              <FaShoppingCart className="text-white" />
              ADD TO CART
            </button>
            <button
              className="flex items-center gap-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-9 cursor-pointer rounded shadow"
              onClick={makePayment}
            >
              <FaBolt className="text-white" />
              BUY NOW
            </button>
          </div>
        </div>
        <div className="md:w-1/2 p-4 flex flex-col justify-between">
          <div className="flex flex-col justify-center ">
            <h1 className="text-3xl font-bold mb-2">{prod[0].name}</h1>
            <p className="text-gray-400 mb-4 text-lg">{prod[0].description}</p>
            <p className="text-xl font-semibold text-red-600 mb-2 line-through">
              ₹
              {(Number(prod[0].price) * 80).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-3xl font-semibold text-green-600 mb-2">
              ₹
              {(Number(prod[0].price) * 0.8 * 80).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
              (20% off)
            </p>
            <p className=" text-gray-500">Category: {prod[0].category}</p>
            <p className="text-gray-300 text-lg">Brand: {prod[0].company}</p>
            <p className="text-gray-300 text-lg">
              Items Left : {prod[0].items}
            </p>
            <div className="flex items-center gap-2 ">
              <div className="text-gray-300 flex items-center bg-green-500 rounded-lg p-1 mt-4 w-12 cursor-pointer">
                <p className="text-sm font-semibold">{prod[0].rating}</p>
                <FaStar className="font-normal size-4" />
              </div>
              <p className=" mt-3 cursor-pointer"> Reviews and ratings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 ">
        <div className="md:w-1/2 max-md:hidden">
          <h1 className="text-3xl text-center">Reviews and Ratings</h1>
        </div>
        <div className="md:w-1/2 w-full">
          <div>
            <h1 className="text-3xl text-center border md:hidden">
              Reviews and Ratings
            </h1>
            {prod[0].reviews.map((item) => {
              return (
                <div
                  key={item._id}
                  className="p-2 border dark:border-white border-gray-600"
                >
                  <div className="text-gray-300 flex items-center gap-1 bg-green-500 rounded-lg p-1 mt-4 w-8 cursor-pointer">
                    <p className="text-sm font-semibold">{item.rating}</p>
                    <FaStar className="font-normal size-4" />
                  </div>
                  <p className="text-gray-500">{item.comment}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      {item.reviewer_name} , Certified Buyer
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-0 w-full p-10 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          showAddressPopup ? "" : "hidden"
        } `}
      >
        <form
          className="p-6 rounded-lg w-[90%] max-w-md shadow-lg relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-lg font-bold mb-4">Enter Your Address </h2>
          <button
            type="button"
            onClick={() => setShowAddressPopup(false)}
            className="absolute top-4 right-4 text-lg font-bold text-gray-600"
          >
            ×
          </button>
          <div className="space-y-2">
            <input
              {...register("phone", {
                required: true,
                pattern: { value: /^[0-9]{10}$/ },
              })}
              minLength={10}
              maxLength={10}
              id="phone"
              placeholder="Phone"
              className="w-full p-2 border rounded"
            />
            <input
              {...register("address", { required: true })}
              id="address"
              placeholder="Address"
              className="w-full p-2 border rounded"
            />
            <input
              {...register("city", { required: true })}
              id="city"
              placeholder="City"
              className="w-full p-2 border rounded"
            />
            <input
              {...register("pin", {
                required: true,
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: "Enter a valid 6-digit PIN code",
                },
              })}
              maxLength={6}
              inputMode="numeric"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              id="pin"
              placeholder="PIN Code"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
            disabled={
              errors.phone || errors.address || errors.city || errors.pin
            }
            type="submit"
          >
            Save & Continue to Pay
          </button>
          <h4>
            {(errors.address || errors.city || errors.pin) && (
              <span className="text-red-500 ">Fill all fields</span>
            )}
          </h4>
          <h4>
            {errors.phone && (
              <span className="text-red-500 ">Enter a correct number</span>
            )}
          </h4>
          <div
            className={`text-white p-4 rounded-lg mt-4 ${
              error ? "" : "hidden"
            } ${
              error === "successfully updated" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <p>{error}</p>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <>
      <div className="text-2xl text-white">No Product Found</div>
    </>
  );
};

export default productCard;
