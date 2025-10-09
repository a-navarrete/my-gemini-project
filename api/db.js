import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'api', 'db.json');

export async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { bookings: [] };
    }
    throw error;
  }
}

export async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
