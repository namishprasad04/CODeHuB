import React from "react";

export default function ProblemDescription({ problem }) {
  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
      <p className="text-gray-700 mb-4">{problem.description}</p>
      <div className="mb-4">
        <h3 className="font-semibold">Difficulty:</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
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
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Examples:</h3>
        {problem.examples.map((example, index) => (
          <div key={index} className="mt-2">
            <h4 className="font-medium">Example {index + 1}:</h4>
            <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
              Input: {JSON.stringify(example.input)}
              <br />
              Output: {JSON.stringify(example.output)}
              <br />
              {example.explanation && (
                <span>Explanation: {example.explanation}</span>
              )}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}