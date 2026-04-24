import base64
import io
import json

from groq import Groq
from PIL import Image

from app.config import settings

_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


def _image_to_b64(image: Image.Image) -> str:
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue()).decode()


def _vision_request(image: Image.Image, prompt: str) -> str:
    client = Groq(api_key=settings.groq_api_key)
    response = client.chat.completions.create(
        model=_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{_image_to_b64(image)}"},
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()


class MLService:
    def load_models(self):
        print("Groq vision API ready (no local models to load).")

    def detect_objects(self, image: Image.Image) -> list:
        """Return a list of detected objects using Groq vision."""
        prompt = (
            "List the objects visible in this image. "
            "Respond ONLY with a JSON array of objects in this format, no extra text: "
            '[{"label": "dog", "confidence": 0.95}, {"label": "chair", "confidence": 0.87}]'
        )
        try:
            raw = _vision_request(image, prompt)
            # Extract JSON array from the response
            start, end = raw.find("["), raw.rfind("]") + 1
            objects = json.loads(raw[start:end]) if start != -1 else []
            return [
                {
                    "label": o.get("label", "unknown"),
                    "confidence": round(float(o.get("confidence", 0.9)), 3),
                    "bbox": [],
                }
                for o in objects
            ]
        except Exception as e:
            print(f"Object detection error: {e}")
            return []

    def generate_caption(self, image: Image.Image) -> str:
        """Generate a natural language caption using Groq vision."""
        return _vision_request(
            image,
            "Describe this image in one clear, concise sentence suitable for a visually impaired person.",
        )

    def answer_question(self, image: Image.Image, question: str) -> str:
        """Answer a question about the image using Groq vision."""
        return _vision_request(image, question)


# Singleton
ml_service = MLService()
