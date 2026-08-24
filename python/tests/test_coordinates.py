import os
import sys

curr_dir = os.path.dirname(os.path.abspath(__file__))
python_dir = os.path.abspath(os.path.join(curr_dir, ".."))
samyam_lm_dir = os.path.abspath(os.path.join(python_dir, "samyam_lm_multimodal"))

for p in [samyam_lm_dir, python_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

import pytest
try:
    from samyam_lm_multimodal.eval_benchmark import compute_iou, evaluate_detections
except ImportError:
    from eval_benchmark import compute_iou, evaluate_detections



def test_compute_iou_identical_boxes():
    box = [0.1, 0.1, 0.5, 0.5]
    iou = compute_iou(box, box)
    assert abs(iou - 1.0) < 0.001


def test_compute_iou_disjoint_boxes():
    box1 = [0.0, 0.0, 0.2, 0.2]
    box2 = [0.5, 0.5, 0.8, 0.8]
    iou = compute_iou(box1, box2)
    assert iou == 0.0


def test_compute_iou_partial_overlap():
    box1 = [0.0, 0.0, 0.4, 0.4]
    box2 = [0.2, 0.2, 0.4, 0.4]
    iou = compute_iou(box1, box2)
    assert abs(iou - 0.25) < 0.001



def test_evaluate_detections_perfect_match():
    gts = [
        {"label": "airplane", "bbox": [0.1, 0.1, 0.3, 0.3]},
        {"label": "runway", "bbox": [0.4, 0.0, 0.6, 1.0]}
    ]
    preds = [
        {"label": "airplane", "bbox": [0.1, 0.1, 0.3, 0.3], "confidence": 0.95},
        {"label": "runway", "bbox": [0.4, 0.0, 0.6, 1.0], "confidence": 0.98}
    ]
    res = evaluate_detections(gts, preds, iou_threshold=0.5)
    assert res["tp"] == 2
    assert res["fp"] == 0
    assert res["fn"] == 0
    assert res["precision"] == 1.0
    assert res["recall"] == 1.0
    assert res["f1_score"] == 1.0


def test_evaluate_detections_mismatch_label():
    gts = [{"label": "airplane", "bbox": [0.1, 0.1, 0.3, 0.3]}]
    preds = [{"label": "building", "bbox": [0.1, 0.1, 0.3, 0.3], "confidence": 0.9}]
    res = evaluate_detections(gts, preds, iou_threshold=0.5)
    assert res["tp"] == 0
    assert res["fp"] == 1
    assert res["fn"] == 1
    assert res["precision"] == 0.0
