import os
import sys
from unittest.mock import MagicMock, patch

# Ensure python/app and python are in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../app")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Mock PIL Image before importing app modules
try:
    from PIL import Image
except ImportError:
    # Fallback mock if Pillow is not installed
    Image = MagicMock()

import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_api_health_endpoint():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "SamyamLM FastAPI Engine" in data["service"]
    assert isinstance(data["models_loaded"], list)


def test_prelabel_clip_endpoint_structure():
    with patch("app.main.ai_engine") as mock_ai:
        mock_ai.detect_objects_zero_shot.return_value = [
            {
                "id": "ann_1",
                "label": "airplane",
                "confidence": 0.92,
                "bbox": {"x": 100.0, "y": 150.0, "w": 50.0, "h": 50.0}
            }
        ]
        client = TestClient(app)
        payload = {
            "image_url": "https://example.com/satellite_demo.jpg",
            "candidate_labels": ["airplane", "runway"],
            "confidence_threshold": 0.4
        }
        response = client.post("/api/v1/prelabel/clip", json=payload)
        assert response.status_code == 200
        res_json = response.json()
        assert res_json["image_url"] == payload["image_url"]
        assert len(res_json["annotations"]) == 1
        assert res_json["annotations"][0]["label"] == "airplane"
        assert res_json["annotations"][0]["bbox"]["w"] == 50.0


def test_isro_fetch_endpoint():
    client = TestClient(app)
    payload = {
        "lat": 12.9716,
        "lon": 77.5946,
        "resolution_meters": 10,
        "band": "VV"
    }
    response = client.post("/api/v1/geospatial/isro", json=payload)
    assert response.status_code == 200
    res_json = response.json()
    assert "ISRO_R2A_" in res_json["tile_id"]
    assert "ISRO Resourcesat-2A" in res_json["satellite"]
