import torch
from PIL import Image
import urllib.request
import io
import time

try:
    from transformers import OwlViTProcessor, OwlViTForObjectDetection, BlipProcessor, BlipForQuestionAnswering
    from deep_translator import GoogleTranslator
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

from grounding_dino import grounding_dino_engine
from sam_inference import sam_engine
from audio_inference import whisper_engine, vggish_engine


class AIEngine:
    def __init__(self):
        self.owlvit_processor = None
        self.owlvit_model = None
        self.blip_processor = None
        self.blip_model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.grounding_dino = grounding_dino_engine
        self.sam = sam_engine
        self.whisper = whisper_engine
        self.vggish = vggish_engine

    def _load_owlvit(self):
        if self.owlvit_model is None and TRANSFORMERS_AVAILABLE:
            print(f"Loading OWL-ViT on {self.device}...")
            self.owlvit_processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
            self.owlvit_model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32").to(self.device)

    def _load_blip(self):
        if self.blip_model is None and TRANSFORMERS_AVAILABLE:
            print(f"Loading BLIP on {self.device}...")
            self.blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
            self.blip_model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base").to(self.device)

    def _fetch_image(self, url: str) -> Image.Image:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        return Image.open(io.BytesIO(response.read())).convert("RGB")

    def detect_objects_zero_shot(self, image_url: str, candidate_labels: list, threshold: float = 0.1):
        if not TRANSFORMERS_AVAILABLE:
            return [{"id": f"mock-{i}", "label": l, "confidence": 0.9, "bbox": {"x": 50 + i * 100, "y": 50 + i * 50, "w": 120, "h": 100}} for i, l in enumerate(candidate_labels)]
            
        self._load_owlvit()
        image = self._fetch_image(image_url)
        
        texts = [candidate_labels]
        inputs = self.owlvit_processor(text=texts, images=image, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.owlvit_model(**inputs)
            
        target_sizes = torch.Tensor([image.size[::-1]]).to(self.device)
        results = self.owlvit_processor.post_process_object_detection(outputs=outputs, target_sizes=target_sizes, threshold=threshold)
        
        annotations = []
        i = 0
        text = texts[i]
        boxes, scores, labels = results[i]["boxes"], results[i]["scores"], results[i]["labels"]
        
        for box, score, label in zip(boxes, scores, labels):
            box = [round(i, 2) for i in box.tolist()]
            x1, y1, x2, y2 = box
            annotations.append({
                "id": f"owl-{len(annotations)}",
                "label": text[label.item()],
                "confidence": round(score.item(), 3),
                "bbox": {"x": x1, "y": y1, "w": x2 - x1, "h": y2 - y1}
            })
            
        return annotations

    def answer_hindi_question(self, image_url: str, hindi_question: str):
        if not TRANSFORMERS_AVAILABLE:
            return "यह एक डेमो उत्तर है। (This is a demo answer.)"
            
        self._load_blip()
        image = self._fetch_image(image_url)
        
        english_question = GoogleTranslator(source='hi', target='en').translate(hindi_question)
        print(f"Translated Q: {english_question}")
        
        inputs = self.blip_processor(image, english_question, return_tensors="pt").to(self.device)
        with torch.no_grad():
            out = self.blip_model.generate(**inputs)
            english_answer = self.blip_processor.decode(out[0], skip_special_tokens=True)
            
        print(f"English Ans: {english_answer}")
        hindi_answer = GoogleTranslator(source='en', target='hi').translate(english_answer)
        return hindi_answer


# Singleton instance
ai_engine = AIEngine()
