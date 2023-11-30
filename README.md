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
          env-file: ${{ secrets.ENV_FILE }}
          docker-username: ${{ secrets.DOCKER_HUB_USERNAME }}
          docker-password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
```

## Inputs

- `docker-username`: Your Docker Hub username. (Required)
- `docker-password`: Your Docker Hub password or access token. (Required)
- `env-file`: Env file contents to be copied `.env` file. (Optional)

## Outputs

- `docker-image-name`: The full name of the Docker image that was built and pushed.

## Example Workflow

Here's a full workflow example:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Push Docker Image
        uses: Alve-Development/alve-build-apps@v1.0.0
        with:
          env-file: ${{ secrets.ENV_FILE }}
          docker-username: ${{ secrets.DOCKER_HUB_USERNAME }}
          docker-password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
```

## License

[MIT](LICENSE.md)

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
