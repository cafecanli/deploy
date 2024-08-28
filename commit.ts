import { $ } from 'bun';

const logger = console;

function config() {
  let invalid = false;

  const fields = ['COMMIT_EMAIL', 'COMMIT_USERNAME', 'COMMIT_MESSAGE'];
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

async function main() {
  const [email, username, message] = config();

  await $`git config --global user.email "${email}"`;
  await $`git config --global user.name "${username}"`;

  await $`git add .`;
  await $`git commit -m '${message}'`;

  await $`git push`;
}

void main();
