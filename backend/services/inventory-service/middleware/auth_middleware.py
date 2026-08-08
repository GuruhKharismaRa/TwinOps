from fastapi import Request
from fastapi.responses import JSONResponse
from services.jwt_service import (
    verify_token
)
async def auth_middleware(
    request: Request,
    call_next
):
      if request.method == "OPTIONS":
            return await call_next(request)
      public_paths = [
            "/docs",
            "/openapi.json",
            "/auth/login"
      ]
      if request.url.path in public_paths:
            return await call_next(request)
      authorization = request.headers.get(
            "Authorization"
      )
      print("AUTH HEADER:", authorization)
      authorization = request.headers.get("Authorization")

      print("PATH:", request.url.path)
      print("ALL HEADERS:", dict(request.headers))
      print("AUTH HEADER:", authorization)
      if not authorization:
            return JSONResponse(
                  status_code=401,
                  content={
                        "status": "error",
                        "message": "Missing token"
                  }
            )
      try:
            scheme, token = authorization.split()
      except:
            return JSONResponse(
                  status_code=401,
                  content={
                        "status": "error",
                        "message": "Invalid authorization header"
                  }
            )
      if scheme.lower() != "bearer":
            return JSONResponse(
                  status_code=401,
                  content={
                        "status": "error",
                        "message": "Invalid auth scheme"
                  }
            )
      print("TOKEN:", token)
      payload = verify_token(token)
      print("PAYLOAD:", payload)
      if not payload:
            return JSONResponse(
                  status_code=401,
                  content={
                        "status": "error",
                        "message": "Invalid token"
                  }
            )
      request.state.user = payload
      response = await call_next(request)
      return response