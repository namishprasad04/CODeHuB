import React, { useState } from "react";
import { register } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // To store error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error messages
    try {
      const response = await register(username, email, password);
      if (response.error) {
        // Check if the response contains an error and set it
        setError(response.error.message);
      } else {
        // Handle successful registration
        navigate("/login");
      }
    } catch (error) {
      // Display error message if registration fails
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
            }}
          >
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  CODeHuB
                </h2>

                <p className="max-w-xl mt-3 text-gray-300">
                  A dynamic platform designed to enhance your coding skills
                  through real-world challenges, algorithmic problems, and
                  coding contests. Whether you're a beginner or an experienced
                  developer, CodeHub offers a space to sharpen your programming
                  abilities and connect with a global community of coders.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <img
                    className="w-auto h-7 sm:h-8"
                    src="https://res.cloudinary.com/namish/image/upload/v1727594167/codehub-high-resolution-logo-transparent_sbguh0.png"
                    alt=""
                  />
                </div>

                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  Sign Up to access your account
                </p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div className="mt-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="text-sm text-gray-600 dark:text-gray-200"
                      >
                        Password
                      </label>
                    </div>

                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-500">
                      {error}
                    </p>
                  )}

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-purple-700 rounded-lg hover:bg-purple-900 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-400">
                  Already have an account?
                  <Link
                    to="/login"
                    className="text-purple-500 focus:outline-none focus:underline hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
