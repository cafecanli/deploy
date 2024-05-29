# Custom Deploy in Kubernetes GitHub Action

This GitHub Action allows you to deploy to a development Kubernetes cluster
using Fleet, with the ability to specify the repository, branch, commit hash,
SSH private key, Git username, Git email, Fleet repository, Fleet path, and
Fleet `values.yaml` path.

## Inputs

- `repo`:

  - **Description**: Repository name
  - **Required**: true

- `branch`:

  - **Description**: Branch name
  - **Required**: true

- `commit-hash`:

  - **Description**: Commit hash
  - **Required**: true

- `private-key`:

  - **Description**: SSH private key
  - **Required**: true

- `git-username`:

  - **Description**: Git username
  - **Required**: true

- `git-email`:

  - **Description**: Git email
  - **Required**: true

- `fleet-repo`:

  - **Description**: Fleet repository
  - **Required**: true

- `fleet-path`:

  - **Description**: Fleet path
  - **Required**: true

- `fleet-values-path`:
  - **Description**: Fleet `values.yaml` path
  - **Required**: true

## Example Usage

```yaml
name: Deploy to Dev Cluster

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Custom Deploy In Kubernetes
        id: deploy
        uses: your-org/custom-deploy-action@v1
        with:
          repo: ${{ github.repository }}
          branch: ${{ github.ref }}
          commit-hash: ${{ github.sha }}
          private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          git-username: ${{ secrets.GIT_USERNAME }}
          git-email: ${{ secrets.GIT_EMAIL }}
          fleet-repo: 'https://github.com/fleet-repo/fleet.git'
          fleet-path: 'path/to/fleet'
          fleet-values-path: 'path/to/values.yaml'

      - name: Deployment Status
        run: echo "Deployment successful!"
```

This example workflow triggers the deployment on each push to the `main` branch,
using the specified inputs for the Custom Deploy In Kubernetes action. Make sure
to replace placeholders with your actual values.

## Workflow Explanation

1. **Checkout Repository**: This step checks out the repository code.

2. **Custom Deploy In Kubernetes**: This step uses the custom action to deploy
   to the development Kubernetes cluster.

3. **Deployment Status**: This step is a placeholder for any additional steps or
   notifications you may want to add after a successful deployment.

Feel free to customize the workflow according to your specific requirements and
adjust the action inputs accordingly.
