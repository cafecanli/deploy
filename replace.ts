import { Glob } from 'bun';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const logger = console;

async function glob(pattern: string) {
  const files: string[] = [];

  pattern = resolve(pattern);

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
    process.exit(1);
  }

  return result as string[];
}

async function replaceFile(file: string) {
  const [, match, flags, replace] = config();
  const regex = new RegExp(match, flags);

  const content = await readFile(file, 'utf-8');
  const replaced = content.replace(regex, replace);

  await writeFile(file, replaced, { encoding: 'utf-8' });
}

async function main() {
  const [pattern] = config();
  const files = await glob(pattern);
  const results = await Promise.allSettled(
    files.map(async (file) => {
      return replaceFile(file);
    }),
  );

  if (results.every((item) => item.status === 'fulfilled')) {
    return;
  }

  logger.error('Some files failed to replace');
  process.exit(1);
}

void main();
