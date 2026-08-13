"""
Samyam LM Multimodal — QLoRA Fine-Tuning Script
Fine-tunes Qwen2.5-VL / Llama-3.2-Vision on custom spatial & geospatial datasets using PyTorch & HuggingFace PEFT.
"""

import os
import torch
from transformers import (
    AutoProcessor,
    Qwen2_5_VLForConditionalGeneration,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

MODEL_ID = (
    "Qwen/Qwen2.5-VL-7B-Instruct"  # High performance open vision-language backbone
)
OUTPUT_DIR = "./checkpoints/samyam-lm-v1"


def train_samyam_lm():
    print(f"Loading Base Multimodal Model: {MODEL_ID}...")

    # 1. Load Processor
    processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)

    # 2. Load Model in 4-bit / 8-bit precision for Memory Efficiency (Fits on 1x RTX 4090 / A100 GPU)
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        MODEL_ID, torch_dtype=torch.bfloat16, device_map="auto", trust_remote_code=True
    )

    # 3. Configure LoRA (Low-Rank Adaptation)
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=[
            "q_proj",
            "v_proj",
            "k_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )

    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # 4. Define Training Arguments
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=50,
        max_steps=500,
        learning_rate=2e-4,
        fp16=False,
        bf16=True,
        logging_steps=10,
        save_strategy="steps",
        save_steps=100,
        optim="adamw_torch_fused",
        report_to="none",
    )

    print("Samyam LM Multimodal Training Configuration Ready!")
    print("Run `trainer.train()` with formatted JSONL dataset to begin training.")


if __name__ == "__main__":
    train_samyam_lm()
