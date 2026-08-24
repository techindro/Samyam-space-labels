import os
import sys
from unittest.mock import MagicMock, patch

curr_dir = os.path.dirname(os.path.abspath(__file__))
python_dir = os.path.abspath(os.path.join(curr_dir, ".."))
app_dir = os.path.abspath(os.path.join(python_dir, "app"))

for p in [app_dir, python_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from PIL import Image
except ImportError:
    Image = MagicMock()

import pytest
from fastapi.testclient import TestClient

try:
    import ai_models
except ImportError:
    ai_models = None

try:
    import main as app_module
except ImportError:
    import app.main as app_module

app = app_module.app
ai_engine = getattr(app_module, "ai_engine", None)


def test_api_health_endpoint():
    # Direct function test
    res = app_module.health_check()
    assert res["status"] == "online"
    assert "SamyamLM FastAPI Engine" in res["service"]
    assert isinstance(res["models_loaded"], list)

    # TestClient test
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "SamyamLM FastAPI Engine" in data["service"]


def test_prelabel_clip_endpoint_structure():
    mock_ann = [
        {
            "id": "ann_1",
            "label": "airplane",
            "confidence": 0.92,
            "bbox": {"x": 100.0, "y": 150.0, "w": 50.0, "h": 50.0}
        }
    ]
    if ai_engine:
        ai_engine.detect_objects_zero_shot = MagicMock(return_value=mock_ann)
    if ai_models and hasattr(ai_models, "ai_engine"):
        ai_models.ai_engine.detect_objects_zero_shot = MagicMock(return_value=mock_ann)

    with TestClient(app) as client:
        payload = {
            "image_url": "https://example.com/satellite_demo.jpg",
            "candidate_labels": ["airplane", "runway"],
            "confidence_threshold": 0.4
        }
        response = client.post("/api/v1/prelabel/clip", json=payload)
        assert response.status_code == 200
        res_json = response.json()
        assert res_json["image_url"] == payload["image_url"]
        assert len(res_json["annotations"]) >= 1
        assert res_json["annotations"][0]["label"] == "airplane"
        assert res_json["annotations"][0]["bbox"]["w"] == 50.0


def test_isro_fetch_endpoint():
    with TestClient(app) as client:
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
