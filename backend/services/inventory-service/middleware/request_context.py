import uuid
from fastapi import Request

async def request_context_middleware(request: Request, call_next):

    request.state.request_id = str(uuid.uuid4())
    request.state.trace_id = str(uuid.uuid4())
    request.state.session_id = (request.headers.get("X-Session-ID", "UNKNOWN"))
    request.state.ip_address = request.client.host
    request.state.user_agent = request.headers.get("User-Agent", "UNKNOWN")
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    return response