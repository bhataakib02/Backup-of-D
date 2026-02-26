"""
LANL Cyber Security Dataset Loader

LANL dataset contains authentication logs in the format:
timestamp,source user@domain,destination user@domain,source computer,destination computer,authentication type,logon type,authentication orientation,success/failure
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class LANLLoader:
    """Loader for LANL authentication logs"""
    
    def __init__(self, file_path: str):
        """
        Initialize LANL loader
        
        Args:
            file_path: Path to LANL auth.txt file
        """
        self.file_path = file_path
        self.columns = [
            'timestamp',
            'source_user',
            'destination_user',
            'source_computer',
            'destination_computer',
            'authentication_type',
            'logon_type',
            'authentication_orientation',
            'success'
        ]
    
    def load(self, max_rows: Optional[int] = None) -> pd.DataFrame:
        """
        Load LANL authentication logs
        
        Args:
            max_rows: Maximum number of rows to load (None for all)
        
        Returns:
            DataFrame with parsed authentication events
        """
        logger.info(f"Loading LANL dataset from {self.file_path}")
        
        try:
            # Read CSV file
            df = pd.read_csv(
                self.file_path,
                sep=',',
                names=self.columns,
                nrows=max_rows,
                dtype=str
            )
            
            logger.info(f"Loaded {len(df)} rows")
            
            # Parse timestamp
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s', errors='coerce')
            
            # Parse success field (Success/Failure -> boolean)
            df['success'] = df['success'].str.strip().str.lower() == 'success'
            
            # Extract domain from user@domain format
            df[['source_user_clean', 'source_domain']] = df['source_user'].str.split('@', n=1, expand=True)
            df[['dest_user_clean', 'dest_domain']] = df['destination_user'].str.split('@', n=1, expand=True)
            
            # Drop rows with invalid timestamps
            df = df.dropna(subset=['timestamp'])
            
            # Sort by timestamp
            df = df.sort_values('timestamp').reset_index(drop=True)
            
            logger.info(f"Parsed {len(df)} valid events")
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading LANL dataset: {e}")
            raise
    
    def normalize_for_itdr(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Normalize LANL data for ITDR processing
        
        Args:
            df: Raw LANL DataFrame
        
        Returns:
            Normalized DataFrame with ITDR-standard columns
        """
        logger.info("Normalizing LANL data for ITDR")
        
        # Create normalized event structure
        normalized = pd.DataFrame()
        
        # Core identity fields
        normalized['event_id'] = df.index
        normalized['timestamp'] = df['timestamp']
        normalized['user'] = df['dest_user_clean']  # Destination user is the authenticated user
        normalized['domain'] = df['dest_domain']
        normalized['source_ip'] = df['source_computer']  # Using computer as proxy for IP
        normalized['destination_host'] = df['destination_computer']
        normalized['authentication_type'] = df['authentication_type']
        normalized['logon_type'] = df['logon_type']
        normalized['success'] = df['success']
        
        # Extract IP if available (LANL uses computer names, but we'll try to extract)
        # For real implementation, would need computer-to-IP mapping
        normalized['source_ip_clean'] = normalized['source_ip']
        
        # Event type
        normalized['event_type'] = 'authentication'
        
        # Session identifier (simplified: user + host + time window)
        normalized['session_id'] = (
            normalized['user'].astype(str) + '_' +
            normalized['destination_host'].astype(str) + '_' +
            normalized['timestamp'].dt.date.astype(str)
        )
        
        return normalized


def load_lanl_dataset(file_path: str, max_rows: Optional[int] = None) -> pd.DataFrame:
    """
    Convenience function to load and normalize LANL dataset
    
    Args:
        file_path: Path to LANL auth.txt
        max_rows: Maximum rows to load
    
    Returns:
        Normalized DataFrame
    """
    loader = LANLLoader(file_path)
    raw_df = loader.load(max_rows=max_rows)
    normalized_df = loader.normalize_for_itdr(raw_df)
    return normalized_df

