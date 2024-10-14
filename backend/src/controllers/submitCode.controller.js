import { VM } from "vm2";
import Problem from "../models/problem.model.js";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export const runCode = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }

    const { code, language } = req.body;
    const results = [];

    for (const testCase of problem.testCases) {
      const input = JSON.parse(testCase.input);
      const expectedOutput = JSON.parse(testCase.output);

      try {
        let output;
        if (language === "javascript") {
          output = await executeJavaScript(code, input);
        } else {
          output = await executeWithPiston(code, language, input);
        }

        const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);
        results.push({ input, expectedOutput, output, passed });
      } catch (error) {
        results.push({
          input,
          expectedOutput,
          error: error.message,
          passed: false,
        });
      }
    }

    res.json({ results });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

async function executeJavaScript(code, input) {
  const vm = new VM({
    timeout: 3000,
    sandbox: {},
  });

  const wrappedCode = `
    (function() {
      ${code}
      return function(input) {
        return solution(input);
      };
    })()
  `;

  try {
    const userFunction = vm.run(wrappedCode);
    return userFunction(input);
  } catch (error) {
    throw new Error(`JavaScript execution error: ${error.message}`);
  }
}

async function executeWithPiston(code, language, input) {
  let fullCode;
  if (language === "python") {
    const userCode = code.split('\n').map(line => `    ${line}`).join('\n');
    
    fullCode = `
import json
import sys

def execute_user_code():
${userCode}
    return solution

try:
    solution_func = execute_user_code()
    input_data = json.loads(input())
    result = solution_func(input_data)
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
`;
  } else {
    fullCode = code;
  }

  const pistonLanguages = {
    javascript: "javascript",
    python: "python",
  };

  try {
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLanguages[language],
        version: "*",
        files: [
          {
            name: "main",
            content: fullCode,
          },
        ],
        stdin: JSON.stringify(input),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.run.stdout) {
      try {
        const parsedOutput = JSON.parse(result.run.stdout);
        if (parsedOutput.error) {
          throw new Error(parsedOutput.error);
        }
        return parsedOutput;
      } catch (parseError) {
        return result.run.stdout.trim();
      }
    } else if (result.run.stderr) {
      throw new Error(`Execution error: ${result.run.stderr}`);
    } else {
      throw new Error("No output from code execution");
    }
  } catch (error) {
    console.error("Error in executeWithPiston:", error);
    throw error;
  }
}