from fastapi import FastAPI

from api.health import router as health_router
from api.copilot import router as copilot_router

app = FastAPI(
    title="TwinOps AI Service"
)

app.include_router(health_router)
app.include_router(copilot_router, prefix="/api")