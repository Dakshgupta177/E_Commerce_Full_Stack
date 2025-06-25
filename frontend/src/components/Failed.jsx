import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const Failed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-600 bg-gray-100">
      <FaTimesCircle size={80} />
      <h1 className="text-3xl font-bold mt-4">Payment Failed</h1>
      <p className="text-lg mt-2 text-gray-700">Your payment was not completed.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Failed;