/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Function to fetch problem details from the server using fetch
  const fetchProblem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/problems/${id}`);
      if (!response.ok) throw new Error("Failed to fetch problem details.");
      const data = await response.json();
      setProblem(data);
      setCode(getInitialCode(data, language)); // Initialize code editor
    } catch (err) {
      setError("Failed to load problem details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id, language]);

  // Function to initialize code based on language
  const getInitialCode = (problem, lang) => {
    const templates = {
      javascript: "// Write your JavaScript solution here",
      python: "# Write your Python solution here",
      java: "// Write your Java solution here",
    };
    return templates[lang] || "";
  };

  const onLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(getInitialCode(problem, newLanguage)); // Update code when language changes
  };

  const runCode = async () => {
    const loadingToast = toast.loading("Running code...");
    try {
      const response = await fetch("http://localhost:5000/api/code/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, input: customInput }),
      });
      const result = await response.json();
      setOutput(result.output);
      toast.success("Code executed successfully", { id: loadingToast });
    } catch (error) {
      setOutput("Error running code: " + error.message);
      toast.error("Error running code", { id: loadingToast });
    }
  };

  const runTestCases = async () => {
    const loadingToast = toast.loading("Running test cases...");
    try {
      const response = await fetch(
        `http://localhost:5000/api/code/test/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language }),
        }
      );
      const result = await response.json();
      
      console.log("Test cases result:", result); // Log the result for debugging
  
      if (!Array.isArray(result)) {
        throw new Error("Unexpected response format from server");
      }
  
      const allPassed = result.every(testCase => testCase.passed);
      setAllTestsPassed(allPassed);
      
      if (allPassed) {
        setOutput("All test cases passed successfully!");
        toast.success("All test cases passed!", { id: loadingToast });
      } else {
        const failedTests = result.filter(testCase => !testCase.passed).length;
        const resultOutput = result.map(testCase => 
          `Test Case ${testCase.testCase}: ${testCase.passed ? 'Passed' : 'Failed'}\n` +
          `Input: ${testCase.input}\n` +
          `Your Output: ${testCase.output}\n` +
          `Expected Output: ${testCase.expected}\n`
        ).join('\n');
        setOutput(`${failedTests} test case(s) failed. Please check your code and try again.\n\n${resultOutput}`);
        toast.error(`${failedTests} test case(s) failed`, { id: loadingToast });
      }
    } catch (error) {
      console.error("Error in runTestCases:", error);
      setOutput(`Error running test cases: ${error.message}`);
      toast.error("Error running test cases", { id: loadingToast });
    }
  };

  const submitSolution = async () => {
    const loadingToast = toast.loading("Submitting solution...");
    try {
      const response = await fetch(
        `http://localhost:5000/api/code/submit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setOutput("Congratulations! Your solution has been accepted.");
        toast.success("Solution accepted!", { id: loadingToast });
      } else {
        setOutput(
          "Your solution did not pass all test cases. Please try again."
        );
        toast.error("Solution not accepted", { id: loadingToast });
      }
    } catch (error) {
      setOutput("Error submitting solution: " + error.message);
      toast.error("Error submitting solution", { id: loadingToast });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!problem) return <div>Problem not found</div>;

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{problem.name}</h1>
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

              {/* Examples */}
              <div className="mb-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="mt-2">
                    <h4 className="font-medium">Example {index + 1}:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                      Input: {example.input}
                      <br />
                      Output: {example.output}
                      <br />
                      {example.explanation && (
                        <span>Explanation: {example.explanation}</span>
                      )}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Constraints */}
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

            {/* Code Editor */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Code Editor</h2>
                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Editor
                  height="400px"
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
                <h3 className="text-lg font-semibold mb-4">Custom Input</h3>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your custom input here..."
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={runCode}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Run Code
                  </button>
                  <button
                    onClick={runTestCases}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Run Test Cases
                  </button>
                  <button
                    onClick={submitSolution}
                    disabled={!allTestsPassed}
                    className={`px-4 py-2 text-white rounded-md ${
                      allTestsPassed
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Output</h3>
                <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
                  {output || "No output yet. Run your code to see results."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
