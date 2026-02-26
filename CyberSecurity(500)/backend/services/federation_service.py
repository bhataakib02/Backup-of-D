from typing import Dict, List
from datetime import datetime
import hashlib

class FederatedCoordinator:
    """Minimal federated learning coordinator scaffold.
    Tracks participants, round submissions, and produces a dummy aggregated model hash.
    """
    def __init__(self):
        self.participants: Dict[str, dict] = {}
        self.round = 1
        self.submissions: Dict[int, List[dict]] = {}
        self.model_hash = hashlib.sha256(b'initial').hexdigest()

    def join(self, org_id: str, capabilities: dict) -> dict:
        self.participants[org_id] = {
            'org_id': org_id,
            'capabilities': capabilities,
            'joinedAt': datetime.utcnow().isoformat()
        }
        return {'joined': True, 'round': self.round, 'participants': len(self.participants)}

    def submit_update(self, org_id: str, update_hash: str, metrics: dict) -> dict:
        if org_id not in self.participants:
            return {'accepted': False, 'error': 'not joined'}
        bucket = self.submissions.setdefault(self.round, [])
        bucket.append({'org_id': org_id, 'update_hash': update_hash, 'metrics': metrics})
        return {'accepted': True, 'round': self.round, 'received': len(bucket)}

    def aggregate(self) -> dict:
        # Dummy aggregation: combine hashes and advance round
        updates = self.submissions.get(self.round, [])
        h = hashlib.sha256()
        for u in updates:
            h.update(u['update_hash'].encode())
        # also mix current model hash
        h.update(self.model_hash.encode())
        self.model_hash = h.hexdigest()
        aggregated_round = self.round
        self.round += 1
        return {'aggregated': True, 'round': aggregated_round, 'model_hash': self.model_hash}

    def status(self) -> dict:
        return {
            'round': self.round,
            'participants': list(self.participants.keys()),
            'current_model_hash': self.model_hash,
            'pending_submissions': len(self.submissions.get(self.round, []))
        }

_coordinator: FederatedCoordinator = FederatedCoordinator()

def get_federation() -> FederatedCoordinator:
    return _coordinator






