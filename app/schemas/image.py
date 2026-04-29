from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ObjectDetection(BaseModel):
    label: str
    confidence: float
    bbox: list[float]  # [x1, y1, x2, y2] pixel coordinates


class AnalyzeResponse(BaseModel):
    image_id: str
    caption: str
    objects: list[ObjectDetection]
    image_width: int
    image_height: int


class AskRequest(BaseModel):
    image_id: str
    question: str


class AskResponse(BaseModel):
    answer: str


class HistoryResponse(BaseModel):
    id: UUID
    image_filename: Optional[str] = None
    caption: Optional[str] = None
    objects_detected: Optional[list] = None
    created_at: datetime

    class Config:
        from_attributes = True
