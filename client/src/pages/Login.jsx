import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
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
      // Connect to backend API for login
      const response = await axios.post(
        "http://localhost:5252/api/auth/login",
        inputData
      );

      console.log("Login successful:", response.data);

      // Store authentication token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Store user info if available
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Login successful but no token received.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="border p-4 sm:p-6 w-full max-w-md rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Login
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
            autoComplete="email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={inputData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="mt-6 flex justify-center items-center flex-col space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2 bg-purple-400 text-white rounded hover:bg-purple-700 transition-colors duration-300 w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="flex justify-between w-full">
              <Link to="/forgot-password">
                <p className="text-sm text-purple-600 hover:text-purple-800">
                  Forgot Password?
                </p>
              </Link>
              <Link to="/signup">
                <p className="text-sm text-purple-600 hover:text-purple-800">
                  New user? Register
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
