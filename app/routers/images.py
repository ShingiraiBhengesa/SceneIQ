import io
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth_middleware import get_current_user_id
from app.models.analysis_history import AnalysisHistory
from app.schemas.image import AnalyzeResponse, AskRequest, AskResponse, HistoryResponse
from app.services.ml_service import ml_service

router = APIRouter()

UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(
    file: UploadFile = File(...),
    current_user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Accept an image, run object detection + captioning, store results, return."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, and WebP images are supported",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum size is 10MB",
        )

    image = Image.open(io.BytesIO(contents)).convert("RGB")

    objects = ml_service.detect_objects(image)
    caption = ml_service.generate_caption(image)

    analysis = AnalysisHistory(
        user_id=current_user_id,
        image_filename=file.filename or "upload.jpg",
        caption=caption,
        objects_detected=objects,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Save image to disk so the /ask endpoint can run VQA against it
    image_path = UPLOADS_DIR / f"{analysis.id}.jpg"
    image.save(image_path, format="JPEG")

    return {
        "image_id": str(analysis.id),
        "caption": caption,
        "objects": objects,
        "image_width": image.width,
        "image_height": image.height,
    }


@router.post("/ask", response_model=AskResponse)
async def ask_question(
    request: AskRequest,
    current_user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Answer a question about a previously analyzed image using its stored caption."""
    analysis = db.query(AnalysisHistory).filter(
        AnalysisHistory.id == request.image_id,
        AnalysisHistory.user_id == current_user_id,
    ).first()

    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    image_path = UPLOADS_DIR / f"{request.image_id}.jpg"
    if not image_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image file not found. Please re-upload and analyze the image.",
        )

    image = Image.open(image_path).convert("RGB")
    answer = ml_service.answer_question(image, request.question)

    return {"answer": answer}


@router.post("/analyze-and-ask")
async def analyze_and_ask(
    file: UploadFile = File(...),
    question: str = "",
    current_user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Analyze an image and optionally answer a question about it in one request."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, and WebP images are supported",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum size is 10MB",
        )

    image = Image.open(io.BytesIO(contents)).convert("RGB")

    objects = ml_service.detect_objects(image)
    caption = ml_service.generate_caption(image)

    answer = None
    if question.strip():
        answer = ml_service.answer_question(image, question)

    return {
        "caption": caption,
        "objects": objects,
        "answer": answer,
        "image_width": image.width,
        "image_height": image.height,
    }


@router.get("/history", response_model=list[HistoryResponse])
async def get_history(
    current_user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return the 50 most recent analyses for the current user."""
    return (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.user_id == current_user_id)
        .order_by(AnalysisHistory.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/metrics")
async def get_model_metrics():
    """Return documented model performance benchmarks."""
    return {
        "object_detection": {
            "model": "YOLOv8n",
            "dataset": "COCO val2017",
            "mAP50": 0.373,
            "mAP50_95": 0.225,
            "categories": 80,
        },
        "captioning": {
            "model": "BLIP-base",
            "dataset": "COCO Captions",
            "bleu4": 0.394,
            "cider": 1.336,
        },
        "vqa": {
            "model": "BLIP-VQA-base",
            "dataset": "VQAv2",
            "accuracy": 0.7846,
        },
    }
