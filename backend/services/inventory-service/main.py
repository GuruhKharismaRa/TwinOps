from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import Base, engine

# Models
import models.inventory
import models.warehouse
import models.zone
import models.rack
import models.bin
import models.warehouse_task
import models.audit_log
import models.user
import models.role
import models.permission
import models.user_role
import models.role_permission
import models.access
import models.search_index
# Models > Notification
import models.notification_event
# import models.notification_channel
# import models.notification_setting
# import models.notification_template

# Middleware
from middleware.request_context import request_context_middleware
from middleware.auth_middleware import auth_middleware

# Routers
from api.auth import router as auth_router
from api.search import router as search_router

from api.inventory import router as inventory_router
from api.warehouse import router as warehouse_router
from api.zone import router as zone_router
from api.rack import router as rack_router
from api.bin import router as bin_router
from api.warehouse_task import router as warehouse_task_router
from api.forklift import router as forklift_router
from api.notification import router as notification_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Warehouse Twin API",
    version="1.0.0"
)

# =====================================================
# Middleware
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.middleware("http")(request_context_middleware)
app.middleware("http")(auth_middleware)

# =====================================================
# Routers
# =====================================================

app.include_router(auth_router)

# Search
app.include_router(search_router)

# Warehouse Operations
app.include_router(warehouse_router)
app.include_router(zone_router)
app.include_router(rack_router)
app.include_router(bin_router)

# Inventory
app.include_router(inventory_router)

# Task Management
app.include_router(warehouse_task_router)

# Forklift
app.include_router(forklift_router)

# Notifications
app.include_router(notification_router)

# =====================================================
# Health Check
# =====================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "inventory-service"
    }