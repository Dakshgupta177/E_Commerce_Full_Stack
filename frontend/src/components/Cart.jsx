import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decreament, increament } from "../store/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { updateData } from "../store/authSlice";

const Cart = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.userData);
  const [Items, setItems] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);
  const Day = days[new Date().getDay()];
  const Month = months[new Date().getMonth()];
  const date = new Date().getDate() + 2;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await axios.post("https://e-commerce-full-stack-backend-7by3.onrender.com/api/user/updateaddress", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(updateData({ userData: response.data.user }));
      setError(response.data.message);
    } catch (error) {
      setError(error);
    } finally {
      setloading(false);
    }
  };

  const makePayment = async () => {
    setloading(true);
    try {
      if (!user.address) {
        return setShowAddressPopup(true);
      }
      const stripe = await loadStripe(
        "pk_test_51RbeO8Q3LuoRWPJrOKfyCRgDIU3qnlXvtAv4PAti59rtupo2kJ1YD7r9dgvo9Zk2bnxI42CW8f7oOMxM4L1BEoS7000cnGswbe"
      );
      const response = await axios.post(
        "https://e-commerce-full-stack-backend-7by3.onrender.com/api/stripe/checkout",
        {
          product: Items,
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
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const getCartItems = async () => {
    setloading(true);
    try {
      const response = await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/getcartdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setItems(response?.data?.Data?.Products || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const handleIncreament = async (id) => {
    setloading(true);
    try {
      await axios.post("https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/addtocart", { productId: id }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const response = await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/getcartdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setItems(response?.data?.Data?.Products);
      dispatch(increament());
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const handleDecreament = async (id) => {
    setloading(true);
    try {
      await axios.post("https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/minuscart", { productId: id }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const response = await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/cart/getcartdetails", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setItems(response?.data?.Data?.Products || []);
      dispatch(decreament());
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    setloading(false);
    getCartItems();
  }, []);
  useEffect(() => {
    if (Items) {
      let totalDiscount = 0;
      let totalPrice = 0;
      Items.forEach((item) => {
        totalDiscount += item.price * 80 * 0.2 * item.quantity;
      });
      Items.forEach((item) => {
        totalPrice += item.price * 80 * 0.8 * item.quantity;
      });
      const TotalDiscount = Number(totalDiscount).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      });
      const TotalPrice = Number(totalPrice).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      });
      setTotalDiscount(TotalDiscount);
      setTotalPrice(TotalPrice);
    }
  }, [Items]);

  return Items.length > 0 ? (
    <div className="flex flex-col justify-center">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          alt="Loading..."
        />
      )}
      <button
        className="bg-gray-500 hover:bg-gray-400 p-2 w-fit mx-auto rounded-xl mt-8"
        onClick={() => {
          setShowAddressPopup(true);
        }}
      >
        Change Address
      </button>
      {Items.map((item) => {
        return (
          <div
            className="bg-gray-100 dark:bg-zinc-950 p-4 md:p-8 text-sm"
            key={item.name}
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              {/* Left: Cart Item */}
              <div className="md:col-span-2">
                {/* Cart Item Card */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-28">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-full object-contain rounded border"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-base font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>

                      <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-medium">
                        Assured
                      </span>

                      <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        ₹
                        {Number(item.price * 80 * 0.8).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                        <span className="line-through text-sm text-gray-500 ml-2">
                          ₹
                          {Number(item.price * 80).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        <span className="text-green-600 text-sm font-medium ml-2">
                          20% Off
                        </span>
                      </p>

                      <p className="text-xs text-green-600 mt-1">
                        Delivery by {date} {Month}, {Day}
                      </p>

                      {/* Quantity + Actions */}
                      <div className="mt-4 flex gap-4 items-center flex-wrap">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={(e) => {
                              handleDecreament(item._id);
                            }}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-black text-xl"
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              handleIncreament(item._id);
                            }}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-black text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 rounded-md shadow-sm h-fit">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          PRICE DETAILS
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {Items.map((item, index) => {
            return (
              <div className="flex justify-between" key={index}>
                <span>Price ({index + 1} item)</span>
                <span>
                  ₹
                  {Number(item.price * 80 * 0.8).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                  X {item.quantity} = ₹
                  {Number(item.price * 80 * 0.8 * item.quantity).toLocaleString(
                    "en-IN",
                    { maximumFractionDigits: 0 }
                  )}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">− ₹{totalDiscount}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
          <p className="text-green-600 text-sm mt-2">
            You will save ₹{totalDiscount} on this order
          </p>
          <button
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            onClick={makePayment}
          >
            PLACE ORDER
          </button>
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
            className="absolute top-4 right-4 text-xl font-bold text-gray-600 cursor-pointer"
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
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer  ${
              error === "successfully updated" ? "hidden" : ""
            }`}
            disabled={
              errors.phone || errors.address || errors.city || errors.pin
            }
            type="submit"
          >
            Save
          </button>
          <button
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer ${
              error === "successfully updated" ? "" : "hidden"
            }`}
            onClick={makePayment}
          >
            Proceed to Pay
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
    <div className="flex items-center justify-center h-screen">
      <h1 className="font-bold text-4xl">No Items in the Cart</h1>
    </div>
  );
};

export default Cart;
