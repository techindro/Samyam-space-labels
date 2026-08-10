# Samyam Space Labels - Kubernetes Deployment Guide

This directory contains production-ready Kubernetes (K8s) manifest files for deploying **Samyam Space Labels** (Frontend + AI Engine microservices).

---

## 📁 Architecture Overview

```
                  +-----------------------+
                  |    Kubernetes Ingress |
                  +-----------+-----------+
                              |
              +---------------+---------------+
              |                               |
              v                               v
    +-------------------+           +--------------------+
    | Frontend Service  |           | AI-Engine Service  |
    |  (Port 80)        |           |  (Port 8000)       |
    +---------+---------+           +---------+----------+
              |                               |
              v                               v
    +-------------------+           +--------------------+
    | Frontend Pods     |           | AI-Engine Pods     |
    | (Nginx SPA)       |           | (FastAPI / CLIP)   |
    +-------------------+           +--------------------+
```

---

## 🛠️ Step 1: Build & Push Docker Images

Before applying K8s manifests, build and push your Docker images to a registry (such as Docker Hub, GHCR, or AWS ECR):

### 1. Build Frontend Image
```bash
# From workspace root
docker build -t your-username/samyam-frontend:v1 .
docker push your-username/samyam-frontend:v1
```

### 2. Build AI Engine Image
```bash
docker build -t techindro/samyam-ai-engine:v1 ./python
docker push techindro/samyam-ai-engine:v1
```

*(Note: Replace `techindro/samyam-frontend:v1` in `frontend-deployment.yaml` and `ai-engine-deployment.yaml` with your actual image tag).*

---

## 🚀 Step 2: Deploy to Kubernetes Cluster

Deploy all manifests using `kubectl`:

```bash
# 1. Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# 2. Deploy Kafka & Zookeeper Broker (Optional Streaming Bus)
kubectl apply -f k8s/kafka.yaml

# 3. Deploy AI Engine Backend
kubectl apply -f k8s/ai-engine-deployment.yaml

# 4. Deploy Frontend Web App
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Apply Horizontal Pod Autoscaler (HPA)
kubectl apply -f k8s/hpa.yaml

# 6. (Optional) Apply Ingress Routing
kubectl apply -f k8s/ingress.yaml
```

Alternatively, apply the whole folder at once:
```bash
kubectl apply -f k8s/
```

---

## 🔍 Step 3: Verify Deployment

Check running pods, services, and deployments:

```bash
# Check Pod status
kubectl get pods

# Check Services and external IPs
kubectl get svc

# Check logs if needed
kubectl logs -l app=samyam-frontend
kubectl logs -l app=samyam-ai-engine
```

---

## 🛑 Cleanup

To remove all deployed resources:

```bash
kubectl delete -f k8s/
```
