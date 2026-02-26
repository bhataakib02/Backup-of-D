from typing import Optional
import os

class KafkaClient:
    """Lightweight Kafka client scaffold (no external dependency)."""
    def __init__(self):
        self.broker = os.getenv('KAFKA_BROKER_URL', 'localhost:9092')
        self.enabled = os.getenv('KAFKA_ENABLED', 'false').lower() == 'true'

    def health(self) -> dict:
        return {
            'enabled': self.enabled,
            'broker': self.broker,
            'connected': False  # Placeholder until real client is integrated
        }

_client: Optional[KafkaClient] = None

def get_kafka_client() -> KafkaClient:
    global _client
    if _client is None:
        _client = KafkaClient()
    return _client






