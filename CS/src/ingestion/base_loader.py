"""
Base loader interface for dataset ingestion
"""

from abc import ABC, abstractmethod
import pandas as pd
from typing import Optional


class BaseLoader(ABC):
    """Abstract base class for dataset loaders"""
    
    @abstractmethod
    def load(self, **kwargs) -> pd.DataFrame:
        """
        Load raw dataset
        
        Returns:
            DataFrame with raw events
        """
        pass
    
    @abstractmethod
    def normalize_for_itdr(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Normalize dataset for ITDR processing
        
        Args:
            df: Raw DataFrame
        
        Returns:
            Normalized DataFrame with ITDR-standard columns
        """
        pass

