from pydantic import BaseModel


class ChatData(BaseModel):
    answer: str


class ChatResponse(BaseModel):
    success: bool
    message: str
    data: ChatData
