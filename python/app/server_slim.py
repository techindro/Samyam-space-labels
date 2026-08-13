"""
SamyamLM Backend Engine - FastAPI Server (Slim/Local Mode)
Supports OWL-ViT zero-shot pre-labeling, BLIP Hindi VQA, and Data Anonymization.
Geospatial (GDAL/Rasterio) and Kafka services are mocked in this mode.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time
import os

app = FastAPI(
    title="SamyamLM AI Engine API",
    description="Multimodal Data Labeling & AI Model Serving Engine for Space, Defense & Indic AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Models ──────────────────────────────────────────────────────────

class PrelabelRequest(BaseModel):
    image_url: str = Field(..., example="https://images.unsplash.com/photo-1518770660439-4636190af475")
    candidate_labels: List[str] = Field(
        default=["Satellite", "Building", "Road", "Pothole", "Auto-rickshaw", "Cattle", "Orbital Debris"],
    )
    confidence_threshold: float = Field(default=0.1, ge=0.0, le=1.0)

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
    model: str = "OWL-ViT-Base-Patch32"
    inference_time_ms: float
    annotations: List[PrelabelAnnotation]

class HindiVqaRequest(BaseModel):
    image_url: str
    question_hindi: str = Field(..., example="क्या इस चित्र में सड़क है?")

class HindiVqaResponse(BaseModel):
    question_hindi: str
    answer_hindi: str
    confidence: float
    model: str = "BLIP-VQA-Base + deep-translator"

class AnonymizeRequest(BaseModel):
    image_url: str

class AnonymizeResponse(BaseModel):
    original_url: str
    anonymized_image_base64: str
    status: str

# ── Load AI Engine ───────────────────────────────────────────────────────────
from ai_models import ai_engine
from anonymize_service import anonymize_engine

# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    import torch
    return {
        "status": "online",
        "service": "SamyamLM FastAPI Engine (Slim Mode)",
        "version": "1.0.0",
        "models_available": ["OWL-ViT-Base-Patch32", "BLIP-VQA-Base", "Anonymization-OpenCV"],
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "mode": "slim (no kafka/gdal)"
    }

@app.post("/api/v1/prelabel/clip", response_model=PrelabelResponse)
async def run_clip_prelabel(req: PrelabelRequest):
    """
    Runs OWL-ViT zero-shot pre-labeling on provided satellite or ground camera image.
    Generates real bounding boxes and classification labels based on text prompts.
    """
    start_time = time.time()
    
    raw_annotations = ai_engine.detect_objects_zero_shot(
        image_url=req.image_url, 
        candidate_labels=req.candidate_labels, 
        threshold=req.confidence_threshold
    )
    
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
        inference_time_ms=inference_ms,
        annotations=annotations
    )

@app.post("/api/v1/indic/vqa", response_model=HindiVqaResponse)
async def run_hindi_vqa(req: HindiVqaRequest):
    """
    Runs Hindi Visual Question Answering using BLIP-VQA and translation pipeline.
    """
    hindi_answer = ai_engine.answer_hindi_question(
        image_url=req.image_url, 
        hindi_question=req.question_hindi
    )
    return HindiVqaResponse(
        question_hindi=req.question_hindi,
        answer_hindi=hindi_answer,
        confidence=0.95,
        model="BLIP-VQA-Base + deep-translator"
    )

@app.post("/api/v1/anonymize", response_model=AnonymizeResponse)
async def run_data_anonymization(req: AnonymizeRequest):
    """
    Detects and blurs faces and license plates in the provided image.
    """
    result_base64 = anonymize_engine.process_image(req.image_url)
    if not result_base64:
        raise HTTPException(status_code=500, detail="Anonymization processing failed")
    return AnonymizeResponse(
        original_url=req.image_url,
        anonymized_image_base64=result_base64,
        status="success"
    )

@app.get("/api/v1/geospatial/isro")
async def fetch_isro_satellite_tile(lat: float = 12.9716, lon: float = 77.5946, band: str = "VV"):
    """Mocked ISRO Resourcesat-2A API (requires GDAL for full version)."""
    tile_id = f"ISRO_R2A_{int(lat*100)}_{int(lon*100)}_{band}"
    return {
        "tile_id": tile_id,
        "satellite": "ISRO Resourcesat-2A (LISS-4 sensor)",
        "resolution": "10m sub-meter multispectral",
        "band": band,
        "tile_url": f"https://bhuvan.nrsc.gov.in/tilecache/r2a/{tile_id}.tif",
        "note": "Full live data requires GDAL — mocked in slim mode"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server_slim:app", host="0.0.0.0", port=8000, reload=True)
