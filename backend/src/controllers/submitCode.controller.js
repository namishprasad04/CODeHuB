import { VM } from "vm2";
import Problem from "../models/problem.model.js";

export const runCode = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }

    const { code } = req.body;
    const vm = new VM({
      timeout: 3000,
      sandbox: {},
    });

    const results = [];

    for (const testCase of problem.testCases) {
      const input = JSON.parse(testCase.input);
      const expectedOutput = JSON.parse(testCase.output);

      try {
        const userFunction = vm.run(`
          (function() {
            ${code}
            return solution;
          })()
        `);
        const output = userFunction(...input);
        const passed =
          JSON.stringify(output) === JSON.stringify(expectedOutput);
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
