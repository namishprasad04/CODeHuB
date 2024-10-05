import { executeCode } from "../services/codeExecutionService.js";
import Problem from "../models/problem.model.js";

export const runCode = async (req, res) => {
  const { code, language, input } = req.body;
  try {
    const output = await executeCode(code, language, input);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const runTestCases = async (req, res) => {
  const { code, language } = req.body;
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  try {
    const results = await Promise.all(problem.testCases.map(async (testCase, index) => {
      console.log(testCase)
      const input = `${testCase.input}`; 
      const output = await executeCode(code, language, input);
      const expectedOutput = JSON.stringify(testCase.output);
      const passed = output.trim() === expectedOutput;
      return {
        testCase: index + 1,
        passed,
        input: `${testCase.input}, ${testCase.target}`,
        output: output.trim(),
        expected: expectedOutput
      };
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
export const submitSolution = async (req, res) => {
  const { code, language } = req.body;
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  try {
    const results = await Promise.all(problem.testCases.map(async (testCase, index) => {
      const output = await executeCode(code, language, testCase.input);
      const passed = output.trim() === testCase.output;
      return { testCase: index + 1, passed };
    }));
    const allPassed = results.every(result => result.passed);
    res.json({ success: allPassed, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};