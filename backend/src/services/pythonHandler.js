import { spawn } from 'child_process';

class PythonHandler {
  constructor() {
    this.pythonProcess = null;
    this.initPythonProcess();
  }

  initPythonProcess() {
    this.pythonProcess = spawn('python', ['-i', '-u', '-q']);
    this.pythonProcess.stdout.on('data', (data) => {
      // Handle Python output if needed
    });
    this.pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
  }

  runCode(code, input) {
    return new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => {
        reject(new Error('Execution timed out'));
      }, 5000); // 5 second timeout

      this.pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      this.pythonProcess.stdin.write(code + '\n');
      this.pythonProcess.stdin.write(`print(${JSON.stringify(input)})\n`);
      this.pythonProcess.stdin.write('print("__END__")\n');

      const checkOutput = () => {
        if (output.includes('__END__')) {
          clearTimeout(timeout);
          resolve(output.split('__END__')[0].trim());
        } else {
          setTimeout(checkOutput, 100);
        }
      };

      checkOutput();
    });
  }
}

export const pythonHandler = new PythonHandler();