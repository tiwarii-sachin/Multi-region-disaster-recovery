# 🌍 Multi-Region Disaster Recovery System

<p align="center">

**Cloud-Native Multi-Region Disaster Recovery Platform**

Automated infrastructure deployment, application failover, health monitoring, backup, and recovery across multiple AWS regions using **Terraform, Kubernetes, Docker, GitHub Actions, Argo CD, Prometheus, and Grafana**.

</p>

---

## 🚀 Overview

The **Multi-Region Disaster Recovery System** is a cloud-native infrastructure project designed to demonstrate how a production application can remain available during a regional failure.

The system deploys application infrastructure across multiple AWS regions and uses automated health checks, infrastructure-as-code, container orchestration, monitoring, and GitOps practices to support disaster recovery.

### 🎯 Primary Goals

* Deploy infrastructure across multiple AWS regions
* Reduce application downtime during regional failures
* Automate infrastructure provisioning using Terraform
* Containerize applications using Docker
* Deploy workloads using Kubernetes
* Implement CI/CD using GitHub Actions
* Manage Kubernetes deployments using Argo CD
* Monitor infrastructure and applications using Prometheus and Grafana
* Maintain backups and recovery procedures
* Demonstrate automated or semi-automated regional failover

---

# 🏗️ Architecture

```text
                              ┌───────────────────┐
                              │       Users       │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │   DNS / Route 53  │
                              │   Health Checks    │
                              └─────────┬─────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
                ┌─────────────────┐          ┌─────────────────┐
                │   AWS Region 1  │          │   AWS Region 2  │
                │   Primary       │          │   Secondary     │
                └────────┬────────┘          └────────┬────────┘
                         │                             │
                         ▼                             ▼
                ┌─────────────────┐          ┌─────────────────┐
                │     AWS EKS     │          │     AWS EKS     │
                │   Kubernetes    │          │   Kubernetes    │
                └────────┬────────┘          └────────┬────────┘
                         │                             │
                ┌────────┴────────┐          ┌────────┴────────┐
                │                 │          │                 │
                ▼                 ▼          ▼                 ▼
          ┌──────────┐      ┌──────────┐ ┌──────────┐    ┌──────────┐
          │Frontend  │      │ Backend  │ │Frontend  │    │ Backend  │
          │Container │      │Container │ │Container │    │Container │
          └──────────┘      └──────────┘ └──────────┘    └──────────┘
                │                 │          │                 │
                └─────────────────┴──────────┴─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Database / Data  │
                         │ Backup + Restore  │
                         └──────────────────┘

                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Monitoring & Alerting  │
                     │ Prometheus + Grafana   │
                     └────────────────────────┘
```

---

# ☁️ AWS Infrastructure

The infrastructure is designed around two AWS regions:

```text
Primary Region
      │
      ├── VPC
      ├── Public Subnets
      ├── Private Subnets
      ├── EKS Cluster
      ├── Load Balancer
      └── Application Workloads

Secondary Region
      │
      ├── VPC
      ├── Public Subnets
      ├── Private Subnets
      ├── EKS Cluster
      ├── Load Balancer
      └── Standby Application Workloads
```

### AWS Services

| Service                | Purpose                       |
| ---------------------- | ----------------------------- |
| Amazon EKS             | Kubernetes orchestration      |
| Amazon EC2             | Worker infrastructure         |
| Amazon VPC             | Network isolation             |
| Elastic Load Balancing | Application traffic           |
| Amazon Route 53        | DNS and health checks         |
| Amazon ECR             | Container image registry      |
| Amazon S3              | Backup/object storage         |
| IAM                    | Access control                |
| CloudWatch             | AWS infrastructure monitoring |
| AWS KMS                | Encryption                    |
| Secrets Manager        | Secret management             |

---

# 🛠️ Technology Stack

## Cloud

* AWS
* Amazon EKS
* Amazon ECR
* Amazon Route 53
* Amazon S3
* Amazon VPC
* IAM
* CloudWatch

## Infrastructure as Code

* Terraform
* Terraform Modules
* Remote State
* State Locking

## Containers

* Docker
* Docker Compose
* Amazon ECR

## Kubernetes

* Kubernetes
* Helm
* HPA
* ConfigMaps
* Secrets
* Services
* Ingress

