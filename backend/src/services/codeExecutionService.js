import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import { pythonHandler } from './pythonHandler.js';

export const executeCode = async (code, language, input = '') => {
  switch (language) {
    case 'javascript':
      return executeJavaScript(code, input);
    case 'python':
      return executePython(code, input);
    case 'java':
      return executeJava(code, input);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

const executeJavaScript = (code, input) => {
  const context = {
    input: input,
    output: '',
    console: {
      log: (...args) => {
        context.output += args.join(' ') + '\n';
      }
    }
  };

  try {
    vm.runInNewContext(code, context);
    return context.output;
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
};

const executePython = async (code, input) => {
  try {
    const result = await pythonHandler.runCode(code, input);
    return result;
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
};

const executeJava = async (code, input) => {
  const className = 'Solution';
  const fullCode = `
public class ${className} {
    public static void main(String[] args) {
        ${code}
    }
}`;
  
  const filename = `${className}.java`;
  try {
    await fs.writeFile(filename, fullCode);
    await new Promise((resolve, reject) => {
      exec(`javac ${filename}`, (error) => {
        if (error) reject(new Error(`Compilation error: ${error.message}`));
        else resolve();
      });
    });
    
    const output = await new Promise((resolve, reject) => {
      exec(`java ${className}`, { input }, (error, stdout, stderr) => {
        if (error) reject(new Error(`Execution error: ${error.message}`));
        else if (stderr) reject(new Error(`Error: ${stderr}`));
        else resolve(stdout);
      });
    });
    
    return output;
  } finally {
    // Clean up
    await Promise.all([
      fs.unlink(filename).catch(() => {}),
      fs.unlink(`${className}.class`).catch(() => {})
    ]);
  }
};