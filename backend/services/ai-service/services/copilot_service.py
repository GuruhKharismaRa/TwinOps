from providers.echo_provider import EchoProvider


class CopilotService:

    def __init__(self):
        self.provider = EchoProvider()

    async def chat(self, message: str):
        return await self.provider.chat(message)