## CI/CD

* GitHub Actions
* Docker Build
* Security Scanning
* Amazon ECR

## GitOps

* Argo CD

## Monitoring

* Prometheus
* Grafana
* Alertmanager

---

# 🔄 CI/CD Pipeline

```text
Developer
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Checkout
    │
    ├── Install Dependencies
    │
    ├── Run Tests
    │
    ├── SonarQube Analysis
    │
    ├── Trivy Security Scan
    │
    ├── Docker Build
    │
    ├── Docker Image Scan
    │
    └── Push Image
            │
            ▼
        Amazon ECR
            │
            ▼
         Argo CD
            │
            ▼
       Kubernetes
```

---

# 🐳 Container Architecture

The application is containerized into independent services.

```text
Docker
│
├── Frontend
│   └── React + Nginx
│
└── Backend
    └── Node.js + Express
```

Each service can be independently:

* Built
* Tested
* Scanned
* Versioned
* Deployed
* Rolled back

---

# ☸️ Kubernetes Architecture

```text
                    Kubernetes Cluster
                           │
             ┌─────────────┴─────────────┐
             │                           │
        Frontend                    Backend API
             │                           │
       Deployment                  Deployment
             │                           │
          Service                    Service
             │                           │
             └─────────────┬─────────────┘
                           │
                         Ingress
                           │
                           ▼
                         Users
```

### Kubernetes Features

* Deployments
* Services
* ConfigMaps
* Secrets
* Ingress
* Horizontal Pod Autoscaler
* Rolling Updates
* Health Probes
* Resource Requests/Limits

---

# 📈 Autoscaling

The application supports Kubernetes Horizontal Pod Autoscaling.

Example:

```text
Minimum Pods:     1
Maximum Pods:    10
CPU Target:      50%
```

When application traffic increases:

```text
Traffic
   │
   ▼
CPU increases
   │
   ▼
HPA detects threshold
   │
   ▼
More Pods created
   │
   ▼
Traffic distributed
```

---

# 🚨 Disaster Recovery

The primary objective is to maintain application availability during infrastructure or regional failures.

### Example Failure

```text
Normal Operation

Users
  │
  ▼
Route 53
  │
  ▼
Region 1
  │
  ▼
EKS
  │
  ▼
Application
```

If Region 1 becomes unavailable:

```text
Regional Failure
       │
       ▼
Route 53 Health Check
       │
       ▼
Region 1 unhealthy
       │
       ▼
Traffic redirected
       │
       ▼
Region 2
       │
       ▼
EKS
       │
       ▼
Application
```

---

# 🔁 Recovery Workflow

```text
1. Detect Failure
       │
       ▼
2. Health Check
       │
       ▼
3. Identify Failed Region
       │
       ▼
4. Route Traffic to Secondary Region
       │
       ▼
5. Restore / Synchronize Data
       │
       ▼
6. Validate Application
       │
       ▼
7. Monitor Recovery
```

---

# 💾 Backup Strategy

Application data and infrastructure state should be backed up independently.

### Backup Components

```text
Application Data
       │
       ▼
Amazon S3
       │
       ▼
Versioned Backups
       │
       ▼
Secondary Region
```

Terraform state should use remote storage and state locking.

Example architecture:

```text
Terraform
    │
    ▼
S3 Remote State
    │
    ▼
State Locking
```

---

# 🔐 Security

Security controls implemented/planned:

* IAM least-privilege policies
* Private Kubernetes workloads
* Security Groups
* Network isolation
* Kubernetes Secrets
* AWS Secrets Manager
* Encryption at rest
* Encryption in transit
* Container vulnerability scanning
* Terraform security practices
* No secrets committed to Git
* `.env` files excluded through `.gitignore`

---

# 📊 Monitoring

Monitoring stack:

```text
Applications
     │
     ▼
Prometheus
     │
     ├──────────────┐
     ▼              ▼
  Metrics        Alertmanager
     │              │
     ▼              ▼
  Grafana        Alerts
```

### Metrics

* CPU utilization
* Memory utilization
* Pod count
* Request rate
* Error rate
* Response latency
* Application availability
* Kubernetes health
* Node health

---

# 📁 Project Structure

