import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaPlay, FaStopCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

const randomProblem = {
  name: "Reverse String Deluxe",
  description:
    "Given a string, reverse it while maintaining the position of special characters. For example, 'ab-cd' should become 'dc-ba'.",
  difficulty: "Medium",
  example: `Input: "a-bC-dEf-ghIj"
Output: "j-Ih-gfE-dCba"

Input: "Test1ng-Leet=code-Q!"
Output: "Qedo1ct-eeLg=ntse-T!"`,
};

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const initialCode = {
  javascript: `function reverseStringDeluxe(s) {
  // Your code here
  return s;
}

// Test your function
console.log(reverseStringDeluxe("a-bC-dEf-ghIj"));
console.log(reverseStringDeluxe("Test1ng-Leet=code-Q!"));`,
  python: `def reverse_string_deluxe(s):
    # Your code here
    return s

# Test your function
print(reverse_string_deluxe("a-bC-dEf-ghIj"))
print(reverse_string_deluxe("Test1ng-Leet=code-Q!"))`,
  java: `public class Solution {
    public static String reverseStringDeluxe(String s) {
        // Your code here
        return s;
    }

    public static void main(String[] args) {
        System.out.println(reverseStringDeluxe("a-bC-dEf-ghIj"));
        System.out.println(reverseStringDeluxe("Test1ng-Leet=code-Q!"));
    }
}`,
  cpp: `#include <iostream>
#include <string>

using namespace std;

string reverseStringDeluxe(string s) {
    // Your code here
    return s;
}

int main() {
    cout << reverseStringDeluxe("a-bC-dEf-ghIj") << endl;
    cout << reverseStringDeluxe("Test1ng-Leet=code-Q!") << endl;
    return 0;
}`,
};

export default function Component() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(initialCode[language]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(initialCode[newLanguage]);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulating code execution
    setTimeout(() => {
      setOutput(`Output:
j-Ih-gfE-dCba
Qedo1ct-eeLg=ntse-T!

Execution time: 0.005s
Memory used: 5.2 MB`);
      setIsRunning(false);
    }, 2000);
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setOutput("Code execution stopped.");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{randomProblem.name}</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Problem Details */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Problem Description
              </h2>
              <p className="text-gray-700 mb-4">{randomProblem.description}</p>
              <div className="mb-4">
                <h3 className="font-semibold">Difficulty:</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      randomProblem.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : randomProblem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {randomProblem.difficulty}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Example:</h3>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm whitespace-pre-wrap">
                  {randomProblem.example}
                </pre>
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
