import os
import sys
from unittest.mock import MagicMock, patch

# Ensure python/app and python are in sys.path
curr_dir = os.path.dirname(os.path.abspath(__file__))
python_dir = os.path.abspath(os.path.join(curr_dir, ".."))
app_dir = os.path.abspath(os.path.join(python_dir, "app"))

for p in [app_dir, python_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Ensure PIL Image is loaded into namespace before app modules are imported
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
    from app.main import app, ai_engine
except ImportError:
    from main import app, ai_engine



def test_api_health_endpoint():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "SamyamLM FastAPI Engine" in data["service"]
    assert isinstance(data["models_loaded"], list)


def test_prelabel_clip_endpoint_structure():
    mock_ann = [
        {
            "id": "ann_1",
            "label": "airplane",
            "confidence": 0.92,
            "bbox": {"x": 100.0, "y": 150.0, "w": 50.0, "h": 50.0}
        }
    ]
    with patch.object(ai_engine, "detect_objects_zero_shot", return_value=mock_ann):
        if ai_models and hasattr(ai_models, "ai_engine"):
            ai_models.ai_engine.detect_objects_zero_shot = MagicMock(return_value=mock_ann)
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
        assert len(res_json["annotations"]) >= 1
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