```text
multi-region-disaster-recovery/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── terraform/
│   ├── modules/
│   │   ├── vpc/
│   │   ├── eks/
│   │   ├── iam/
│   │   └── networking/
│   │
│   ├── environments/
│   │   ├── primary/
│   │   └── secondary/
│   │
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── providers.tf
│
├── kubernetes/
│   ├── namespace.yaml
│   ├── frontend/
│   ├── backend/
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── secrets.yaml
│
├── helm/
│   └── watchmore/
│
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   └── alertmanager/
│
├── backend/
│
├── frontend/
│
├── docker-compose.yml
│
├── Dockerfile
│
├── README.md
│
└── .gitignore
```

---

# 🚀 Local Development

Clone the repository:

```bash
git clone https://github.com/tiwarii-sachin/multi-region-disaster-recovery.git
cd multi-region-disaster-recovery
```

Run the application with Docker Compose:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

---

# 🧪 Disaster Recovery Testing

The project should be tested using controlled failure scenarios.

### Test Scenarios

* Kubernetes pod failure
* Kubernetes node failure
* Application container failure
* Load balancer failure
* Primary-region application failure
* Database recovery
* Backup restoration
* DNS health-check failure

Example:

```text
Healthy
   │
   ▼
Simulate Failure
   │
   ▼
Health Check Detects Failure
   │
   ▼
Failover
   │
   ▼
Secondary Region
   │
   ▼
Application Available
```

---

# 📏 DR Metrics

The system can be evaluated using:

### RTO — Recovery Time Objective

How quickly the application is restored after a failure.

```text
Failure → Recovery
```

### RPO — Recovery Point Objective

How much data loss is acceptable after a failure.

```text
Last Backup → Failure
```

Example target configuration:

```text
RTO: < 15 minutes
RPO: < 5 minutes
```

> Actual RTO/RPO depends on the final AWS architecture, workload, backup frequency, data replication strategy, and failover automation.

---

# 🔄 GitOps Workflow

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Actions
    │
    ▼
Build + Test + Security Scan
    │
    ▼
Container Image
    │
    ▼
Amazon ECR
    │
    ▼
Update Kubernetes Manifest
    │
    ▼
Argo CD
    │
    ▼
Kubernetes Cluster
```

Argo CD continuously reconciles the Kubernetes cluster with the desired configuration stored in Git.

---

# 🗺️ Project Roadmap

### Phase 1 — Application

* [x] React frontend
* [x] Node.js backend
* [x] Docker
* [x] Docker Compose
* [x] Persistent application storage

### Phase 2 — CI

* [ ] GitHub Actions
* [ ] Automated tests
* [ ] SonarQube
* [ ] Trivy
* [ ] Docker image scanning

### Phase 3 — AWS

* [ ] AWS VPC
* [ ] ECR
* [ ] EKS
* [ ] IAM
* [ ] Route 53
* [ ] S3

### Phase 4 — Infrastructure as Code

* [ ] Terraform
* [ ] Terraform modules
* [ ] Remote state
* [ ] Multi-region infrastructure

### Phase 5 — Kubernetes

* [ ] Kubernetes deployments
* [ ] Services
* [ ] Ingress
* [ ] HPA
* [ ] Health probes
* [ ] Resource limits

### Phase 6 — GitOps

* [ ] Argo CD
* [ ] Automated deployments
* [ ] Rollback strategy

### Phase 7 — Observability

* [ ] Prometheus
* [ ] Grafana
* [ ] Alertmanager
* [ ] Application metrics
* [ ] Infrastructure alerts

### Phase 8 — Disaster Recovery

* [ ] Multi-region deployment
* [ ] Route 53 health checks
* [ ] Backup strategy
* [ ] Failover testing
* [ ] Recovery automation
* [ ] RTO/RPO measurement

---

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

* Cloud infrastructure
* AWS
* Terraform
* Docker
* Kubernetes
* CI/CD
* GitOps
* Infrastructure automation
* Container security
* Monitoring
* Disaster recovery
* High availability
* Multi-region architecture

---

# 👨‍💻 Author

## Sachin Tiwari

**Computer Science & Engineering Student | Cloud & DevOps**

### Profiles

* GitHub: `tiwarii-sachin`
* LinkedIn: `linkedin.com/in/sachin-tiwari-2`

---

# 📜 License

This project is intended for educational and portfolio purposes.
