import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormOne } from "./profileForms/editProfileForm";
import { FormTwo } from "./profileForms/changePasswordForm";
import { useSelector } from "react-redux";
import { ChangeAvatar } from "./profileForms/changeAvatar";
import { DeleteProfile } from "./profileForms/deleteUserProfile";


const Profile = () => {
  const Navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const user = useSelector((state) => state.auth);
  const daksh = user.status 

  useEffect(() => {
    loading && setloading(false);
    const wait = async () => {
      setTimeout(() => {
        return null;
      }, 3000);
      wait()
      if (!user.status) {
        Navigate("/user/login")
      }
    };
  }, []);
  
  return (
    <div className="flex ">
      {loading ? (
        <img
          src="https://i.gifer.com/ZKZg.gif"
          className="size-12 fixed top-1/2 left-1/2 "
          alt="Loading..."
          />
        ) : null}
      <div className="min-h-screen w-1/3 bg-gray-400 dark:bg-neutral-900 text-center max-md:hidden lg:flex flex-col justify-center items-center">
        <div className=" h-96 flex justify-center items-center flex-col my-10">
        <h3 className="font-bold text-2xl my-2">Personal Information</h3>
        <p className="font-medium text-xl dark:text-gray-100">
          Use a permanent address where you can receive mail.
        </p>
        </div>
        <div className=" h-96 flex justify-center items-center flex-col mt-48">
        <h3 className="font-bold text-2xl my-2">Change Password</h3>
        <p className="font-medium text-xl dark:text-gray-100">
        Update your password associated with your account.
        </p>
        </div>
        <div className=" h-96 flex justify-center items-center flex-col mt-20">
        <h3 className="font-bold text-2xl my-2">Delete Account</h3>
        <p className="font-medium text-xl dark:text-gray-100">
        No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.
        </p>
        </div>
      </div>
      <div className="min-h-screen w-2/3 flex justify-center dark:bg-zinc-950 max-md:w-full">
        <div className="min-h-[90vh] w-screen dark:bg-zinc-950 flex flex-col items-center">
          <h2 className="font-bold text-3xl my-6">Personal Information</h2>
          <ChangeAvatar />
            <FormOne />
          <div className="h-px bg-gray-900 z-10 w-full my-20"></div>
          <div className="flex items-center mb-6 min-h-40 gap-4 flex-col">
            <h2 className="font-bold text-3xl ">Change Password</h2>
            <FormTwo />
          </div>
          <div className="h-px bg-gray-900 z-10 w-full my-20"></div>
          <DeleteProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;
