# Replace Contents Action

This GitHub Action allows you to replace contents in files within a repository
using Bun's Glob and ECMAScript regular expressions. It is useful for automated
modifications across multiple files.

## Usage

### Inputs

- **`repo`** (required): The name of the repository where the content
  replacement will take place.
- **`branch`** (required): The branch of the repository where the changes will
  be made.
- **`github-token`** (required): A GitHub Personal Access Token (PAT) used to
  commit changes to the repository.
- **`commit-username`** (optional): The username that will be associated with
  the commit. Defaults to `GitHub Actions`.
- **`commit-email`** (optional): The email address that will be associated with
  the commit. Defaults to `actions@github.com`.
- **`commit-message`** (optional): The commit message. If not provided, the
  default will be
  `Replaced {{ inputs.match }} with {{ inputs.replace }} in {{ inputs.branch }}`.
- **`glob`** (required): The glob pattern used to find files where the content
  should be replaced.
- **`match`** (required): The content that needs to be replaced. This can be a
  string or a regular expression pattern.
- **`flags`** (optional): The flags used in the RegExp. Defaults to `gmu`.
- **`replace`** (required): The content that will replace the matched content.

### Example Workflow

```yaml
name: Replace Contents in Files
on:
  push:
    branches:
      - main

jobs:
  replace-contents:
    runs-on: ubuntu-latest
    steps:
      - name: Replace contents in files
        uses: your-username/replace-contents-action@v1
        with:
          repo: 'your-repo-name'
          branch: 'main'
          github-token: ${{ secrets.GITHUB_TOKEN }}
          commit-username: 'Your Name'
          commit-email: 'your-email@example.com'
          commit-message: 'Update config files'
          glob: '**/*.js'
          match: 'oldContent'
          replace: 'newContent'
          flags: 'gm'
```

### Steps Overview

1. **Setup Bun**: Installs Bun to use for running the scripts.
2. **Clone Repository**: Checks out the specified branch of the repository.
3. **Replace Content**: Runs a script using Bun to replace the matched content
   with the specified replacement.
4. **Commit Changes**: Commits the changes back to the repository with the
   provided commit message.

### Notes

- This action assumes that the `replace.ts` and `commit.ts` scripts are
  available at the specified `base_url`. Ensure these scripts are accessible.
- The `github-token` must have write access to the repository to push changes.
