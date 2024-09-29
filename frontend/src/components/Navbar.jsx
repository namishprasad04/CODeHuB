import React, { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

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
    return <p className="mx-auto text-purple-800 ">Loading...</p>; // Show a loading message
  }

  if (error) {
    return <p>{error}</p>; // Show an error message
  }
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Optionally, you can notify the server of the logout, if needed
    // await fetch('/api/logout', { method: 'POST' });

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className=" bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="ml-2 text-xl font-semibold">
              <Link to="/home">
                <img
                  className="w-auto h-7 sm:h-8"
                  src="https://res.cloudinary.com/namish/image/upload/v1727594167/codehub-high-resolution-logo-transparent_sbguh0.png"
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <span className="text-white mr-4">{userData.username}</span>
            <button
              onClick={handleLogOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-800 focus:outline-none transition"
            >
              <FaSignOutAlt className="h-5 w-5 mr-2" />
              Log out
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <span className="block px-3 py-2 text-base font-medium text-white">
              namish
            </span>
            <button
              onClick={handleLogOut}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gray-900 hover:bg-gray-50"
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
