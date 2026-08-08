from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from passlib.context import CryptContext
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.access import Access
from schemas.auth_schema import (LoginRequest)
from services.jwt_service import (create_access_token)
from models.permission import Permission
from models.role_permission import RolePermission
from models.audit_log import AuditLog
from models.warehouse_task import WarehouseTask
# comment dulu
# from shared.core.security import get_current_user
from auth.current_user  import get_current_user
from fastapi import Request
from pydantic import BaseModel
from services.audit_service import (create_audit_log)
router = APIRouter(prefix="/auth", tags=["AUTH"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
      db = SessionLocal()
      try:
            yield db
      finally:
            db.close()
# Base.metadata.create_all(bind=engine)

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
      user = db.query(User).filter(User.username == data.username).first()
      print(f"User found: {user.username if user else 'None'}")
      if not user:
            return {
                  "status":"error",
                  "message":"User not found"
            }
      if not user.is_active:
            return {
            "status":"error",
            "message":"User inactive"
      }
      password_valid = pwd_context.verify(data.password, user.password_hash)
      if not password_valid:
            return {
                  "status":"error",
                  "message":"Invalid password"
            }
            
      user_role = db.query(UserRole).filter(UserRole.user_id == user.user_id).first()
      role = None
      if user_role:
            role = db.query(Role).filter(Role.role_id == user_role.role_id).first()
 
      token = create_access_token({"user_id": user.user_id, "username": user.username, 
                                   "full_name": user.full_name, 
                                   "role_id": role.role_id
                                   if role
                                   else None,
                                   "role_name": role.role_name
                                   if role
                                   else None
                                   })

      return {
            "status":"success",
            "access_token": token,
            "token_type": "bearer"
      }

@router.get("/me")
def me(
      current_user = Depends(get_current_user),
      db: Session = Depends(get_db)
):

      user_id = current_user.get("user_id")
      warehouse_access = (db.query(Access).filter(Access.user_id == user_id).all())
      warehouses = [item.warehouse_id for item in warehouse_access]
      user = (db.query(User).filter(
            User.user_id == user_id
      ).first())
      
      return {
            "status":"success",
            "data": {
                  "user_id": current_user.get("user_id"),
                  "username": current_user.get("username"),
                  "full_name": user.full_name,
                  "email": user.email,
                  "phone": user.phone,
                  "avatar_url": user.avatar_url,
                  "role_id": current_user.get("role_id"),
                  "role_name": current_user.get("role_name"),
                  "warehouses": warehouses
            }
      }
      
@router.get("/permissions")
def get_permissions(
      current_user = Depends(get_current_user), 
      db: Session = Depends(get_db) 
):
      role_id = current_user.get("role_id")
      role_permissions = db.query(
            RolePermission
      ).filter(
            RolePermission.role_id == role_id
      ).all()
      
      permission_ids = [
            item.permission_id for item in role_permissions
      ]
      
      permissions = (
            db.query(Permission)
            .filter(Permission.permission_id.in_(permission_ids))
            .all()
      )
      
      return {
            "status": "success",
            "data": {
                  "role_id": role_id,
                  "role_name": current_user.get("role_name"),
                  "permissions": [perm.permission_name for perm in permissions]
            }
      }
      
class UpdateProfileRequest(BaseModel):
    full_name: str
    email: str | None = None
    phone: str | None = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    
@router.put("/profile")
def update_profile(
    data: UpdateProfileRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.user_id ==
            current_user["user_id"]
        )
        .first()
    )
    
    if not user:
          return {
                "status":"error",
                "messge":"User not found"
          }

    user.full_name = data.full_name.strip()
    user.email = (data.email.strip()
                  if data.email
                  else None)
    user.phone = data.phone

    db.commit()
    create_audit_log(
      db=db,
      event_type="user.profile.updated",
      module="PROFILE",
      action="UPDATE",
      entity_type="USER",
      entity_id=user.user_id,
      entity_code=user.username,
      performed_by=current_user["username"],
      remarks="Profile updated"
      )
    return {
        "status":"success",
        "message":"Profile updated"
    }

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.user_id ==
            current_user["user_id"]
        )
        .first()
    )
    if not user:
          return {
                "status":"error",
                "messge":"User not found"
                }

    valid = pwd_context.verify(
        data.current_password,
        user.password_hash
    )

    if not valid:
        return {
            "status":"error",
            "message":"Current password invalid"
        }

    user.password_hash = (
        pwd_context.hash(
            data.new_password
        )
    )

    db.commit()
    create_audit_log(
      db=db,
      event_type="user.password.changed",
      module="PROFILE",
      action="CHANGE_PASSWORD",
      entity_type="USER",
      entity_id=user.user_id,
      entity_code=user.username,
      performed_by=current_user["username"],
      remarks="Password changed"
      )
    return {
        "status":"success",
        "message":"Password changed"
    }
    
@router.get("/activity")
def get_my_activity(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    logs = (
        db.query(AuditLog)
        .filter(
            AuditLog.performed_by == current_user["username"]
        )
        .order_by(
            AuditLog.created_at.desc()
        )
        .limit(50)
        .all()
    )

    return {
        "status":"success",
        "data":[
            {
                "event_time": item.created_at,
                "event_type": item.event_type,
                "module": item.module,
                "action": item.action,
                "remarks": item.remarks
            }
            for item in logs
        ]
    }
    
@router.get("/my-tasks")
def get_my_tasks(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    tasks = (
        db.query(WarehouseTask)
        .filter(
            WarehouseTask.assigned_to ==
            current_user["user_id"]
        )
        .order_by(
            WarehouseTask.created_at.desc()
        )
        .all()
    )

    return {
        "status":"success",
        "data":[
            {
                "task_code": task.task_code,
                "task_type": task.task_type,
                "priority": task.priority,
                "status": task.status
            }
            for task in tasks
        ]
    }