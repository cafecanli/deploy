# Alve Build Apps Action

This GitHub Action automates the process of building and pushing Docker images with caching, utilizing the dynamic generation of Docker image names based on repository, branch, and commit hash.

## Usage

To use this action in your workflow, add the following step:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Build and Push Docker Image
        uses: Alve-Development/alve-build-apps@v1.0.0
        with:
          env-file: ${{ secrets.ENV_FILE }} # optional
          docker-username: ${{ secrets.DOCKER_HUB_USERNAME }}
          docker-password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
```
