import React, { useEffect, useState } from "react";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const problems = [
  {
    id: 1,
    name: "Two Sum",
    score: 10,
    usersTried: 2000000,
    successRate: 45.6,
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Add Two Numbers",
    score: 20,
    usersTried: 1500000,
    successRate: 33.8,
    difficulty: "Medium",
  },
  {
    id: 3,
    name: "Longest Substring Without Repeating Characters",
    score: 30,
    usersTried: 1800000,
    successRate: 31.5,
    difficulty: "Medium",
  },
  {
    id: 4,
    name: "Median of Two Sorted Arrays",
    score: 40,
    usersTried: 1000000,
    successRate: 29.9,
    difficulty: "Hard",
  },
  {
    id: 5,
    name: "Longest Palindromic Substring",
    score: 25,
    usersTried: 1300000,
    successRate: 30.1,
    difficulty: "Medium",
  },
];
export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null); // For storing user data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(""); // For error state

  const handleSolve = (problemId) => {
    console.log(`Navigating to problem ${problemId}`);
    // In a real application, you would typically use a router to navigate to the problem page
    // For example: history.push(`/problem/${problemId}`)
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Optionally, you can notify the server of the logout, if needed
    // await fetch('/api/logout', { method: 'POST' });

    // Redirect to the login page
    navigate("/login");
  };
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
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className=" bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="ml-2 text-xl font-semibold">
                <img
                  className="w-auto h-7 sm:h-8"
                  src="https://res.cloudinary.com/namish/image/upload/v1727594167/codehub-high-resolution-logo-transparent_sbguh0.png"
                  alt="Logo"
                />
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <span className="text-white mr-4">{userData.username}</span>
              <button onClick={handleLogOut} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-800 focus:outline-none transition">
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Problems
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Users Tried
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Success Rate
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Difficulty
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problems.map((problem) => (
                  <tr key={problem.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {problem.id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {problem.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {problem.score}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {problem.usersTried.toLocaleString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {problem.successRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleSolve(problem.id)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded transition"
                      >
                        Solve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
