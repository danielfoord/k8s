# K8s Learning Repository

## Run tests
```bash
docker-compose down --volumes && docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from deno-test
```

## Migrate schema
```bash
npx prisma migrate dev --name {migration_name}
```

```
npx prisma generate
```

## Install Kubernetes Dashboard

Add the helm repo
```bash
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
```

Deploy the dashboard
```bash
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
```

## Install Dashboard dependencies
```
./resources/install-dashboard-deps.ps1
```

## Install using Helm
```bash
helm install deno . --values values.yaml
```
