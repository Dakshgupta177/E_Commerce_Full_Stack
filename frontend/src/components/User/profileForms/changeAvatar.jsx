import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/authSlice";
import axios from "axios";
export const ChangeAvatar = () => {
  const fileSubmit = async () => {
    setloading(true);
    const file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post(
      "/api/user/edituseravatar",
      formData,
      {
        withCredentials: true,
      }
    );

    console.log(response);
    dispatch(login({ userData: response.data.data }));
    setloading(false);
  };
  const user = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center mb-6 min-h-40 gap-4">
      {loading ? (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 "
          alt="Loading..."
        />
      ) : null}
      <img
        src={`${user.userData?.avatar}`}
        alt=""
        className="rounded-lg size-28"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="file"
        name="avatar"
        onChange={fileSubmit}
      />
      <label
        className="font-semibold text-xl bg-neutral-600 text-white hover:bg-neutral-400 p-4 py-2 rounded-lg max-sm:text-lg h-12"
        htmlFor="file"
      >
        Change Avatar
      </label>
    </div>
  );
};
