from providers.base_provider import BaseProvider


class EchoProvider(BaseProvider):

    async def chat(self, message: str) -> str:
        return f"You said: {message}"