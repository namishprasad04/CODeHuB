/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchProblem, submitCode } from "../services/api";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import CodeExecution from "../components/CodeExecutio";

// Supported languages with their Judge0 IDs
const languageOptions = [
  { value: "javascript", label: "JavaScript", id: 63 },
  { value: "python", label: "Python", id: 71 },
  { value: "java", label: "Java", id: 62 },
  { value: "cpp", label: "C++", id: 53 },
];

export default function ProblemDetails() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const loadProblem = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProblem(id);
        setProblem(data);
        setCode(data.initialCode[language]);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setOutput("Error: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProblem();
  }, [id, language]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(problem.initialCode[newLanguage]);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSubmit = async () => {
    if (status !== "Accepted") {
      alert("Code not accepted, you cannot submit.");
      return;
    }

    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      // Pass userId to the submitCode function
      const result = await submitCode(userId, status);
      alert(result.message);
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit code");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{problem.name}</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            <ProblemDescription problem={problem} />
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <CodeEditor
                language={language}
                code={code}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                languageOptions={languageOptions}
              />
              <CodeExecution
                code={code}
                language={language}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                output={output}
                setOutput={setOutput}
                setStatus={setStatus}
                onSubmit={handleSubmit}
                status={status}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
