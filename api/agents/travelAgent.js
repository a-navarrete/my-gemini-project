import { spawn } from 'child_process';
import path from 'path';

const DEFAULT_TIMEOUT_MS = parseInt(process.env.CHATBOT_AGENT_TIMEOUT_MS || '120000', 10);
const DEFAULT_PYTHON_MODULE = process.env.CHATBOT_PYTHON_MODULE || 'api.crewai_agents.chatbot_crew';
const DEFAULT_PYTHON_BIN =
  process.env.CHATBOT_PYTHON_BIN || path.resolve(process.cwd(), 'venv_crewai_ssl/bin/python3');
const DEFAULT_FALLBACK_STRATEGY = String(process.env.CHATBOT_AGENT_FALLBACK || 'mock').toLowerCase();

class TravelAgent {
  constructor(options = {}) {
    this.pythonExecutable = options.pythonExecutable || DEFAULT_PYTHON_BIN;
    this.pythonModule = options.pythonModule || DEFAULT_PYTHON_MODULE;
    this.timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
    this.cwd = options.cwd || process.cwd();
    this.env = options.env || {};
    const fallbackStrategy =
      options.fallbackStrategy ?? process.env.CHATBOT_AGENT_FALLBACK ?? DEFAULT_FALLBACK_STRATEGY;
    this.fallbackStrategy = String(fallbackStrategy || 'mock').toLowerCase();
  }

  isFallbackToMockEnabled() {
    return this.fallbackStrategy === 'mock';
  }

  normalizePayload(payload) {
    if (typeof payload === 'string') {
      return { message: payload, history: [] };
    }

    return {
      message: payload?.message || '',
      history: Array.isArray(payload?.history) ? payload.history : [],
    };
  }

  shouldMock() {
    return process.env.CHATBOT_AGENT_MODE === 'mock';
  }

  buildMockResponse({ message }) {
    const trimmed = (message || '').trim();
    if (!trimmed) {
      return { reply: 'How can I assist with your travel plans today?' };
    }
    return {
      reply: `I have logged your request: "${trimmed}". Let me gather the best travel options for you.`,
    };
  }

  parsePythonResponse(rawOutput = '') {
    const trimmed = rawOutput.toString().trim();
    if (!trimmed) {
      return { reply: '' };
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'string') {
        return { reply: parsed };
      }
      if (!parsed.reply && parsed.text) {
        return { ...parsed, reply: parsed.text };
      }
      return parsed;
    } catch (_error) {
      return { reply: trimmed };
    }
  }

  spawnPythonProcess(payload) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonExecutable, ['-u', '-m', this.pythonModule], {
        cwd: this.cwd,
        env: {
          ...process.env,
          ...this.env,
        },
      });

      let stdout = '';
      let stderr = '';
      let settled = false;
      let timeoutId = null;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      const resolveOnce = (value) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        resolve(value);
      };

      const rejectOnce = (error) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(error);
      };

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('error', (error) => {
        rejectOnce({ error: 'Unable to start chatbot agent.', details: error.message });
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          rejectOnce({
            error: 'Failed to execute chatbot crew.',
            details: stderr || `Python process exited with code ${code}`,
          });
          return;
        }
        resolveOnce(this.parsePythonResponse(stdout));
      });

      if (this.timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          pythonProcess.kill('SIGTERM');
          rejectOnce({
            error: 'Chatbot agent timed out.',
            details: `Process exceeded ${this.timeoutMs}ms timeout.`,
          });
        }, this.timeoutMs);
      }

      try {
        pythonProcess.stdin.write(JSON.stringify(payload));
        pythonProcess.stdin.end();
      } catch (error) {
        rejectOnce({ error: 'Failed to send payload to chatbot agent.', details: error.message });
      }
    });
  }

  async execute(payload) {
    const normalizedPayload = this.normalizePayload(payload);

    if (this.shouldMock()) {
      return this.buildMockResponse(normalizedPayload);
    }

    try {
      return await this.spawnPythonProcess(normalizedPayload);
    } catch (error) {
      if (this.isFallbackToMockEnabled()) {
        console.warn('Chatbot agent failed; using mock response fallback.', error);
        return this.buildMockResponse(normalizedPayload);
      }
      throw error;
    }
  }
}

export default new TravelAgent();
