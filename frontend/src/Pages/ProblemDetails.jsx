import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const LANGUAGES = {
  javascript: { name: "JavaScript", extension: "js" },
  python: { name: "Python", extension: "py" },
};

export default function ProblemDetails() {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAllTestsPassed, setIsAllTestsPassed] = useState(false); // New state
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/problems/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }
        const data = await response.json();
        setProblem(data);
        setCode(data.starterCode[language]);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id, language]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (problem && problem.starterCode) {
      const starterCode = problem.starterCode[newLanguage] || "";
      setCode(starterCode);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setIsAllTestsPassed(false); // Reset the test status when rerunning

    try {
      const response = await fetch(
        `http://localhost:5000/api/problem/${id}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to run code");
      }

      const data = await response.json();
      setOutput(data.results);

      // Check if all test cases passed
      const allTestsPassed = data.results.every((result) => result.passed);
      setIsAllTestsPassed(allTestsPassed); // Enable the submit button if all tests pass
    } catch (error) {
      console.error("Error running code:", error);
      setOutput([{ error: "An error occurred while running the code." }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      alert("You need to log in to submit a solution.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/problem/${id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Replace with actual user ID
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      navigate("/home");
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert(error.message);
    }
  };

  if (!problem) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/home">
              <FaArrowLeftLong className="mb-5 ml-2 cursor-pointer" size={25} />
            </Link>
            <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Problem Description
              </h2>
              <p className="text-gray-700 mb-4">{problem.description}</p>
              <div className="mb-4">
                <h3 className="font-semibold">Difficulty:</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                {problem.examples.map((example, index) => (
                  <div key={index} className="mt-2">
                    <h4 className="font-medium">Example {index + 1}:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                      Input: {example.input}
                      <br />
                      Output: {example.output}
                      <br />
                      <span>Explanation: {example.explanation}</span>
                    </pre>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Constraints:</h3>
                <ul className="list-disc list-inside">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-700 bg-gray-100 p-2">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Code Editor</h2>
                  <select
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(LANGUAGES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Editor
                  height="500px"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                  }}
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-300"
                    disabled={!isAllTestsPassed} // Disable button unless all tests pass
                    onClick={handleSubmit}
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
              {output && (
                <div className="mb-4 bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2">Test Results</h3>
                  <div className="space-y-2">
                    {output.map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          result.passed ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <p>
                          <strong>Input:</strong> {JSON.stringify(result.input)}
                        </p>
                        <p>
                          <strong>Expected Output:</strong>{" "}
                          {JSON.stringify(result.expectedOutput)}
                        </p>
                        <p>
                          <strong>Your Output:</strong>{" "}
                          {result.error
                            ? `Error: ${result.error}`
                            : JSON.stringify(result.output)}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {result.passed ? "Passed" : "Failed"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
