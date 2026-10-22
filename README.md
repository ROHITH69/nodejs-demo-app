# Node.js Demo App — GitHub Actions CI/CD

A small Node.js HTTP app demonstrating a CI/CD pipeline using GitHub Actions and Docker Hub. It uses Node's built-in HTTP server and test runner, so no third-party npm packages are required.

## What the pipeline does

1. Runs on pushes and pull requests targeting `main`, and can also be started manually.
2. Checks out the code and configures Node.js 22.
3. Runs automated tests (`npm test`).
4. Builds a Docker image to validate the Dockerfile.
5. After successful tests, publishes `latest` to Docker Hub on pushes to `main` only.

Pull requests and non-main branches do not publish images.

## App endpoints

- `GET /` — JSON greeting and service status.
- `GET /health` — health-check response.
- Other paths return HTTP 404.

## Run locally

Requirements: Node.js 20+ (Node.js 22 recommended), and Docker for container steps.

```bash
npm test
npm start
```

Open `http://localhost:3000/` or `http://localhost:3000/health`. Stop the server with `Ctrl+C`.

## Build and run with Docker

```bash
docker build -t nodejs-demo-app:local .
docker run --rm -p 3000:3000 nodejs-demo-app:local
```

Then open `http://localhost:3000/health`.

## Configure Docker Hub publishing

1. Create a Docker Hub account and create a repository named `nodejs-demo-app`.
2. In Docker Hub, create an access token (prefer a read/write token scoped to the repository if available).
3. In your GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**.
4. Add these secrets exactly:
   - `DOCKERHUB_USERNAME` — your Docker Hub username.
   - `DOCKERHUB_TOKEN` — the Docker Hub access token, not your account password.
5. Push a commit to `main`. Open **Actions** in GitHub and inspect the `Node.js CI/CD` run. The `publish` job runs only if the `test` job passes and the event is a push to `main`.
6. Once successful, the image should be available as `YOUR_DOCKERHUB_USERNAME/nodejs-demo-app:latest`.

Do not put tokens or passwords in source code, README files, or committed `.env` files. If secrets are not configured, the test job can still pass but the publish job will fail at Docker Hub login.

## GitHub repository setup

Create an empty GitHub repository named `nodejs-demo-app` (do not initialize it with a README if you plan to push this folder as-is), then follow the commands in the submission instructions provided with this project.

## CI/CD flow

```text
Push / Pull Request to main
            |
            v
      GitHub Actions
            |
            v
       Run npm test
            |
            v
     Build Docker image
            |
            v
   Push to main only? ---- no ---> Finish (no publish)
            |
           yes
            v
     Log in to Docker Hub
            |
            v
     Push image :latest
```

## Interview questions — quick answers

1. **What is CI/CD?** Continuous Integration frequently validates changes through automated builds and tests; Continuous Delivery/Deployment automates preparing or releasing validated changes.
2. **How do GitHub Actions work?** YAML workflow files define events, jobs, and steps. GitHub schedules jobs on runners when configured events occur.
3. **What are runners?** Machines or environments that execute workflow jobs; this workflow uses GitHub-hosted Ubuntu runners.
4. **Jobs vs steps?** A job is a group of steps executed on a runner. Steps run commands or actions, usually in order. Separate jobs can run in parallel unless connected with `needs`.
5. **How do you secure secrets?** Store credentials in GitHub Actions Secrets, use scoped access tokens, avoid printing secrets, and grant minimum required permissions.
6. **How do you handle deployment errors?** Inspect the failed step logs, verify secrets and permissions, check Docker build output and registry status, then rerun after fixing the root cause. Add health checks/rollback for production deployments.
7. **Explain Docker build-push.** The workflow builds an image from the Dockerfile and context, authenticates to Docker Hub using a token, then pushes the tagged image to the registry.
8. **How can you test CI/CD locally?** Run `npm test` and `docker build` locally. For GitHub-specific event behavior, push to a test branch or use a workflow-dispatch event; local tools cannot perfectly reproduce GitHub-hosted runners.

## Limitations

This task publishes a container image to Docker Hub; it does not deploy the running container to a cloud host or server. A real deployment stage would need a target environment and deployment credentials/configuration.
