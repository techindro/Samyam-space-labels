"""
Samyam LM Multimodal — Dataset Preparation Pipeline
Formats images, spatial coordinates, and visual QA pairs into standard HuggingFace / LLaVA / Qwen-VL JSONL datasets.
"""

import json
import os
from typing import List, Dict, Any

def create_samyam_vqa_sample(
    image_path: str,
    prompt: str,
    answer: str,
    bounding_boxes: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Creates a single Multimodal Vision-Language conversation sample.
    Supports spatial coordinate formatting e.g. [ymin, xmin, ymax, xmax].
    """
    system_instruction = (
        "You are Samyam LM, an advanced Spatial Vision AI developed by Samyam Space Labels. "
        "Analyze images, detect objects with precise coordinates, and generate spatial annotations."
    )

    content = []
    content.append({"type": "image", "image": image_path})
    
    if bounding_boxes:
        bbox_str = json.dumps(bounding_boxes)
        prompt += f"\n\nContext Bounding Boxes: {bbox_str}"
        
    content.append({"type": "text", "text": prompt})

    return {
        "messages": [
            {
                "role": "system",
                "content": system_instruction
            },
            {
                "role": "user",
                "content": content
            },
            {
                "role": "assistant",
                "content": [{"type": "text", "text": answer}]
            }
        ]
    }

def export_dataset_jsonl(samples: List[Dict[str, Any]], output_path: str):
    """Saves formatted samples to JSONL for training."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        for sample in samples:
            f.write(json.dumps(sample, ensure_ascii=False) + "\n")
    print(f"Successfully exported {len(samples)} multimodal samples to {output_path}")

if __name__ == "__main__":
    # Example Demo Dataset Creation
    demo_samples = [
        create_samyam_vqa_sample(
            image_path="data/samples/satellite_frame_01.png",
            prompt="Detect and segment all solar panel arrays and debris fragments in this orbital satellite image.",
            answer="In this frame, I detected 1 solar array at [120, 340, 280, 520] and 2 debris fragments at [45, 89, 70, 110] with 99.2% confidence.",
            bounding_boxes=[{"label": "Solar Array", "box_2d": [120, 340, 280, 520]}]
        )
    ]
    export_dataset_jsonl(demo_samples, "data/samyam_multimodal_train.jsonl")
