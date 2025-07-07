import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signup = () => {
  const [submit, setsubmit] = useState(false);
  const [error, seterror] = useState("something went wrong");
  const [isSignin, setisSignin] = useState(false);
  const navigate= useNavigate();
  const user = useSelector((state)=>state.auth.status)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const closePopup = () => {
    setsubmit(false);
  };
  useEffect(() => {
   if (user) {
    navigate("/")
   }
  }, [])
  
  const onSubmit = async (data) => {
    setsubmit(true);
    try {
      const dat = await axios.post(
        "/api/user/signup",
        data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      );
      seterror(dat.data.message);
      setisSignin(true);
    } catch (error) {
      console.log("Response", error.response.data);
      seterror(error.response.data.message || "something went wrong");
    }
  };

  return submit ? (
    <div className="h-[90vh] flex items-center justify-center dark:bg-zinc-950">
      <div className="h-96 max-sm:h-60 w-[60vw] bg-neutral-800 flex justify-around items-center flex-col rounded-2xl text-white">
        <h4 className="font-bold text-4xl text-center max-sm:text-2xl">
          {error}
        </h4>
        <div className="flex gap-12">
          <button
            className={`font-bold max-sm:text-lg text-2xl bg-green-500 p-4 py-2 rounded-full ${
              isSignin ? "" : "hidden"
            }`}
          >
            <Link to={"/user/login"}>Login</Link>
          </button>
          <button
            onClick={closePopup}
            className="font-bold text-2xl bg-green-500 p-4 py-2 rounded-full max-sm:text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[90vh] w-screen  dark:bg-zinc-950 flex flex-col items-center">
      <h1 className="text-4xl my-24 font-extrabold text-zinc-800 dark:text-white">Signup User</h1>
      <form
        className="w-full max-w-sm mx-auto flex flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="fullName"
            >
              FullName
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("fullName", { required: true })}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="fullName"
              type="text"
            />
          </div>
          <h4>
            {errors.fullName && (
              <span className="text-red-500 ">This field is required</span>
            )}
          </h4>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="username"
            >
              Username
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("username", { required: true })}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="username"
              type="text"
            />
          </div>
          <h4>
            {errors.username && (
              <span className="text-red-500">This field is required and should use special char</span>
            )}
          </h4>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="email"
            >
              Email
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("email", { required: true ,pattern: /^\S+@\S+$/i ,unique: true})}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="email"
              type="text"
            />
          </div>
          <h4>
            {errors.email && (
              <span className="text-red-500 ">This field is required</span>
            )}
          </h4>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("password", { required: true })}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="password"
              type="password"
            />
          </div>
          <h4>
            {errors.username && (
              <span className="text-red-500">This field is required</span>
            )}
          </h4>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
