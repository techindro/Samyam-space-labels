"""
Samyam Space AI — Procedural Synthetic Space Scenario Generator
Generates synthetic satellite, debris, and SAR radar clutter frames with ground-truth coordinates.
"""

import random
import math

def generate_synthetic_orbital_frame(debris_count: int = 5, sun_angle_deg: float = 45.0, sar_clutter_ratio: float = 0.3):
    labels = ["Orbital Debris #104", "Satellite Solar Array", "Rocket Stage Fragment", "CubeSat Alpha", "Unidentified Object"]
    annotations = []
    
    for i in range(debris_count):
        center_x = random.randint(100, 540)
        center_y = random.randint(80, 240)
        radius = random.randint(12, 36)
        
        annotations.append({
            "id": f"syn-obj-{i+1}",
            "class_label": labels[i % len(labels)],
            "bbox": {
                "x": center_x - radius,
                "y": center_y - radius,
                "w": radius * 2,
                "h": radius * 2
            },
            "confidence_ground_truth": 1.0,
            "simulated_specular_intensity": round(abs(math.sin(math.radians(sun_angle_deg))), 3),
            "sar_backscatter_db": round(random.uniform(-18.5, -5.2), 2)
        })
        
    return {
        "scenario": "Orbital Synthetic Simulation",
        "sun_angle_deg": sun_angle_deg,
        "sar_clutter_ratio": sar_clutter_ratio,
        "total_objects": len(annotations),
        "annotations": annotations
    }
