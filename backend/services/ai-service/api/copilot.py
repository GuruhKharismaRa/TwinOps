from fastapi import APIRouter

from schemas.chat_request import ChatRequest
from schemas.chat_response import ChatData, ChatResponse

from services.copilot_service import CopilotService

router = APIRouter(
    prefix="/copilot",
    tags=["Copilot"],
)

service = CopilotService()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    answer = await service.chat(request.message)

    return ChatResponse(
        success=True,
        message="Success",
        data=ChatData(
            answer=answer
        ),
    )