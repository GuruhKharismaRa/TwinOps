from fastapi import Header, HTTPException, Depends
from fastapi import HTTPException

from fastapi.security import (HTTPBearer, HTTPAuthorizationCredentials)

from services.jwt_service import verify_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
    return payload