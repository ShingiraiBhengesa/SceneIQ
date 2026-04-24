import io

from huggingface_hub import InferenceClient
from PIL import Image

from app.config import settings

_DETECTION_MODEL = "facebook/detr-resnet-50"
_CAPTION_MODEL = "Salesforce/blip-image-captioning-base"
_VQA_MODEL = "Salesforce/blip-vqa-base"


def _image_to_bytes(image: Image.Image) -> bytes:
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    return buf.getvalue()


class MLService:
    def __init__(self):
        self._client: InferenceClient | None = None

    def load_models(self):
        """Initialise the HF Inference client. No local weights are downloaded."""
        print("Initialising Hugging Face Inference client...")
        self._client = InferenceClient(token=settings.hf_token or None)
        print("HF Inference client ready.")

    @property
    def client(self) -> InferenceClient:
        if self._client is None:
            self._client = InferenceClient(token=settings.hf_token or None)
        return self._client

    def detect_objects(self, image: Image.Image) -> list:
        """Run object detection via HF Inference API."""
        results = self.client.object_detection(_image_to_bytes(image), model=_DETECTION_MODEL)
        return [
            {
                "label": r.label,
                "confidence": round(r.score, 3),
                "bbox": [r.box.xmin, r.box.ymin, r.box.xmax, r.box.ymax],
            }
            for r in results
        ]

    def generate_caption(self, image: Image.Image) -> str:
        """Generate a natural language caption via HF Inference API."""
        result = self.client.image_to_text(_image_to_bytes(image), model=_CAPTION_MODEL)
        # result is a string or ImageToTextOutput depending on hub version
        return result.generated_text if hasattr(result, "generated_text") else str(result)

    def answer_question(self, image: Image.Image, question: str) -> str:
        """Answer a visual question via HF Inference API."""
        result = self.client.visual_question_answering(
            _image_to_bytes(image), question=question, model=_VQA_MODEL
        )
        # Returns a list of answers ranked by score; take the top one
        if isinstance(result, list) and result:
            return result[0].answer
        return str(result)


# Singleton
ml_service = MLService()
