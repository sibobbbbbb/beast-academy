#!/usr/bin/env node

// Using ES modules
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

// Get the directory name of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate path to project root (one level up from scripts directory)
const projectRoot = resolve(__dirname, '..');

// Optionally load package.json for version info or other configuration
let packageInfo = {};
try {
  const packageJsonPath = resolve(projectRoot, 'package.json');
  packageInfo = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
} catch (err) {
  // Silent fail if package.json can't be read
}

// Check if a string argument was provided
if (process.argv.length < 3) {
  console.error('Usage: node scripts/hash-util.js "textToHash"');
  process.exit(1);
}

const textToHash = process.argv[2];

// You can override the salt rounds with an environment variable
const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10;

// Hash the string
try {
  const hash = await bcrypt.hash(textToHash, saltRounds);
  console.log('Input:', textToHash);
  console.log('Hashed:', hash);
  console.log('Salt Rounds Used:', saltRounds);
} catch (err) {
  console.error('Error hashing string:', err);
  process.exit(1);
}