"""
SamyamLM Apache Kafka Event Streaming Engine
Provides fail-safe asynchronous message queuing for satellite pre-labeling tasks,
ground-truth annotations, and RLHF active learning loops.
"""

import os
import json
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SamyamKafka")

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
PRELABEL_TOPIC = "samyam-prelabel-tasks"
ANNOTATION_TOPIC = "samyam-annotation-events"

HAS_KAFKA = False
KafkaProducer = None
KafkaConsumer = None

try:
    import importlib
    _kafka_lib = importlib.import_module("kafka")
    KafkaProducer = getattr(_kafka_lib, "KafkaProducer", None)
    KafkaConsumer = getattr(_kafka_lib, "KafkaConsumer", None)
    if KafkaProducer and KafkaConsumer:
        HAS_KAFKA = True
except (ImportError, Exception):
    HAS_KAFKA = False
    logger.info("[Kafka] kafka-python library not installed. Running in mock/direct fallback mode.")


class SamyamKafkaManager:
    """
    Fail-safe Kafka Manager that produces and consumes event streams.
    Falls back gracefully to synchronous execution if Kafka broker is unavailable.
    """
    def __init__(self, bootstrap_servers: str = KAFKA_BOOTSTRAP_SERVERS):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
        self.is_connected = False

        if HAS_KAFKA:
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=self.bootstrap_servers,
                    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                    request_timeout_ms=3000,
                    retries=2
                )
                self.is_connected = True
                logger.info(f"[Kafka] Successfully connected to Kafka broker at {self.bootstrap_servers}")
            except Exception as e:
                logger.warning(f"[Kafka] Broker unavailable at {self.bootstrap_servers}: {e}. Running in direct mode.")
                self.is_connected = False
        else:
            self.is_connected = False

    def publish_event(self, topic: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Publishes event payload to Kafka topic. Returns status.
        """
        if self.is_connected and self.producer:
            try:
                future = self.producer.send(topic, value=payload)
                self.producer.flush(timeout=2)
                logger.info(f"[Kafka] Published event to topic '{topic}'")
                return {
                    "status": "queued_in_kafka",
                    "topic": topic,
                    "event_id": payload.get("id", "evt-auto"),
                    "broker": self.bootstrap_servers
                }
            except Exception as e:
                logger.error(f"[Kafka] Error publishing to {topic}: {e}")
                return {
                    "status": "fallback_direct",
                    "topic": topic,
                    "message": "Kafka publish failed, handled synchronously",
                    "error": str(e)
                }
        else:
            return {
                "status": "fallback_direct",
                "topic": topic,
                "message": "Kafka broker offline or library missing. Processed directly."
            }

    def get_status(self) -> Dict[str, Any]:
        return {
            "kafka_library_installed": HAS_KAFKA,
            "broker_connected": self.is_connected,
            "bootstrap_servers": self.bootstrap_servers,
            "topics": [PRELABEL_TOPIC, ANNOTATION_TOPIC]
        }


# Singleton Kafka Manager instance
kafka_manager = SamyamKafkaManager()
