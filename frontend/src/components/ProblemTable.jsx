import React from "react";
import ProblemTableHeader from "./ProblemTableHeader";
import ProblemTableRow from "./ProblemTableRow";

export default function ProblemTable({ problems, onSolve }) {
  if (problems.length === 0) {
    return <p>No problems available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <ProblemTableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {problems.map((problem,i) => (
            <ProblemTableRow key={problem._id} problem={problem} i={i+1} onSolve={onSolve} />
          ))}
        </tbody>
      </table>
    </div>
  );
}