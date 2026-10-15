import sys
import asyncio
import time
import io

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

sys.path.append(r'python\samyam_lm_multimodal')
from serve_samyam_lm import system1_decision, two_tier_decision_pipeline, System1DecisionRequest

async def run_demo():
    print("=" * 68)
    print("  [DEMO] SAMYAM + LAYA / JEV SYSTEM 1 DECISION ENGINE - LIVE BENCHMARK")
    print("=" * 68)
    
    # Test 1: Defense Target
    req1 = System1DecisionRequest(
        query="Hostile military radar installation and convoy near border sector",
        context="Western Defense Perimeter",
        confidence_threshold=0.50
    )
    res1 = await system1_decision(req1)
    
    print(f"Engine Architecture : {res1.architecture}")
    print(f"Execution Latency   : {res1.latency_ms} ms (Instant Single-Pass Verdict)")
    print(f"Primary Decision    : {res1.decision}")
    print(f"Confidence Score    : {res1.confidence * 100:.1f}%")
    print(f"Threat Level        : {res1.threat_level}")
    print(f"Action Directive    : {res1.action_directive}")
    print("\nCalibrated Probability Distribution across Typed Choices:")
    for choice, prob in res1.calibrated_probabilities.items():
        bar = "█" * int(prob * 20)
        print(f"  {choice:26} : {prob*100:5.1f}% [{bar:<20}]")
    print(f"\nHindi Callout       : {res1.indic_callout}")
    print(f"Cascade to Deep VLM : {res1.tier2_trigger_recommended}")

    # Test 2: Two-Tier Pipeline
    print("\n" + "=" * 68)
    print("  TWO-TIER CASCADE PIPELINE (SAVING 90% GPU COMPUTE)")
    print("=" * 68)
    cascade = await two_tier_decision_pipeline(req1)
    print(f"Tier 1 (Laya Engine) : {cascade['tier1_system1_laya']['decision']} ({cascade['tier1_system1_laya']['latency_ms']}ms)")
    print(f"Tier 2 Triggered     : {cascade['tier2_triggered']}")
    if cascade['deep_vision_analysis']:
        print(f"Deep VLM Status      : {cascade['deep_vision_analysis']['status']}")
        print(f"VLM Message          : {cascade['deep_vision_analysis']['message']}")


if __name__ == "__main__":
    asyncio.run(run_demo())
