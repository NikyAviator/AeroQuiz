# AeroQuiz

A fullstack aviation quiz application written in JavaScript and Go.

## Table of Contents

- [My Tech Stack](#my-tech-stack)
- [Running in Development](#running-in-development)
- [Scripts](#scripts)
- [DevOps](#devops)
- [API Testing](#api-testing)

### My Tech Stack

**Front end:**

- React
- Tailwind CSS
- Vite

Frontend dependencies for future projects:

```json
npm install @headlessui/react @heroicons/react @tailwindcss/typography clsx framer-motion react react-dom react-router-dom tailwindcss
```

Dev dependencies:

```json
npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals prettier prettier-plugin-tailwindcss vite
```

**Back end:**

- Go
- Gin
- MongoDB

**DevOps**

- Bash
- Docker
- Kubernetes
- Tilt (K8s for local dev)
- Hosting via GCP (Google Cloud Platform with: Cloud - Triggers -> Build -> Run)

---

### Running in Development

For development environment we use a Tiltfile and Minikube for hosting of our K8s.

To start our cluster, make sure you meet the following prerequisites.

### Prerequisites:

| Tool                                                       | Purpose                                     | Check version              |
| ---------------------------------------------------------- | ------------------------------------------- | -------------------------- |
| [Docker Desktop](https://www.docker.com/) or Docker Engine | Container runtime used by Minikube and Tilt | `docker --version`         |
| [Minikube](https://minikube.sigs.k8s.io/docs/)             | Local single-node Kubernetes cluster        | `minikube version`         |
| [kubectl](https://kubernetes.io/docs/tasks/tools/)         | Kubernetes CLI                              | `kubectl version --client` |
| [Tilt](https://docs.tilt.dev/install.html)                 | Local dev orchestrator                      | `tilt version`             |

---

Before starting, check current docker context & other nice commands:

```bash
docker context ls                  # check active context
docker context use default         # switch to native dockerd (/run/docker.sock)
docker info                        # inspect what is running
```

Recommended minikube resource config:

```bash
minikube config set driver docker
minikube config set cpus 2
minikube config set memory 4096
minikube config set disk-size 20g
minikube config view               # verify
minikube start
```

Then enable the ingress addon:

```bash
minikube addons enable ingress
```

Create the Kubernetes secret from the env file (dev only, path is in .gitignore):

```bash
kubectl create secret generic quiz-service-env \
  --from-env-file=secrets/quiz-service.env
```

To update later, delete and recreate:

```bash
kubectl delete secret quiz-service-env
```

Verify the secret and check headers:

```bash
kubectl get secret quiz-service-env -o json
kubectl exec -it <backend-pod-name> -- env | grep API_SHARED_SECRET
```

---

### Scripts

Get a clear snapshot of the project structure:

```bash
tree -I 'node_modules|.git|dist' -a -L 10
```

Update **ALL** dependencies — cd into **/scripts** and run:

```bash
./update-all.sh
```

---

## DevOps

### Local dev ports (managed automatically by Tilt)

| URL                     | What it hits                           |
| ----------------------- | -------------------------------------- |
| `http://localhost:8080` | Full stack — ingress → nginx → backend |
| `http://localhost:3000` | Frontend pod directly                  |
| `http://localhost:5000` | Backend pod directly                   |

No manual port-forwarding needed. Tilt manages all three.

### Starting the cluster

From the **repo root**, with minikube running:

```bash
tilt up
```

### Stopping / Cleaning up

```bash
tilt down       # stop all Tilt resources
minikube stop   # shut down the cluster (keeps data)
```

Other useful minikube commands:

```bash
minikube config view
minikube status
minikube profile list
minikube --help
```

To nuke everything completely:

```bash
minikube delete --all --purge
```

Use this only when:

- Switching driver or core config
- Changing CPU/memory/disk size
- The cluster is completely broken and not worth debugging

Recreate stale pods:

```bash
tilt down
kubectl get all
kubectl get pods
kubectl delete pod --all
tilt up
---
tilt logs -f
```

---

## API Testing

The base URL for all API calls is `/api/v1`.

Tilt automatically forwards all ports on `tilt up` — no manual setup needed:

| URL                     | Use for                                        |
| ----------------------- | ---------------------------------------------- |
| `http://localhost:5000` | Backend direct — fastest for API testing       |
| `http://localhost:8080` | Full stack — tests nginx proxy and headers too |

> Use `localhost:5000` to test the backend in isolation. Use `localhost:8080` to verify the full request flow including the nginx `X-API-SECRET` header injection.

---

### Register a new user

```
POST /api/v1/auth/register
Content-Type: application/json
```

**Request body:**

```json
{
  "username": "CaptainNiky",
  "email": "niky@example.com",
  "password": "MyPassword123!"
}
```

**Responses:**

| Status                      | Meaning                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| `201 Created`               | User registered. Returns public user object.                           |
| `400 Bad Request`           | Validation failed — missing fields, password too short, invalid email. |
| `409 Conflict`              | Email already registered.                                              |
| `500 Internal Server Error` | Server-side error.                                                     |

**Success response (`201`):**

```json
{
  "id": "6650a1f2c3d4e5f6a7b8c9d0",
  "email": "niky@example.com",
  "username": "CaptainNiky",
  "isAdmin": false,
  "createdAt": "2026-06-10T14:00:00Z"
}
```

**curl:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"CaptainNiky","email":"niky@example.com","password":"MyPassword123!"}'
```

---

### Login

```
POST /api/v1/auth/login
Content-Type: application/json
```

**Request body:**

```json
{
  "email": "niky@example.com",
  "password": "MyPassword123!"
}
```

**Responses:**

| Status             | Meaning                              |
| ------------------ | ------------------------------------ |
| `200 OK`           | Login successful. Returns JWT token. |
| `400 Bad Request`  | Validation failed.                   |
| `401 Unauthorized` | Invalid email or password.           |

**Success response (`200`):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> Store the JWT token client-side and send it as `Authorization: Bearer <token>` on all protected routes.

**curl:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"niky@example.com","password":"MyPassword123!"}'
```
