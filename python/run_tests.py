#!/usr/bin/env python3
"""
SamyamLM Test Runner
Executes PyTest suite or directly runs unit tests with detailed diagnostic reporting.
"""

import os
import sys
import math
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
    print("=" * 60)
    print("  RUNNING SAMYAM AI ENGINE UNIT TESTS")
    print("=" * 60)

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
                print(f" [PASS] test_coordinates::{t.__name__}")
                total_passed += 1
            except Exception as e:
                print(f" [FAIL] test_coordinates::{t.__name__}: {e}")
                traceback.print_exc()
                total_failed += 1
    except Exception as e:
        print(f" [ERROR] Could not import test_coordinates: {e}")
        traceback.print_exc()
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
                print(f" [PASS] test_api::{t.__name__}")
                total_passed += 1
            except Exception as e:
                print(f" [FAIL] test_api::{t.__name__}: {e}")
                traceback.print_exc()
                total_failed += 1
    except Exception as e:
        print(f" [ERROR] Could not import test_api: {e}")
        traceback.print_exc()
        total_failed += 1

    print("=" * 60)
    print(f" Results: {total_passed} Passed, {total_failed} Failed")
    print("=" * 60)

    if total_failed > 0:
        sys.exit(1)
    else:
        print("All Samyam AI Engine tests PASSED successfully!")
        sys.exit(0)

if __name__ == "__main__":
    run()
