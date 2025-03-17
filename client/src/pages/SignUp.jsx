import React, { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed: npm install axios

const SignUp = () => {
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Connect to your backend API
      const response = await fetch("http://localhost:5252/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Registration failed. Please try again."
        );
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);

      // Store email for OTP verification
      localStorage.setItem("email", inputData.email);

      // Redirect to OTP verification page
      navigate("/verify-otp");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="border p-4 sm:p-6 w-full max-w-md rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Signup
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={inputData.email}
            onChange={handleChange}
            autoComplete="off"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={inputData.password}
            onChange={handleChange}
            autoComplete="off"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="mt-6 flex justify-center items-center flex-col space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2 bg-purple-400 text-white rounded hover:bg-purple-700 transition-colors duration-300 w-full"
            >
              {loading ? "Processing..." : "Register"}
            </button>
            <Link to="/login">
              <p className="text-sm text-gray-600 hover:text-purple-500">
                Already a user? Login
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
