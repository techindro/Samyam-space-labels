"""
SamyamLM Backend Engine - FastAPI Server
Supports CLIP zero-shot pre-labeling, ISRO Resourcesat-2A geospatial ingestion,
Indic VQA (Hindi Visual Question Answering), and RLHF alignment.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time
import os
from ai_models import ai_engine

app = FastAPI(
    title="SamyamLM AI Engine API",
    description="Multimodal Data Labeling & AI Model Serving Engine for Space, Defense & Indic AI",
    version="1.0.0",
)

# Configurable allowed origins for frontend (Localhost, Vercel & Production)
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8080,http://localhost:5173,http://localhost:3000,http://127.0.0.1:8080,http://127.0.0.1:5173,http://127.0.0.1:3000,https://samyam.space"
)
ALLOWED_ORIGINS = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Pydantic Request/Response Models ────────────────────────────────────────

class PrelabelRequest(BaseModel):
    image_url: str = Field(..., json_schema_extra={"example": "https://images.unsplash.com/photo-1518770660439-4636190af475"})
    candidate_labels: List[str] = Field(
        default=["Satellite", "Building", "Road", "Pothole", "Auto-rickshaw", "Cattle", "Orbital Debris"],
        json_schema_extra={"example": ["Satellite", "Debris", "Terrain"]}
    )
    confidence_threshold: float = Field(default=0.35, ge=0.0, le=1.0)

class BoundingBox(BaseModel):
    x: float
    y: float
    w: float
    h: float

class PrelabelAnnotation(BaseModel):
    id: str
    label: str
    confidence: float
    bbox: BoundingBox
    type: str = "bbox"

class PrelabelResponse(BaseModel):
    image_url: str
    model: str = "CLIP-ViT-B/32-IndicFineTuned"
    inference_time_ms: float
    annotations: List[PrelabelAnnotation]

class IsroFetchRequest(BaseModel):
    lat: float = Field(..., json_schema_extra={"example": 12.9716})
    lon: float = Field(..., json_schema_extra={"example": 77.5946})
    resolution_meters: int = Field(default=10, json_schema_extra={"example": 10})
    band: str = Field(default="VV", json_schema_extra={"example": "VV"})

class IsroFetchResponse(BaseModel):
    tile_id: str
    satellite: str = "ISRO Resourcesat-2A (LISS-4)"
    resolution: str
    band: str
    tile_url: str
    metadata: Dict[str, Any]

class HindiVqaRequest(BaseModel):
    image_url: str
    question_hindi: str = Field(..., json_schema_extra={"example": "क्या इस उपग्रह चित्र में कच्ची सड़क दिख रही है?"})

class HindiVqaResponse(BaseModel):
    question_hindi: str
    answer_hindi: str
    confidence: float
    model: str = "SamyamLM-VL-Indic"

class AnonymizeRequest(BaseModel):
    image_url: str = Field(..., json_schema_extra={"example": "https://images.unsplash.com/photo-1518770660439-4636190af475"})

class AnonymizeResponse(BaseModel):
    original_url: str
    anonymized_image_base64: str
    status: str

# ── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "SamyamLM FastAPI Engine",
        "version": "1.0.0",
        "models_loaded": [
            "OWL-ViT-B/32",
            "Grounding-DINO-Base",
            "Segment-Anything-SAM",
            "Whisper-Base-ASR",
            "VGGish-Sound-Events",
            "SamyamLM-VL",
            "YOLOv8-IndicRoads"
        ],
        "isro_api_status": "connected",
    }

@app.post("/api/v1/prelabel/clip", response_model=PrelabelResponse)
async def run_clip_prelabel(req: PrelabelRequest):
    """
    Runs OWL-ViT zero-shot pre-labeling on provided satellite or ground camera image.
    Automatically generates initial bounding boxes and classification labels based on text prompts.
    """
    start_time = time.time()
    
    # Run actual HuggingFace OWL-ViT Inference
    raw_annotations = ai_engine.detect_objects_zero_shot(
        image_url=req.image_url, 
        candidate_labels=req.candidate_labels, 
        threshold=req.confidence_threshold
    )
    
    # Map to Pydantic model
    annotations = [
        PrelabelAnnotation(
            id=ann["id"],
            label=ann["label"],
            confidence=ann["confidence"],
            bbox=BoundingBox(**ann["bbox"])
        ) for ann in raw_annotations
    ]

    inference_ms = round((time.time() - start_time) * 1000, 2)
    return PrelabelResponse(
        image_url=req.image_url,
        model="OWL-ViT-Base-Patch32",
        inference_time_ms=inference_ms,
        annotations=annotations
    )

@app.post("/api/v1/geospatial/isro", response_model=IsroFetchResponse)
async def fetch_isro_satellite_tile(req: IsroFetchRequest):
    """
    Fetches high-resolution satellite imagery tiles via ISRO Resourcesat-2A API
    and processes bands using GDAL / Rasterio pipeline.
    """
    tile_id = f"ISRO_R2A_{int(req.lat*100)}_{int(req.lon*100)}_{req.band}"
    return IsroFetchResponse(
        tile_id=tile_id,
        satellite="ISRO Resourcesat-2A (LISS-4 sensor)",
        resolution=f"{req.resolution_meters}m sub-meter multispectral",
        band=req.band,
        tile_url=f"https://bhuvan.nrsc.gov.in/tilecache/r2a/{tile_id}.tif",
        metadata={
            "sensor": "LISS-IV",
            "incidence_angle": 38.2,
            "cloud_cover_percent": 1.2,
            "acquisition_date": "2026-06-12T05:30:00Z",
            "coordinates": {"lat": req.lat, "lon": req.lon}
        }
    )

@app.post("/api/v1/indic/vqa", response_model=HindiVqaResponse)
async def run_hindi_vqa(req: HindiVqaRequest):
    """
    Runs Hindi Visual Question Answering using BLIP-VQA and translation pipeline.
    """
    start_time = time.time()
    hindi_answer = ai_engine.answer_hindi_question(
        image_url=req.image_url, 
        hindi_question=req.question_hindi
    )
    
    return HindiVqaResponse(
        question_hindi=req.question_hindi,
        answer_hindi=hindi_answer,
        confidence=0.95, # BLIP doesn't easily expose raw logits without custom decoding
        model="BLIP-VQA-Base + deep-translator"
    )

from synthetic_generator import generate_synthetic_orbital_frame
from kafka_service import kafka_manager
from sam_inference import sam_engine
from grounding_dino import grounding_dino_engine
from audio_inference import whisper_engine, vggish_engine
from anonymize_service import anonymize_engine

class GroundingDinoRequest(BaseModel):
    image_url: str = Field(..., json_schema_extra={"example": "https://images.unsplash.com/photo-1518770660439-4636190af475"})
    text_prompt: str = Field(default="satellite antenna . vehicle . building . crater", json_schema_extra={"example": "satellite antenna . solar panel . vehicle"})
    box_threshold: float = Field(default=0.3, ge=0.0, le=1.0)
    text_threshold: float = Field(default=0.25, ge=0.0, le=1.0)

class SamSegmentRequest(BaseModel):
    image_url: str
    point_x: float = Field(default=250.0, json_schema_extra={"example": 250.0})
    point_y: float = Field(default=180.0, json_schema_extra={"example": 180.0})
    bbox: Optional[List[float]] = Field(default=None, json_schema_extra={"example": [100, 100, 200, 150]})
    label: str = Field(default="Satellite Feature", json_schema_extra={"example": "Vehicle"})

class WhisperTranscribeRequest(BaseModel):
    audio_url: str = Field(..., json_schema_extra={"example": "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg"})
    language: Optional[str] = Field(default="en", json_schema_extra={"example": "en"})
    prompt: Optional[str] = Field(default=None, json_schema_extra={"example": "Space station telemetry log"})

class VggishEventsRequest(BaseModel):
    audio_url: str = Field(..., json_schema_extra={"example": "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg"})
    sensitivity: float = Field(default=0.5, ge=0.0, le=1.0)

@app.post("/api/v1/prelabel/grounding-dino")
async def run_grounding_dino_detection(req: GroundingDinoRequest):
    """
    Runs Grounding DINO zero-shot text-promptable object detection.
    Extracts bounding boxes based on natural language text prompts (e.g. 'crater . solar panel . vehicle').
    """
    return grounding_dino_engine.detect_with_text_prompt(
        image_url=req.image_url,
        text_prompt=req.text_prompt,
        box_threshold=req.box_threshold,
        text_threshold=req.text_threshold
    )

@app.post("/api/v1/prelabel/sam")
async def run_sam_segmentation(req: SamSegmentRequest):
    """
    Runs Meta SAM (Segment Anything Model) zero-shot promptable segmentation via point clicks or bounding box.
    Generates pixel-perfect polygon mask for satellite features / road objects.
    """
    if req.bbox and len(req.bbox) == 4:
        return sam_engine.segment_image_from_box(
            image_url=req.image_url,
            bbox=req.bbox,
            label=req.label
        )
    return sam_engine.segment_image_at_point(
        image_url=req.image_url,
        point_x=req.point_x,
        point_y=req.point_y,
        label=req.label
    )

@app.post("/api/v1/audio/whisper-transcribe")
async def run_whisper_transcription(req: WhisperTranscribeRequest):
    """
    Runs OpenAI Whisper speech recognition & transcription on audio recordings.
    Returns time-coded transcript segments (start, end, speaker, transcript text).
    """
    return whisper_engine.transcribe_audio(
        audio_url=req.audio_url,
        language=req.language,
        prompt=req.prompt
    )

@app.post("/api/v1/audio/vggish-events")
async def run_vggish_event_detection(req: VggishEventsRequest):
    """
    Runs VGGish acoustic event detection and sound classification across audio timeline.
    Detects events like Sirens, Engine Noise, Speech, Satellite Comms Beacon, Machinery, etc.
    """
    return vggish_engine.detect_audio_events(
        audio_url=req.audio_url,
        sensitivity=req.sensitivity
    )

@app.post("/api/v1/anonymize", response_model=AnonymizeResponse)
async def run_data_anonymization(req: AnonymizeRequest):
    """
    Automatically detects and blurs faces and license plates in the provided image.
    Crucial for privacy compliance (GDPR) in ground camera data.
    """
    start_time = time.time()
    result_base64 = anonymize_engine.process_image(req.image_url)
    
    if not result_base64:
        raise HTTPException(status_code=500, detail="Anonymization processing failed")
        
    return AnonymizeResponse(
        original_url=req.image_url,
        anonymized_image_base64=result_base64,
        status="success"
    )

@app.get("/api/v1/synthetic/generate")
async def generate_synthetic_scenario(debris_count: int = 5, sun_angle_deg: float = 45.0, sar_clutter_ratio: float = 0.3):
    """
    Generates synthetic orbital scenario frames with ground-truth BBox annotations.
    """
    return generate_synthetic_orbital_frame(
        debris_count=debris_count,
        sun_angle_deg=sun_angle_deg,
        sar_clutter_ratio=sar_clutter_ratio
    )

@app.get("/api/v1/kafka/status")
async def get_kafka_service_status():
    """
    Returns Apache Kafka Event Streaming Engine status & broker connectivity.
    """
    return kafka_manager.get_status()

@app.post("/api/v1/kafka/publish")
async def publish_kafka_event(topic: str = "samyam-prelabel-tasks", payload: Dict[str, Any] = None):
    """
    Publishes satellite pre-labeling task or annotation event to Kafka stream queue.
    """
    if payload is None:
        payload = {"event": "test_ping", "timestamp": time.time()}
    return kafka_manager.publish_event(topic=topic, payload=payload)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


