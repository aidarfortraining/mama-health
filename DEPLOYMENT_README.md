# Deployment to Render.com

Quick links for deploying Brain Training application to Render.com.

---

## Quick Start (5 minutes)

See [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) for fastest deployment path.

```bash
# 1. Push code to Git
git add .
git commit -m "Ready for Render deployment"
git push

# 2. Create Blueprint in Render
# Go to: https://dashboard.render.com/
# New + → Blueprint → Connect Repository → Apply

# 3. Update Frontend API_URL after first deploy
# Dashboard → brain-training-frontend → Environment → API_URL
# Set to: https://brain-training-api.onrender.com
```

---

## Documentation

| File | Description | When to Use |
|------|-------------|-------------|
| [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) | 5-minute quick start guide | First time deployment |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete deployment guide (15+ pages) | Detailed setup & troubleshooting |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Architecture & file summary | Understanding the setup |
| [RENDER_ENV_VARS.md](./RENDER_ENV_VARS.md) | Environment variables reference | Configuring services |
| [DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md) | Docker commands reference | Local testing |

---

## Files Created

### Configuration
- `render.yaml` - Render Blueprint (Infrastructure as Code)
- `docker-compose.yml` - Local testing
- `backend/Dockerfile` - Backend production image
- `frontend/Dockerfile` - Frontend production image
- `frontend/nginx.conf` - Nginx configuration

### Modified Files
- `frontend/index.html` - Runtime config support
- `frontend/src/services/api.ts` - Runtime API_URL support
- `.gitignore` - Docker/test files excluded

---

## Local Testing

Before deploying, test Docker images locally:

```bash
# Full stack
docker-compose up --build

# Test URLs:
# Frontend: http://localhost
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs

# Shutdown
docker-compose down
```

---

## Architecture

```
Render.com
├── Backend (Web Service)
│   ├── FastAPI + Uvicorn
│   ├── SQLite + aiosqlite
│   └── Port: 8000
│
└── Frontend (Web Service)
    ├── React 19 + Vite
    ├── Nginx (static files)
    └── Port: 80
```

---

## Environment Variables

### Backend
```
PORT=8000
DATABASE_URL=sqlite+aiosqlite:///./data/brain_training.db
```

### Frontend
```
API_URL=https://brain-training-api.onrender.com
```

See [RENDER_ENV_VARS.md](./RENDER_ENV_VARS.md) for complete reference.

---

## Deployment Options

### Option 1: Blueprint (Recommended)

Use `render.yaml` for automatic infrastructure creation:

```
Render Dashboard → New + → Blueprint → Connect Repo
```

### Option 2: Manual

Create services manually in Render Dashboard:
1. Backend: Web Service (Docker)
2. Frontend: Web Service (Docker)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

---

## Health Checks

```bash
# Backend
curl https://brain-training-api.onrender.com/health
# Expected: {"status":"ok"}

# Frontend
curl https://brain-training-frontend.onrender.com/health
# Expected: healthy
```

---

## Cost

**Free Tier:**
- $0/month
- 512 MB RAM per service
- Services sleep after 15 minutes of inactivity
- 15-30 second cold start

**Paid Tier:**
- $7/month per service
- No sleep (24/7 availability)
- More CPU/RAM

---

## Production Recommendations

1. Upgrade to paid plan ($7/month)
2. Migrate to PostgreSQL (from SQLite)
3. Add monitoring (Sentry, Uptime Robot)
4. Configure custom domain
5. Setup CI/CD pipeline

See [DEPLOYMENT.md](./DEPLOYMENT.md) → Production Recommendations section.

---

## Troubleshooting

### Common Issues

1. **Frontend can't connect to Backend**
   - Check `API_URL` in Frontend environment variables
   - Must use HTTPS URL, not HTTP

2. **Service is slow to start**
   - Normal for Free tier (cold start)
   - First request wakes up the service

3. **Database is empty**
   - Check logs for "✅ Seed data inserted successfully!"
   - Try manual redeploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) → Troubleshooting section for more.

---

## Support

1. Check troubleshooting guides in documentation
2. Review logs in Render Dashboard
3. Test locally with Docker
4. [Render Community](https://community.render.com/)
5. [Render Documentation](https://render.com/docs)

---

## Next Steps

After deployment:

1. Verify services are running
2. Test all exercise endpoints
3. Configure custom domain (optional)
4. Setup monitoring
5. Document URLs for team

---

**Status:** ✅ Ready to Deploy
**Estimated Time:** 10-15 minutes
**Platform:** Render.com
