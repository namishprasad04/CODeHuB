import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { FaCheck, FaPlay, FaStopCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

// Supported languages with their Judge0 IDs
const languageOptions = [
  { value: "javascript", label: "JavaScript", id: 63 },
  { value: "python", label: "Python", id: 71 },
  { value: "java", label: "Java", id: 62 },
  { value: "cpp", label: "C++", id: 53 },
];

export default function ProblemDetails() {
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null); // Track code status
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${id}`);
      if (!response.ok) {
        throw new Error("Problem not found");
      }
      const data = await response.json();
      setProblem(data);
      setCode(data.initialCode[language]);
    } catch (error) {
      console.error("Error fetching problem:", error);
      setOutput("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(problem.initialCode[newLanguage]);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    const selectedLanguage = languageOptions.find(
      (option) => option.value === language
    );

    const submissionData = {
      source_code: code,
      language_id: selectedLanguage.id,
      stdin: "",
    };

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":
              "914531cba4msh7313f2f29b2ac1ap1e897fjsnf6c78903aa7e",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const result = await response.json();
      const { stdout, stderr, compile_output, status } = result;

      if (stdout) {
        setOutput(`Output:\n${stdout}`);
      } else if (stderr) {
        setOutput(`Error:\n${stderr}`);
      } else if (compile_output) {
        setOutput(`Compilation Error:\n${compile_output}`);
      } else {
        setOutput(`Status: ${status.description}`);
      }

      setStatus(status.description); // Update status based on the result
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setOutput("Code execution stopped.");
  };

  const handleSubmit = () => {
    // Only submit if status is 'Accepted'
    if (status === "Accepted") {
      alert("Submission successful! You've earned 100 points!");
      navigate(-1); // Navigate back to the previous page
    } else {
      alert("Submission failed. Code must be accepted before submitting.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{problem.name}</h1>
          <div className="flex flex-col lg:flex-row gap-6">
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
  
            {/* Code Editor and Execution */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Code Editor</h2>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
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
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                  }}
                />
              </div>
  
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Code Execution</h2>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className={`flex items-center px-4 py-2 rounded ${
                      isRunning
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  >
                    <FaPlay className="mr-2" />
                    Run Code
                  </button>
                  <button
                    onClick={handleStopExecution}
                    disabled={!isRunning}
                    className={`flex items-center px-4 py-2 rounded ${
                      !isRunning
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    <FaStopCircle className="mr-2" />
                    Stop Execution
                  </button>
                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={status !== "Accepted"}
                    className={`flex items-center px-4 py-2 rounded ${
                      status === "Accepted"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <FaCheck className="mr-2" />
                    Submit
                  </button>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2">Output:</h3>
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}
