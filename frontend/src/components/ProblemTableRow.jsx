import React from "react";
import DifficultyBadge from "./DifficultyBadge";

export default function ProblemTableRow({ problem, user, onSolve, i }) {
  // Check if the problem has been attempted by the user
  const isAttempted = user && user.attemptedProblems.some(
    attemptedProblem => attemptedProblem.problemId === problem._id && attemptedProblem.hasSubmitted
  );

  return (
    <tr>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {i}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-md text-gray-900 font-semibold">
        {problem.title}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
        {problem.score}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        {problem.userTried?.toLocaleString() || 0}  {/* Default to 0 if undefined */}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <DifficultyBadge difficulty={problem.difficulty} />
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => {
            if (!isAttempted) {
              onSolve(problem._id);  // Trigger onSolve only if not attempted
            }
          }}
          className={`text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded transition ${isAttempted ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isAttempted}
          aria-disabled={isAttempted}  // Accessibility improvement
        >
          {isAttempted ? "Solved" : "Solve"}  {/* Button text based on attempted status */}
        </button>
      </td>
    </tr>
  );
}