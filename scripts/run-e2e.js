#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const workspaceCacheDir = path.resolve(process.cwd(), '.cypress-cache');

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });

const startServer = () =>
  new Promise((resolve, reject) => {
    const serverEnv = {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV && process.env.NODE_ENV !== 'test' ? process.env.NODE_ENV : 'e2e',
    };
    const serverProcess = spawn(npmCmd, ['start'], {
      env: serverEnv,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let settled = false;
    const readyRegex = /(Server is running|Server started and listening!)/i;

    const handleReady = (data) => {
      const text = data.toString();
      process.stdout.write(`[server] ${text}`);
      if (!settled && readyRegex.test(text)) {
        settled = true;
        clearTimeout(timeout);
        resolve(serverProcess);
      }
    };

    const handleErrorOutput = (data) => {
      process.stderr.write(`[server] ${data}`);
    };

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        serverProcess.kill('SIGTERM');
        reject(new Error('Server did not start within 60 seconds'));
      }
    }, 60000);

    serverProcess.stdout.on('data', handleReady);
    serverProcess.stderr.on('data', handleErrorOutput);

    serverProcess.on('error', (error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(error);
      }
    });

    serverProcess.on('close', (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Server process exited early with code ${code}`));
      }
    });
  });

const stopServer = (serverProcess) =>
  new Promise((resolve) => {
    if (!serverProcess || serverProcess.killed) {
      resolve();
      return;
    }
    serverProcess.once('close', () => resolve());
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  });

async function main() {
  try {
    await runCommand(npmCmd, ['run', 'build:web']);
    const serverProcess = await startServer();
    try {
      await runCommand(npxCmd, ['cypress', 'run'], {
        env: {
          ...process.env,
          CYPRESS_CACHE_FOLDER: workspaceCacheDir,
        },
      });
    } finally {
      await stopServer(serverProcess);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
