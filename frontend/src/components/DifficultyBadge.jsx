import React from "react";

export default function DifficultyBadge({ difficulty }) {
  const badgeColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800"
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}