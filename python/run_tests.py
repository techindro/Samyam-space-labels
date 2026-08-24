#!/usr/bin/env python3
"""
SamyamLM Test Runner
Executes unit tests with detailed diagnostic reporting and Step Summary output.
"""

import os
import sys
import traceback

curr_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(curr_dir, "app")
samyam_lm_dir = os.path.join(curr_dir, "samyam_lm_multimodal")
tests_dir = os.path.join(curr_dir, "tests")
root_dir = os.path.abspath(os.path.join(curr_dir, ".."))

for p in [app_dir, samyam_lm_dir, tests_dir, curr_dir, root_dir]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

def run():
    print("=" * 60, flush=True)
    print("  RUNNING SAMYAM AI ENGINE UNIT TESTS", flush=True)
    print("=" * 60, flush=True)

    summary_lines = ["## 🧪 Samyam AI Engine CI Test Report\n"]
    total_passed = 0
    total_failed = 0

    try:
        try:
            from tests import test_coordinates
        except ImportError:
            import test_coordinates

        coord_tests = [
            test_coordinates.test_compute_iou_identical_boxes,
            test_coordinates.test_compute_iou_disjoint_boxes,
            test_coordinates.test_compute_iou_partial_overlap,
            test_coordinates.test_evaluate_detections_perfect_match,
            test_coordinates.test_evaluate_detections_mismatch_label,
        ]
        for t in coord_tests:
            try:
                t()
                print(f" [PASS] test_coordinates::{t.__name__}", flush=True)
                summary_lines.append(f"- ✅ `test_coordinates::{t.__name__}` — **PASSED**")
                total_passed += 1
            except Exception as e:
                print(f" [FAIL] test_coordinates::{t.__name__}: {e}", flush=True)
                traceback.print_exc(file=sys.stdout)
                summary_lines.append(f"- ❌ `test_coordinates::{t.__name__}` — **FAILED**: {e}")
                total_failed += 1
    except Exception as e:
        print(f" [ERROR] Could not import test_coordinates: {e}", flush=True)
        traceback.print_exc(file=sys.stdout)
        summary_lines.append(f"- ❌ `import test_coordinates` — **FAILED**: {e}")
        total_failed += 1

    try:
        try:
            from tests import test_api
        except ImportError:
            import test_api

        api_tests = [
            test_api.test_api_health_endpoint,
            test_api.test_prelabel_clip_endpoint_structure,
            test_api.test_isro_fetch_endpoint,
        ]
        for t in api_tests:
            try:
                t()
                print(f" [PASS] test_api::{t.__name__}", flush=True)
                summary_lines.append(f"- ✅ `test_api::{t.__name__}` — **PASSED**")
                total_passed += 1
            except Exception as e:
                print(f" [FAIL] test_api::{t.__name__}: {e}", flush=True)
                traceback.print_exc(file=sys.stdout)
                summary_lines.append(f"- ❌ `test_api::{t.__name__}` — **FAILED**: {e}")
                total_failed += 1
    except Exception as e:
        print(f" [ERROR] Could not import test_api: {e}", flush=True)
        traceback.print_exc(file=sys.stdout)
        summary_lines.append(f"- ❌ `import test_api` — **FAILED**: {e}")
        total_failed += 1

    print("=" * 60, flush=True)
    print(f" Results: {total_passed} Passed, {total_failed} Failed", flush=True)
    print("=" * 60, flush=True)

    summary_file = os.getenv("GITHUB_STEP_SUMMARY")
    if summary_file and os.path.exists(os.path.dirname(summary_file)):
        try:
            with open(summary_file, "a", encoding="utf-8") as f:
                f.write("\n".join(summary_lines) + f"\n\n**Total**: {total_passed} Passed, {total_failed} Failed\n")
        except Exception:
            pass

    if total_failed > 0:
        sys.exit(1)
    else:
        print("All Samyam AI Engine tests PASSED successfully!", flush=True)
        sys.exit(0)

if __name__ == "__main__":
    run()
