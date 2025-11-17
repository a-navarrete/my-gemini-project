import fs from 'fs';
import path from 'path';

const MAX_HISTORY_PAIRS = 20;
const SESSION_STORE_PATH = process.env.CHATBOT_SESSION_FILE || path.resolve(process.cwd(), '.data/chatbotSessions.json');

let persistenceEnabled = process.env.NODE_ENV !== 'test';
let sessionState = { sessions: {} };

const ensureDirectory = () => {
  const dir = path.dirname(SESSION_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadFromDisk = () => {
  if (!persistenceEnabled) {
    return;
  }

  try {
    if (fs.existsSync(SESSION_STORE_PATH)) {
      const file = fs.readFileSync(SESSION_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(file || '{}');
      if (parsed && typeof parsed === 'object' && parsed.sessions) {
        sessionState = {
          sessions: parsed.sessions,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load chatbot session store.', error);
  }
};

const saveToDisk = () => {
  if (!persistenceEnabled) {
    return;
  }

  try {
    ensureDirectory();
    fs.writeFileSync(
      SESSION_STORE_PATH,
      JSON.stringify(sessionState, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to persist chatbot session store.', error);
  }
};

loadFromDisk();

export const enableSessionPersistence = () => {
  persistenceEnabled = true;
  loadFromDisk();
};

export const disableSessionPersistence = () => {
  persistenceEnabled = false;
};

export const getSessionHistory = (sessionId) => {
  if (!sessionId) {
    return [];
  }
  return sessionState.sessions[sessionId] || [];
};

export const updateSessionHistory = (sessionId, userMessage, botReply) => {
  if (!sessionId) {
    return [];
  }

  const history = getSessionHistory(sessionId);
  const updated = [...history, { role: 'user', text: userMessage }, { role: 'bot', text: botReply }];
  const trimmed = updated.slice(-MAX_HISTORY_PAIRS * 2);
  sessionState.sessions[sessionId] = trimmed;
  saveToDisk();
  return trimmed;
};

export const resetSessionStore = () => {
  sessionState = { sessions: {} };
  saveToDisk();
};

export const getSessionStoreSnapshot = () => JSON.parse(JSON.stringify(sessionState));

export { MAX_HISTORY_PAIRS };

export default {
  getSessionHistory,
  updateSessionHistory,
  resetSessionStore,
  enableSessionPersistence,
  disableSessionPersistence,
};
