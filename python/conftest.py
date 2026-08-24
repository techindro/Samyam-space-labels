import os
import sys

python_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(python_dir)
app_dir = os.path.join(python_dir, "app")
samyam_lm_dir = os.path.join(python_dir, "samyam_lm_multimodal")

for p in [app_dir, samyam_lm_dir, python_dir, root_dir]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)
