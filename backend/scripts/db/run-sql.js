import { Client } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSQLFiles() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const sqlFiles = [
      '02_triggers.sql',
      '03_placeholders.sql',
    ];

    const sqlDir = path.join(__dirname, '../../db/init');

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      console.log(`Executing ${file}...`);
      await client.query(sql);
    }

    console.log('All SQL files executed successfully.');
  } catch (err) {
    console.error('Error executing SQL files:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSQLFiles();