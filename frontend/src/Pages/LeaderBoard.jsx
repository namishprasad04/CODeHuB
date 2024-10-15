import React, { useState, useEffect } from "react";
import { FaMedal } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://codehub-awtv.onrender.com/api/auth/get-users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setError("Failed to load leaderboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Problems Solved
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Overall Score
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.rank} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {entry.rank <= 3 ? (
                      <div className="flex items-center">
                        <FaMedal
                          className={`w-5 h-5 mr-2 ${
                            entry.rank === 1
                              ? "text-yellow-400"
                              : entry.rank === 2
                              ? "text-gray-400"
                              : "text-amber-600"
                          }`}
                        />
                        {entry.rank}
                      </div>
                    ) : (
                      entry.rank
                    )}
                  </td>
                  <td className="px-6 py-4">{entry.username}</td>
                  <td className="px-6 py-4 text-right">
                    {entry.problemsSolved}
                  </td>
                  <td className="px-6 py-4 text-right">{entry.overallScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
