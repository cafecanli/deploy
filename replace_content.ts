import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const logger = console;
const template =
  /(?<=__branch_name__:\s+imageTag: (["'`]))(?:\\\\|\\\1|(?!\1).)+(?=\1)/
    .source;

function escape(input: string): string {
  return input.replace(/[-{}[\]\\]/g, (char) => `\\${char}`);
}

async function main(): Promise<void> {
  const file = process.env.FLEET_VALUES_PATH?.trim();
  const sha = process.env.COMMIT_SHA?.trim();

  let repo = process.env.REPOSITORY_NAME?.trim();

  if (!file) {
    throw new Error('FLEET_VALUES_PATH is required to replace the content');
  }

  if (!repo) {
    throw new Error('REPOSITORY_NAME is required to replace the content');
  }

  if (!sha) {
    throw new Error('COMMIT_SHA is required to replace the content');
  }

  if (repo.includes('/')) {
    logger.warn('Omitting the owner from the repository name');
    [, repo] = repo.split('/');
  }

  const path = resolve(process.cwd(), String(file).trim());
  const pattern = template.replace('__branch_name__', escape(repo));
  const regex = new RegExp(pattern, 'g');

  if (!existsSync(path)) {
    throw new Error(`File "${path}" not found`);
  }

  const content = await readFile(path, 'utf-8');

  let count = 0;
  let updated = content;

  while (regex.test(updated)) {
    updated = updated.replace(regex, sha);
    count++;
  }

  if (!count) {
    throw new Error(`No match found for ${pattern}`);
  }

  logger.log(`Replaced ${count} occurrences of ${pattern} with ${sha}`);
  logger.log(`Writing output to "${path}"`);

  await writeFile(path, updated, 'utf-8');
}

void main();
