from abc import ABC, abstractmethod


class BaseProvider(ABC):

    @abstractmethod
    async def chat(self, message: str) -> str:
        raise NotImplementedError