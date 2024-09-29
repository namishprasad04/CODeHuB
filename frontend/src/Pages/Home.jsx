import React from "react";
import Navbar from "../components/Navbar";
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

  const handleSolve = (problemId) => {
    console.log(`Navigating to problem ${problemId}`);
    // In a real application, you would typically use a router to navigate to the problem page
    // For example: history.push(`/problem/${problemId}`)
    navigate("/problem-details");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

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
