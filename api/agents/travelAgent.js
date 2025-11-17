import { spawn } from 'child_process';
import path from 'path';

class TravelAgent {
  async execute(payload) {
    const normalizedPayload =
      typeof payload === 'string'
        ? { message: payload, history: [] }
        : {
            message: payload?.message || '',
            history: Array.isArray(payload?.history) ? payload.history : [],
          };

    return new Promise((resolve, reject) => {
      const pythonExecutable = path.resolve(process.cwd(), 'venv_crewai_ssl/bin/python3');
      const pythonProcess = spawn(
        pythonExecutable,
        ['-u', path.resolve(process.cwd(), 'api/crewai_agents/chatbot_crew.py')],
        {
            env: {
                ...process.env,
            },
        }
      );

      let dataToSend = '';
      pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
      });

      let errorToSend = '';
      pythonProcess.stderr.on('data', (data) => {
        errorToSend += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error(errorToSend);
          reject({ error: 'Failed to execute chatbot crew.', details: errorToSend });
        }
        resolve({ reply: dataToSend });
      });

      pythonProcess.stdin.write(JSON.stringify(normalizedPayload));
      pythonProcess.stdin.end();
    });
  }
}

export default new TravelAgent();
