import React from "react";
import Button from "./components/Button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="border p-4 sm:p-6 md:p-8 w-full max-w-md rounded-lg shadow-md bg-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Task Management App
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Organize your tasks efficiently and boost your productivity
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login">
            <Button btnName="Login" />
          </Link>
          <Link to="/signup">
            <Button btnName="Sign Up" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
