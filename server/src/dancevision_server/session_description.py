from pydantic import BaseModel

class SessionDescription(BaseModel):
    type: str
    sdp: str
    host_id: str