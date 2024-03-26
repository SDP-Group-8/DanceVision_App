from abc import abstractmethod, ABC

class Connector(ABC):

    @abstractmethod
    async def close(self, processes):
        pass
