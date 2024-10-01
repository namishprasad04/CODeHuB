import React from "react";
import { FaCheck, FaPlay, FaStopCircle } from "react-icons/fa";

const languageOptions = [
  { value: "javascript", label: "JavaScript", id: 63 },
  { value: "python", label: "Python", id: 71 },
  { value: "java", label: "Java", id: 62 },
  { value: "cpp", label: "C++", id: 53 },
];

export default function CodeExecution({
  code,
  language,
  isRunning,
  setIsRunning,
  output,
  setOutput,
  setStatus,
  onSubmit,
  status,
}) {
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

      setStatus(status.description);
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

  return (
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
        <button
          onClick={onSubmit}
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
  );
}
