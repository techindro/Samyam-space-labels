#!/usr/bin/env python3
"""
SamyamLM-V1 — Automated Weights & Runtime Downloader
Downloads quantized base weights or builds the local Ollama instance from Modelfile.
"""

import os
import sys
import subprocess
import argparse


def check_ollama_installed() -> bool:
    try:
        res = subprocess.run(["ollama", "--version"], capture_output=True, text=True)
        return res.returncode == 0
    except FileNotFoundError:
        return False


def setup_samyam_lm(modelfile_path: str = "python/samyam_lm_multimodal/Modelfile", model_name: str = "samyam-lm-v1"):
    print("=" * 60)
    print(f"🚀 Initializing SamyamLM-V1 Deployment Setup: {model_name}")
    print("=" * 60)

    if not check_ollama_installed():
        print("⚠️  Warning: Ollama CLI not detected on system PATH.")
        print("📥 Download & Install Ollama from: https://ollama.com/download")
        return False

    print("✅ Ollama detected.")
    print("🔄 Pulling base multimodal weights (moondream)...")
    try:
        pull_cmd = subprocess.run(["ollama", "pull", "moondream"], check=True)
        print("✅ Base weights verified.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to pull base model: {e}")
        return False

    if not os.path.exists(modelfile_path):
        print(f"❌ Modelfile not found at: {modelfile_path}")
        return False

    print(f"🔨 Building custom spatial model '{model_name}' from {modelfile_path}...")
    try:
        create_cmd = subprocess.run(["ollama", "create", model_name, "-f", modelfile_path], check=True)
        print(f"🎉 Successfully created '{model_name}'!")
        print(f"⚡ Test model with: ollama run {model_name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to build custom model: {e}")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download and setup SamyamLM-V1 weights")
    parser.add_argument("--model-name", default="samyam-lm-v1", help="Target model tag name")
    parser.add_argument("--modelfile", default="python/samyam_lm_multimodal/Modelfile", help="Path to Modelfile")
    args = parser.parse_args()

    setup_samyam_lm(modelfile_path=args.modelfile, model_name=args.model_name)
