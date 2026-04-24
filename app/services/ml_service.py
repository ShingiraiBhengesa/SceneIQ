import io

import requests
from PIL import Image

from app.config import settings

_BASE_URL = "https://api-inference.huggingface.co/models"
_DETECTION_MODEL = "facebook/detr-resnet-50"
_CAPTION_MODEL = "Salesforce/blip-image-captioning-base"
_VQA_MODEL = "Salesforce/blip-vqa-base"


def _image_to_bytes(image: Image.Image) -> bytes:
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    return buf.getvalue()


def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.hf_token}"}


class MLService:
    def load_models(self):
        """No local models to load — using HF Inference API."""
        print("HF Inference API ready (no local models to load).")

    def detect_objects(self, image: Image.Image) -> list:
        """Run object detection via HF Inference API."""
        response = requests.post(
            f"{_BASE_URL}/{_DETECTION_MODEL}",
            headers=_headers(),
            data=_image_to_bytes(image),
            timeout=30,
        )
        response.raise_for_status()
        return [
            {
                "label": r["label"],
                "confidence": round(r["score"], 3),
                "bbox": [
                    r["box"]["xmin"],
                    r["box"]["ymin"],
                    r["box"]["xmax"],
                    r["box"]["ymax"],
                ],
            }
            for r in response.json()
        ]

    def generate_caption(self, image: Image.Image) -> str:
        """Generate a natural language caption via HF Inference API."""
        response = requests.post(
            f"{_BASE_URL}/{_CAPTION_MODEL}",
            headers=_headers(),
            data=_image_to_bytes(image),
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and result:
            return result[0].get("generated_text", "")
        return str(result)

    def answer_question(self, image: Image.Image, question: str) -> str:
        """Answer a visual question via HF Inference API."""
        response = requests.post(
            f"{_BASE_URL}/{_VQA_MODEL}",
            headers={**_headers(), "Content-Type": "application/json"},
            json={
                "inputs": {
                    "image": list(_image_to_bytes(image)),
                    "question": question,
                }
            },
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and result:
            return result[0].get("answer", "")
        return str(result)


# Singleton
ml_service = MLService()
