import express from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

router.post('/orchestrate', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const pythonExecutable = path.resolve(process.cwd(), 'venv_crewai_ssl/bin/python3');
    const pythonProcess = spawn(
        pythonExecutable,
        ['-u', '-m', 'api.crewai_agents.main'],
        {
            env: {
                ...process.env,
                CREWAI_USE_MOCKS: process.env.CREWAI_USE_MOCKS ?? 'false',
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
            return res.status(500).json({ error: 'Failed to execute CrewAI task.', details: errorToSend });
        }
        try {
            const jsonResult = JSON.parse(dataToSend);
            res.json(jsonResult);
        } catch (e) {
            console.error('Failed to parse python script output as JSON');
            console.error(dataToSend);
            res.status(500).json({ error: 'Failed to parse CrewAI task output.', details: dataToSend });
        }
    });

    pythonProcess.stdin.write(query);
    pythonProcess.stdin.end();
});

export default router;
