import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const [inputData, setInputData] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage that was saved during registration
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      // Redirect to signup if email doesn't exist
      navigate("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Connect to backend API to verify OTP
      const response = await fetch(
        "http://localhost:5252/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: inputData.otp,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "OTP verification failed. Please try again."
        );
      }

      console.log("OTP verification successful:", responseData);

      // If verification is successful, remove email from localStorage
      localStorage.removeItem("email");

      // If response includes token, store it
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      }

      // Redirect to login page or dashboard based on your flow
      navigate("/login");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="border p-4 sm:p-6 w-full max-w-md rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Verify OTP
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <p className="text-center text-gray-600 mb-4">
          We have sent a verification code to <strong>{email}</strong>
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            name="otp"
            value={inputData.otp}
            onChange={handleChange}
            autoComplete="one-time-code"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            maxLength="6"
          />
          <div className="mt-6 flex justify-center items-center flex-col space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2 bg-purple-400 text-white rounded hover:bg-purple-700 transition-colors duration-300 w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="flex justify-between w-full text-sm">
              <button
                className="text-purple-600 hover:text-purple-800"
                onClick={() => navigate("/signup")}
              >
                Change Email
              </button>
              <button
                className="text-purple-600 hover:text-purple-800"
                // Add resend OTP functionality here
                onClick={() =>
                  alert("Resend OTP functionality to be implemented")
                }
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
