# Inception

Multi-container Docker infrastructure orchestrating NGINX, WordPress, Redis, MariaDB, Adminer, FTP, and Portainer — all behind a single reverse proxy with automatic TLS.

## Description

Inception is a containerized infrastructure project that orchestrates multiple services into a production-ready web development environment using Docker and Docker Compose. It demonstrates system administration, containerization, and infrastructure-as-code principles by setting up a complete WordPress hosting ecosystem with supporting services including an FTP server, database administration, and a static site — all behind a single NGINX reverse proxy with automatic TLS certificate generation.

## Architecture

The project uses Docker Compose to orchestrate the following services:

- **NGINX:** Reverse proxy and TLS termination (port 443). Auto-generates self-signed certificates via OpenSSL. Serves all web traffic.
- **WordPress:** Content management system with PHP-FPM backend (port 9000 internally)
- **MariaDB:** Relational database for WordPress with health-checked readiness
- **Redis:** In-memory cache for session/performance optimization
- **Adminer:** Database administration web UI (proxied through NGINX)
- **FTP:** File transfer server for WordPress content management (ports 21 + 21000-21010)
- **Portainer:** Docker container management UI (port 9443)
- **Static Site:** React-based static website served at `/static-site`

All services communicate over a dedicated Docker bridge network (`inception-net`) with persistent bind-mount volumes for data durability.

## Technologies & Concepts

- Docker and containerization fundamentals
- Docker Compose multi-container orchestration
- Service networking and inter-container communication
- Volume management and data persistence
- Environment configuration and secrets management
- Health checks and service dependencies
- Reverse proxy configuration (NGINX)
- Linux shell scripting for automation
- Infrastructure-as-Code principles

## Key Features

- **Multi-Service Orchestration** — Manages dependencies between services with health-checked readiness
- **Persistent Storage** — Bind-mount volumes ensure data survives container restarts
- **Health Checks** — Each service includes health verification before dependents start
- **Environment Configuration** — Single .env file controls all service parameters
- **Automatic TLS** — NGINX entrypoint generates self-signed certificates on first run
- **Reverse Proxy Routing** — All web traffic flows through NGINX from a single domain
- **FTP Integration** — Bonus FTP server for direct file access to WordPress content
- **Networking Isolation** — Internal Docker network separates infrastructure from host
- **Automated Setup** — Makefile simplifies build and deployment workflow

## Services

| Service   | Access                              | Purpose                        |
|-----------|-------------------------------------|--------------------------------|
| WordPress | `https://localhost`                 | Main CMS                       |
| Adminer   | `https://localhost/adminer`         | Database administration        |
| Static    | `https://localhost/static-site`     | React-based static page        |
| Portainer | `https://localhost:9443`            | Docker container management    |
| FTP       | `ftp://localhost:21`                | File transfer (passive: 21000-21010) |

## Commands

| Command       | Description                          |
|---------------|--------------------------------------|
| `make all`    | Build and start all services         |
| `make up`     | Start existing containers            |
| `make down`   | Stop all services                    |
| `make clean`  | Stop services and remove volumes     |
| `make vclean` | Full cleanup including persistent data|
| `make re`     | Rebuild from scratch                 |

## Project Structure

```
inception/
├── srcs/
│   ├── docker-compose.yml       # Service orchestration
│   ├── requirements/            # Service configurations
│   │   ├── nginx/              # NGINX reverse proxy
│   │   ├── wordpress/          # WordPress + PHP-FPM
│   │   ├── mariadb/            # MariaDB database
│   │   └── bonus/              # Redis, Adminer, Portainer, Static Site, FTP
│   └── .env.example            # Environment template
├── Makefile                    # Build automation
└── printlogs.sh                # Logging utility
```

## Tech Stack

- **Containerization:** Docker, Docker Compose
- **Web Server:** NGINX
- **Application Server:** WordPress + PHP-FPM
- **Database:** MariaDB
- **Cache:** Redis
- **Scripting:** Bash/Shell
- **Configuration:** Makefiles, Environment files

### Links
- [Git Repo](https://github.com/fabbbiodc/inception)
