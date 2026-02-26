"""
CERT Insider Threat Dataset Loader

CERT dataset contains user activity logs including:
- Login/logout events
- File access
- Email activity
- Device usage
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Optional
from datetime import datetime
import logging
import os
import glob

logger = logging.getLogger(__name__)


class CERTLoader:
    """Loader for CERT Insider Threat Dataset"""
    
    def __init__(self, data_dir: str):
        """
        Initialize CERT loader
        
        Args:
            data_dir: Directory containing CERT dataset files
        """
        self.data_dir = data_dir
    
    def load_login_logs(self, file_pattern: str = "logon*.csv") -> pd.DataFrame:
        """
        Load CERT login/logout logs
        
        Args:
            file_pattern: Pattern to match login log files
        
        Returns:
            DataFrame with login events
        """
        logger.info(f"Loading CERT login logs from {self.data_dir}")
        
        login_files = glob.glob(os.path.join(self.data_dir, file_pattern))
        
        if not login_files:
            logger.warning(f"No login log files found matching {file_pattern}")
            return pd.DataFrame()
        
        all_logs = []
        
        for file_path in login_files:
            try:
                df = pd.read_csv(file_path, low_memory=False)
                
                # CERT format: id,date,user,pc,activity
                # activity: Logon or Logoff
                
                if 'date' in df.columns:
                    df['timestamp'] = pd.to_datetime(df['date'], format='%m/%d/%Y %H:%M:%S', errors='coerce')
                
                all_logs.append(df)
                
            except Exception as e:
                logger.error(f"Error loading {file_path}: {e}")
        
        if not all_logs:
            return pd.DataFrame()
        
        combined = pd.concat(all_logs, ignore_index=True)
        combined = combined.dropna(subset=['timestamp'])
        combined = combined.sort_values('timestamp').reset_index(drop=True)
        
        logger.info(f"Loaded {len(combined)} CERT login events")
        
        return combined
    
    def load_file_access(self, file_pattern: str = "file*.csv") -> pd.DataFrame:
        """
        Load CERT file access logs
        
        Args:
            file_pattern: Pattern to match file access log files
        
        Returns:
            DataFrame with file access events
        """
        logger.info(f"Loading CERT file access logs from {self.data_dir}")
        
        file_access_files = glob.glob(os.path.join(self.data_dir, file_pattern))
        
        if not file_access_files:
            logger.warning(f"No file access log files found matching {file_pattern}")
            return pd.DataFrame()
        
        all_logs = []
        
        for file_path in file_access_files:
            try:
                df = pd.read_csv(file_path, low_memory=False)
                # CERT format: id,date,user,pc,file,activity
                
                if 'date' in df.columns:
                    df['timestamp'] = pd.to_datetime(df['date'], format='%m/%d/%Y %H:%M:%S', errors='coerce')
                
                all_logs.append(df)
                
            except Exception as e:
                logger.error(f"Error loading {file_path}: {e}")
        
        if not all_logs:
            return pd.DataFrame()
        
        combined = pd.concat(all_logs, ignore_index=True)
        combined = combined.dropna(subset=['timestamp'])
        combined = combined.sort_values('timestamp').reset_index(drop=True)
        
        logger.info(f"Loaded {len(combined)} CERT file access events")
        
        return combined
    
    def normalize_for_itdr(self, login_df: pd.DataFrame, file_df: Optional[pd.DataFrame] = None) -> pd.DataFrame:
        """
        Normalize CERT data for ITDR processing
        
        Args:
            login_df: CERT login DataFrame
            file_df: Optional file access DataFrame
        
        Returns:
            Normalized DataFrame with ITDR-standard columns
        """
        logger.info("Normalizing CERT data for ITDR")
        
        normalized_list = []
        
        # Process login events
        if not login_df.empty:
            login_normalized = pd.DataFrame()
            login_normalized['event_id'] = login_df.index
            login_normalized['timestamp'] = login_df['timestamp']
            
            if 'user' in login_df.columns:
                login_normalized['user'] = login_df['user']
            else:
                login_normalized['user'] = 'unknown'
            
            if 'pc' in login_df.columns:
                login_normalized['source_ip'] = login_df['pc']
                login_normalized['destination_host'] = login_df['pc']
            
            if 'activity' in login_df.columns:
                login_normalized['event_type'] = login_df['activity'].str.lower()
            else:
                login_normalized['event_type'] = 'logon'
            
            login_normalized['success'] = True  # CERT logs typically successful events
            login_normalized['domain'] = 'CERT'
            
            # Session identifier
            login_normalized['session_id'] = (
                login_normalized['user'].astype(str) + '_' +
                login_normalized['destination_host'].astype(str) + '_' +
                login_normalized['timestamp'].dt.date.astype(str)
            )
            
            normalized_list.append(login_normalized)
        
        # Process file access events (if provided)
        if file_df is not None and not file_df.empty:
            file_normalized = pd.DataFrame()
            file_normalized['event_id'] = file_df.index + len(login_df) if not login_df.empty else file_df.index
            file_normalized['timestamp'] = file_df['timestamp']
            
            if 'user' in file_df.columns:
                file_normalized['user'] = file_df['user']
            else:
                file_normalized['user'] = 'unknown'
            
            if 'pc' in file_df.columns:
                file_normalized['source_ip'] = file_df['pc']
                file_normalized['destination_host'] = file_df['pc']
            
            if 'file' in file_df.columns:
                file_normalized['resource_accessed'] = file_df['file']
            
            file_normalized['event_type'] = 'file_access'
            file_normalized['success'] = True
            file_normalized['domain'] = 'CERT'
            
            # Reuse session from login events if possible
            file_normalized['session_id'] = (
                file_normalized['user'].astype(str) + '_' +
                file_normalized['destination_host'].astype(str) + '_' +
                file_normalized['timestamp'].dt.date.astype(str)
            )
            
            normalized_list.append(file_normalized)
        
        if not normalized_list:
            return pd.DataFrame()
        
        combined = pd.concat(normalized_list, ignore_index=True)
        combined = combined.sort_values('timestamp').reset_index(drop=True)
        
        logger.info(f"Normalized {len(combined)} CERT events")
        
        return combined


def load_cert_dataset(data_dir: str, include_file_access: bool = True) -> pd.DataFrame:
    """
    Convenience function to load and normalize CERT dataset
    
    Args:
        data_dir: Directory containing CERT dataset
        include_file_access: Whether to include file access logs
    
    Returns:
        Normalized DataFrame
    """
    loader = CERTLoader(data_dir)
    login_df = loader.load_login_logs()
    
    file_df = None
    if include_file_access:
        file_df = loader.load_file_access()
    
    normalized_df = loader.normalize_for_itdr(login_df, file_df)
    return normalized_df

