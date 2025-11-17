const MAX_HISTORY_PAIRS = parseInt(process.env.CHATBOT_SESSION_MAX_PAIRS || '20', 10);
const REDIS_TTL_SECONDS = parseInt(process.env.CHATBOT_SESSION_TTL_SECONDS || '172800', 10); // default 2 days
const SESSION_KEY_PREFIX = process.env.CHATBOT_SESSION_KEY_PREFIX || 'chatbot:session:';
const redisUrl = process.env.CHATBOT_REDIS_URL || process.env.REDIS_URL;

let forcedMode = process.env.CHATBOT_SESSION_MODE || null;
const memoryStore = new Map();

let redisClientPromise = null;
let redisClient = null;

const shouldUseRedis = () => {
  if (forcedMode) {
    return forcedMode === 'redis';
  }
  return Boolean(redisUrl);
};

const teardownRedisClient = async () => {
  if (redisClient) {
    try {
      await redisClient.quit?.();
    } catch (error) {
      console.error('Failed to close Redis client', error);
    }
  }
  redisClient = null;
  redisClientPromise = null;
};

const getRedisClient = async () => {
  if (!shouldUseRedis()) {
    await teardownRedisClient();
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  if (!redisClientPromise) {
    redisClientPromise = (async () => {
      try {
        const { createClient } = await import('redis');
        const client = createClient({ url: redisUrl });
        client.on('error', (error) => {
          console.error('Redis client error', error);
        });
        await client.connect();
        redisClient = client;
        return client;
      } catch (error) {
        console.error('Unable to initialize Redis client. Falling back to in-memory store.', error);
        forcedMode = 'memory';
        redisClientPromise = null;
        return null;
      }
    })();
  }

  const client = await redisClientPromise;
  if (!client) {
    await teardownRedisClient();
  }
  return client;
};

const buildRedisKey = (sessionId) => `${SESSION_KEY_PREFIX}${sessionId}`;

const parseHistoryEntries = (entries = []) =>
  entries
    .map((entry) => {
      try {
        return JSON.parse(entry);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);

const persistToMemory = (sessionId, records) => {
  const trimmed = records.slice(-MAX_HISTORY_PAIRS * 2);
  memoryStore.set(sessionId, trimmed);
  return trimmed;
};

export const setSessionStoreMode = (mode) => {
  forcedMode = mode;
  if (mode === 'memory') {
    teardownRedisClient();
  }
};

export const getSessionHistory = async (sessionId) => {
  if (!sessionId) {
    return [];
  }

  const client = await getRedisClient();
  if (!client) {
    return memoryStore.get(sessionId) || [];
  }

  const key = buildRedisKey(sessionId);
  const data = await client.lRange(key, 0, -1);
  return parseHistoryEntries(data);
};

export const updateSessionHistory = async (sessionId, userMessage, botReply) => {
  if (!sessionId) {
    return [];
  }

  const userEntry = { role: 'user', text: userMessage };
  const botEntry = { role: 'bot', text: botReply };

  const client = await getRedisClient();
  if (!client) {
    const history = memoryStore.get(sessionId) || [];
    return persistToMemory(sessionId, [...history, userEntry, botEntry]);
  }

  const key = buildRedisKey(sessionId);
  await client.rPush(key, JSON.stringify(userEntry), JSON.stringify(botEntry));
  await client.lTrim(key, -MAX_HISTORY_PAIRS * 2, -1);
  if (REDIS_TTL_SECONDS > 0) {
    await client.expire(key, REDIS_TTL_SECONDS);
  }

  const entries = await client.lRange(key, 0, -1);
  return parseHistoryEntries(entries);
};

const deleteRedisSessions = async (client) => {
  const pattern = `${SESSION_KEY_PREFIX}*`;
  if (client.scanIterator) {
    // redis v4 iterator
    for await (const key of client.scanIterator({ MATCH: pattern })) {
      await client.del(key);
    }
  } else {
    // fallback scan loop
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, { MATCH: pattern });
      cursor = nextCursor;
      if (keys?.length) {
        await client.del(...keys);
      }
    } while (cursor !== '0');
  }
};

export const resetSessionStore = async () => {
  memoryStore.clear();
  const client = await getRedisClient();
  if (client) {
    await deleteRedisSessions(client);
  }
};

export const closeSessionStore = async () => {
  await teardownRedisClient();
};

export const getSessionStoreSnapshot = () => ({
  memory: Array.from(memoryStore.entries()),
  mode: shouldUseRedis() ? 'redis' : 'memory',
});

export { MAX_HISTORY_PAIRS };

export default {
  getSessionHistory,
  updateSessionHistory,
  resetSessionStore,
  closeSessionStore,
  setSessionStoreMode,
};
