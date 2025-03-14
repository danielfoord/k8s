kubectl delete -f k8s-deno-api.yaml &&
kubectl delete -f k8s-pgadmin.yaml &&
kubectl delete -f k8s-postgres.yaml &&
kubectl delete -f k8s-config.yaml &&
kubectl delete -f k8s-secrets.yaml &&
kubectl delete -f k8s-pvcs.yaml &&
kubectl delete -f k8s-sc.yaml &&
kubectl delete -f metrics-server.yaml &&
kubectl delete -f kubernetes-dashboard-crb.yaml &&
kubectl delete -f kubernetes-dashboard-sa.yaml
