import React from "react";
import DifficultyBadge from "./DifficultyBadge";

export default function ProblemTableRow({ problem, onSolve,i }) {
  return (
    <tr>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {i}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-md text-gray-900 font-semibold">
        {problem.name}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
        {problem.score}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
        {problem.userTried?.toLocaleString()}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
        {problem.successRate?.toFixed(1)}%
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <DifficultyBadge difficulty={problem.difficulty} />
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onSolve(problem._id)}
          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded transition"
        >
          Solve
        </button>
      </td>
    </tr>
  );
}