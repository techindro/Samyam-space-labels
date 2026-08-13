"""
Samyam Space Labels — Automated Active Learning Pipeline Engine
Calculates AI model uncertainty scores (Entropy Scoring, Margin Sampling, Least Confidence)
and auto-sorts unlabeled images so annotators label high-value ambiguous samples first.
"""

import math
from typing import List, Dict, Any

def calculate_entropy_uncertainty(predictions: List[Dict[str, Any]]) -> float:
    """
    Calculates normalized Shannon Entropy across predicted object bounding box class probabilities.
    Higher entropy = Higher model uncertainty (0.0 to 1.0).
    """
    if not predictions:
        return 1.0  # Completely unannotated/unpredicted image = Highest Priority (1.0)
        
    entropies = []
    for pred in predictions:
        probs = pred.get("class_probabilities", [pred.get("confidence", 0.5), 1.0 - pred.get("confidence", 0.5)])
        entropy = -sum(p * math.log2(p) for p in probs if p > 0)
        entropies.append(entropy)
        
    avg_entropy = sum(entropies) / len(entropies) if entropies else 1.0
    return round(min(1.0, max(0.0, avg_entropy)), 4)

def calculate_least_confidence(predictions: List[Dict[str, Any]]) -> float:
    """
    Calculates Least Confidence Score: 1.0 - max(confidence).
    """
    if not predictions:
        return 1.0
    max_conf = max(p.get("confidence", 0.5) for p in predictions)
    return round(1.0 - max_conf, 4)

def auto_sort_queue_by_uncertainty(tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks dataset tasks in descending order of AI Model Uncertainty.
    Tasks with lowest prediction confidence / highest entropy are placed FIRST in the queue.
    """
    scored_tasks = []
    for task in tasks:
        preds = task.get("ai_predictions", [])
        entropy_score = calculate_entropy_uncertainty(preds)
        confidence_uncertainty = calculate_least_confidence(preds)
        
        # Combined Active Learning Priority Score
        priority_score = round(0.6 * entropy_score + 0.4 * confidence_uncertainty, 4)
        
        task_copy = dict(task)
        task_copy["active_learning"] = {
            "priority_score": priority_score,
            "uncertainty_level": "High" if priority_score > 0.65 else "Medium" if priority_score > 0.35 else "Low",
            "entropy_score": entropy_score,
            "recommended_action": "Prioritize Human Annotation" if priority_score > 0.65 else "Standard QA Review"
        }
        scored_tasks.append(task_copy)
        
    # Sort by priority score descending (Highest uncertainty first)
    return sorted(scored_tasks, key=lambda x: x["active_learning"]["priority_score"], reverse=True)

if __name__ == "__main__":
    demo_tasks = [
        {"id": "t-1", "name": "Satellite Frame #101", "ai_predictions": [{"confidence": 0.95}]},
        {"id": "t-2", "name": "Ambiguous Radar Vessel #402", "ai_predictions": [{"confidence": 0.52}]},
        {"id": "t-3", "name": "Unlabeled Debris #809", "ai_predictions": []}
    ]
    
    sorted_queue = auto_sort_queue_by_uncertainty(demo_tasks)
    print("Automated Active Learning Ranked Queue:")
    for rank, task in enumerate(sorted_queue, 1):
        print(f"Rank #{rank}: {task['name']} | Priority: {task['active_learning']['priority_score']} ({task['active_learning']['uncertainty_level']})")
