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
  const info = (message: string) => logger.info(message);

  info(`Setting up user email to ${email}`);
  await $`git config --global user.email "${email}"`;

  info(`Setting up user name to ${username}`);
  await $`git config --global user.name "${username}"`;

  info(`Adding all files to commit`);
  await $`git add .`;

  info(`Committing with message: ${message}`);
  await $`git commit -m '${message}'`;

  info(`Pushing to remote`);
  await $`git push`;
}

void main();
