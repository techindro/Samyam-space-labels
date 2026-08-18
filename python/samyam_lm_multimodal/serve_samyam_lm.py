"""
Samyam LM Multimodal — Production API Inference Server (FastAPI + Ollama)
Exposes HTTP REST API endpoints for image + text multimodal reasoning & spatial bounding box detection.
Connects to locally running Ollama "samyam-lm" model for real AI inference.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io
import base64
import httpx
import time
from PIL import Image
from typing import Optional, List, Dict, Any

# ─── Configuration ───────────────────────────────────────────────────────────
OLLAMA_BASE_URL = "http://localhost:11434"
SAMYAM_MODEL_NAME = "samyam-lm"
FALLBACK_MODEL_NAME = "moondream"  # Fallback if samyam-lm not yet created

app = FastAPI(
    title="Samyam LM Multimodal AI Engine",
    description="Multimodal Spatial Vision & Language API — Powered by Ollama",
    version="2.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Response Models ─────────────────────────────────────────────────────────
class ModelStatusResponse(BaseModel):
    model_name: str
    status: str
    capabilities: List[str]
    backend: str
    gpu: str


class AnalyzeResponse(BaseModel):
    model: str
    prompt: str
    has_image: bool
    image_dimensions: Optional[Dict[str, int]]
    response: str
    execution_latency_ms: int


# ─── Helper: Check which model is available ──────────────────────────────────
async def get_available_model() -> str:
    """Check if samyam-lm exists, otherwise fallback to moondream."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5.0)
            if resp.status_code == 200:
                models = [m["name"] for m in resp.json().get("models", [])]
                if SAMYAM_MODEL_NAME in models or f"{SAMYAM_MODEL_NAME}:latest" in models:
                    return SAMYAM_MODEL_NAME
                for m in models:
                    if m.startswith(SAMYAM_MODEL_NAME):
                        return m
                if FALLBACK_MODEL_NAME in models or f"{FALLBACK_MODEL_NAME}:latest" in models:
                    return FALLBACK_MODEL_NAME
                for m in models:
                    if m.startswith(FALLBACK_MODEL_NAME):
                        return m
    except Exception:
        pass
    return SAMYAM_MODEL_NAME  # default, let Ollama handle the error


# ─── Endpoints ───────────────────────────────────────────────────────────────
@app.get("/health", response_model=ModelStatusResponse)
async def health_check():
    """Check if Ollama and Samyam LM are online."""
    model_name = await get_available_model()
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5.0)
            ollama_online = resp.status_code == 200
    except Exception:
        ollama_online = False

    return {
        "model_name": model_name,
        "status": "online" if ollama_online else "ollama_offline",
        "capabilities": [
            "Spatial Vision",
            "Satellite Segmentation",
            "Object Detection",
            "VQA Reasoning",
            "Multimodal Analysis"
        ],
        "backend": "Ollama (local GPU)",
        "gpu": "RTX 4050 (6GB VRAM)"
    }


@app.post("/api/v1/analyze", response_model=AnalyzeResponse)
async def analyze_multimodal(
    prompt: str = Form("Analyze this image for spatial features and annotations."),
    image: Optional[UploadFile] = File(None)
):
    """
    Send image + text prompt to Samyam LM via Ollama for real multimodal inference.
    """
    start_time = time.time()

    try:
        image_b64 = None
        pil_image = None
        image_dims = None

        # 1. Process uploaded image
        if image:
            image_bytes = await image.read()
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_dims = {"width": pil_image.width, "height": pil_image.height}
            image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        # 2. Build Ollama API request
        model_name = await get_available_model()

        ollama_payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
        }

        if image_b64:
            ollama_payload["images"] = [image_b64]

        # 3. Call Ollama API
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json=ollama_payload,
                timeout=120.0  # Vision models can take time
            )

            if resp.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail=f"Ollama returned status {resp.status_code}: {resp.text}"
                )

            result = resp.json()

        elapsed_ms = int((time.time() - start_time) * 1000)

        return {
            "model": f"Samyam LM ({model_name})",
            "prompt": prompt,
            "has_image": pil_image is not None,
            "image_dimensions": image_dims,
            "response": result.get("response", ""),
            "execution_latency_ms": elapsed_ms,
        }

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running. Start it with: ollama serve"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/chat")
async def chat_multimodal(
    prompt: str = Form(...),
    image: Optional[UploadFile] = File(None),
    system_prompt: Optional[str] = Form(None)
):
    """
    Chat-style endpoint using Ollama /api/chat for multi-turn conversations.
    """
    start_time = time.time()

    try:
        image_b64 = None
        if image:
            image_bytes = await image.read()
            image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        model_name = await get_available_model()

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        user_message = {"role": "user", "content": prompt}
        if image_b64:
            user_message["images"] = [image_b64]
        messages.append(user_message)

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": model_name,
                    "messages": messages,
                    "stream": False,
                },
                timeout=120.0
            )

            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail=resp.text)

            result = resp.json()

        elapsed_ms = int((time.time() - start_time) * 1000)

        return {
            "model": f"Samyam LM ({model_name})",
            "response": result.get("message", {}).get("content", ""),
            "execution_latency_ms": elapsed_ms,
        }

    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Ollama is not running.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    print("=" * 60)
    print("  Samyam LM Multimodal — Production Server")
    print("  Backend: Ollama (Local GPU Inference)")
    print("  API Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
