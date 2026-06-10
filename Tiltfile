# --- Docker Builds ---
docker_build(
    ref='backend-image',
    context='./backend',
    dockerfile='infra/development/Docker/backend.Dockerfile',
)

docker_build(
    ref='frontend-image',
    context='.',
    dockerfile='infra/development/Docker/frontend.Dockerfile',
)

allow_k8s_contexts('minikube')

# --- K8s resources ---
k8s_yaml([
    'infra/development/K8s/frontend-deployment.yaml',
    'infra/development/K8s/frontend-service.yaml',
    'infra/development/K8s/backend-deployment.yaml',
    'infra/development/K8s/backend-service.yaml',
    'infra/development/K8s/ingress.yaml',
])

# --- Tilt UX ---
k8s_resource('frontend', port_forwards=['3000:8080'])  # frontend direct on localhost:3000
k8s_resource('backend',  port_forwards=['5000:5000'])  # backend direct on localhost:5000

# Ingress owns 8080 — full stack testing goes through here
local_resource(
  'ingress-pf',
  serve_cmd='kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8080:80',
  allow_parallel=True,
)