import os

class TimeSeriesClient:
    def __init__(self):
        self.url = os.getenv('TSDB_URL', 'postgresql://localhost:5432/nexus')
        self.enabled = os.getenv('TSDB_ENABLED', 'false').lower() == 'true'
    def health(self):
        return {'enabled': self.enabled, 'url': self.url, 'connected': False}

class GraphClient:
    def __init__(self):
        self.url = os.getenv('GRAPH_URL', 'bolt://localhost:7687')
        self.enabled = os.getenv('GRAPH_ENABLED', 'false').lower() == 'true'
    def health(self):
        return {'enabled': self.enabled, 'url': self.url, 'connected': False}

class VectorClient:
    def __init__(self):
        self.url = os.getenv('VECTOR_URL', 'http://localhost:6333')
        self.enabled = os.getenv('VECTOR_ENABLED', 'false').lower() == 'true'
    def health(self):
        return {'enabled': self.enabled, 'url': self.url, 'connected': False}






