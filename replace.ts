import { Glob } from 'bun';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const logger = console;

function die(message: string) {
  logger.error(message);
  process.exit(1);
}

async function glob(pattern: string) {
  const files: string[] = [];

  pattern = resolve(__dirname, pattern);

  for await (const file of new Glob(pattern).scan()) {
    files.push(file);
  }

  return files;
}

function config() {
  let invalid = false;

  const fields = ['GLOB', 'MATCH', 'FLAGS', 'REPLACE'];
  const result = fields.map((field) => {
    const value = process.env[field];

    if (field == null || field === '') {
      invalid = true;
      logger.error(
        `Environment variable "${field}" is required (value: ${value})`,
      );
    }

    return value;
  });

  if (invalid) {
    die("Some environment variables are missing or empty, can't continue");
  }

  return result as string[];
}

async function replaceFile(file: string) {
  const rel = resolve(file).replace(resolve(__dirname), '.');
  const log = (level: string, message: string) =>
    logger[level](`[${rel}] ${message}`);

  const info = (message: string) => log('info', message);
  const error = (message: string) => {
    log('error', message);
    throw new Error(message);
  };

  info(`Starting...`);

  const [, match, flags, replace] = config();
  const regex = new RegExp(match, flags);

  info(`Reading file contents...`);

  const content = await readFile(file, 'utf-8');

  info(`File contents read (${content.length}B)`);
  info(`Replacing "${regex}" with "${replace}"...`);

  const matches = content.match(regex);

  if (!matches) {
    // This throw won't be effective since
    // we already throw an error in the error function,
    // but it's necessary to suppress the compiler warning
    throw error(`No matches found in file "${file}"`);
  }

  info(`Found ${matches.length} matches...`);

  const replaced = content.replace(regex, replace);

  info(`Replaced ${matches.length} occurrences`);

  info(`Writing to file...`);

  await writeFile(file, replaced, { encoding: 'utf-8' });

  info(`File written`);
}

async function main() {
  const [pattern] = config();
  const files = await glob(pattern);

  if (!files.length) {
    die(`There are no files matching with "${pattern}" in this repository`);
  }

  const results = await Promise.allSettled(
    files.map(async (file) => {
      return replaceFile(file);
    }),
  );

  if (results.every((item) => item.status === 'fulfilled')) {
    return;
  }

  die('Some files failed to replace');
}

void main();
