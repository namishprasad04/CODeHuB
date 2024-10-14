import React, { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt, FaTimes, FaTrophy } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null); // For storing user data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the userId from localStorage
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Fetch user data from the backend API
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/auth/get-user/${userId}`
          ); // Call the API

          // Check if the response is okay
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json(); // Parse the JSON response
          setUserData(data); // Set the user data
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data");
        } finally {
          setLoading(false); // Stop loading regardless of success or error
        }
      };

      fetchUserData();
    } else {
      setError("User ID not found in localStorage");
      setLoading(false);
    }
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>; // Show an error message
  }
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("score");

    // Optionally, you can notify the server of the logout, if needed
    // await fetch('/api/logout', { method: 'POST' });

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://res.cloudinary.com/namish/image/upload/v1727594167/codehub-high-resolution-logo-transparent_sbguh0.png"
                alt="CodeHub Logo"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-white">{userData.username}</span>
            <span className="text-blue-400 font-semibold">
              Score: {userData.score}
            </span>
            <Link to='/leaderboard'>
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none">
                <FaTrophy className="h-4 w-4 mr-2" />
                Leaderboards
              </button>
            </Link>
            <button
              onClick={handleLogOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              Log out
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2 text-base font-medium text-white">
              {userData.username}
            </div>
            <div className="px-3 py-2 text-base font-medium text-blue-400">
              Score: {userData.score}
            </div>
            <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <FaTrophy className="inline-block h-5 w-5 mr-2" />
              Leaderboards
            </button>
            <button
              onClick={handleLogOut}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <FaSignOutAlt className="inline-block h-5 w-5 mr-2" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
