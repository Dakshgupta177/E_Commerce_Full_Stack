import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const isLogined = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (isLogined) {
    setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [isLogined]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submit, setsubmit] = useState(false);
  const [error, seterror] = useState("something went wrong");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const closePopup = () => {
    setsubmit(false);
  };
  const onSubmit = async (data) => {
    setTimeout(() => {
      setsubmit(true);
    }, 1000);
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/user/login",
        data,
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(login({ userData: res.data.user }));
      seterror(res.data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Response", error.response.data);
      seterror(error.response.data.message);
      if (
        error.response.data.message ===
        "User does not exist !! Please Signup first !!"
      ) {
        setTimeout(() => {
          navigate("/user/signup");
        }, 3000);
      }
    }
  };

  return submit ? (
    <div className="h-[90vh] flex items-center justify-center  dark:bg-zinc-950 ">
      {loading && (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50"
          alt="Loading..."
        />
      )}
      <div className="h-96 max-sm:h-60 w-[60vw] bg-neutral-800 flex justify-around items-center flex-col rounded-2xl text-white">
        <h4 className="font-bold text-4xl text-center max-sm:text-2xl">
          {error}
        </h4>
        <div className="flex gap-12">
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
    <div className="min-h-screen w-screen dark:bg-zinc-950 flex flex-col items-center">
      <h1 className="text-4xl my-24 font-extrabold text-zinc-800 dark:text-white">Login User</h1>
      <form
        className="w-full max-w-sm mx-auto flex flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="emailOrUsername"
            >
              Email Or Username
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("emailOrUsername", { required: true })}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="emailOrUsername"
              type="text"
            />
          </div>
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
        </div>
        <div className="flex items-center justify-center">
          <button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
