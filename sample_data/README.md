# 🛰️ SamyamLM-V1 Sample Dataset & Testing Manifest

This directory contains sample geospatial references and testing manifests for running quick zero-shot object detection and spatial reasoning benchmarks with SamyamLM-V1.

### Quick Benchmark Evaluation
```bash
python python/samyam_lm_multimodal/eval_benchmark.py --demo
```

### Run Python PyTest Suite
```bash
python -m pytest python/tests -v
```

### Auto-Setup Model Weights
```bash
python python/samyam_lm_multimodal/download_weights.py
```
