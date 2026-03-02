import io

import torch
from PIL import Image
from transformers import BlipForConditionalGeneration, BlipForQuestionAnswering, BlipProcessor
from ultralytics import YOLO


class MLService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.yolo_model = None
        self.caption_processor = None
        self.caption_model = None
        self.vqa_processor = None
        self.vqa_model = None

    def load_models(self):
        """Call once at startup. Models are loaded into memory."""
        print("Loading YOLOv8 model...")
        self.yolo_model = YOLO("yolov8n.pt")  # nano model, ~6MB, 80 COCO categories

        print("Loading BLIP captioning model...")
        self.caption_processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )
        self.caption_model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        ).to(self.device)

        print("Loading BLIP VQA model...")
        self.vqa_processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
        self.vqa_model = BlipForQuestionAnswering.from_pretrained(
            "Salesforce/blip-vqa-base"
        ).to(self.device)

        print("All models loaded successfully!")

    def detect_objects(self, image: Image.Image) -> list:
        """Run YOLOv8 on an image. Returns list of detections."""
        results = self.yolo_model(image, verbose=False)
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append({
                    "label": result.names[int(box.cls[0])],
                    "confidence": round(float(box.conf[0]), 3),
                    "bbox": [round(float(c), 1) for c in box.xyxy[0].tolist()],
                    # bbox = [x1, y1, x2, y2] in pixel coordinates
                })
        return detections

    def generate_caption(self, image: Image.Image) -> str:
        """Generate a natural language caption for the image."""
        inputs = self.caption_processor(image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            output = self.caption_model.generate(**inputs, max_new_tokens=100)
        return self.caption_processor.decode(output[0], skip_special_tokens=True)

    def answer_question(self, image: Image.Image, question: str) -> str:
        """Answer a question about the image using BLIP VQA."""
        inputs = self.vqa_processor(image, question, return_tensors="pt").to(self.device)
        with torch.no_grad():
            output = self.vqa_model.generate(**inputs, max_new_tokens=50)
        return self.vqa_processor.decode(output[0], skip_special_tokens=True)


# Singleton — loaded once at startup via app.on_event("startup")
ml_service = MLService()
