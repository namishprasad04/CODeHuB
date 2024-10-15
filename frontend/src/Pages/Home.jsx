/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ProblemTable from "../components/ProblemTable";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [solvedFilter, setSolvedFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
    fetchUser();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter, solvedFilter, user]);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://codehub-awtv.onrender.com/api/problems"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log("User ID not found in localStorage");
        return;
      }
      const response = await fetch(
        `https://codehub-awtv.onrender.com/api/auth/get-user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    if (searchTerm) {
      filtered = filtered.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (problem) =>
          problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    if (solvedFilter !== "all" && user && user.attemptedProblems) {
      filtered = filtered.filter((problem) => {
        const isAttempted = user.attemptedProblems.some(
          (attemptedProblem) =>
            attemptedProblem.problemId === problem._id &&
            attemptedProblem.hasSubmitted
        );
        return solvedFilter === "solved" ? isAttempted : !isAttempted;
      });
    }

    setFilteredProblems(filtered);
  };

  const handleSolve = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Problems
          </h1>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={solvedFilter}
                onChange={(e) => setSolvedFilter(e.target.value)}
                className="pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Problems</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ProblemTable
              problems={filteredProblems}
              user={user}
              onSolve={handleSolve}
            />
          )}
        </div>
      </main>
    </div>
  );
}
