"""
File utilities for the AI/ML Cybersecurity Platform
"""

import os
import hashlib
try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False
import mimetypes
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
import zipfile
import tarfile
try:
    import rarfile
    RARFILE_AVAILABLE = True
except ImportError:
    RARFILE_AVAILABLE = False
try:
    import py7zr
    PY7ZR_AVAILABLE = True
except ImportError:
    PY7ZR_AVAILABLE = False
from PIL import Image
import cv2
import numpy as np
import pefile
import yara
import json
import logging

logger = logging.getLogger(__name__)

class FileAnalyzer:
    """File analysis utilities"""
    
    def __init__(self):
        self.supported_formats = {
            'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'],
            'documents': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'],
            'archives': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
            'executables': ['.exe', '.dll', '.sys', '.msi', '.bat', '.cmd', '.scr'],
            'scripts': ['.js', '.vbs', '.ps1', '.py', '.sh', '.bash'],
            'media': ['.mp3', '.mp4', '.avi', '.mov', '.wav', '.flac'],
            'web': ['.html', '.htm', '.css', '.js', '.php', '.asp', '.jsp']
        }
    
    def get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Get comprehensive file information"""
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                return {'error': 'File not found'}
            
            # Basic file info
            stat = file_path.stat()
            file_info = {
                'filename': file_path.name,
                'size': stat.st_size,
                'created': stat.st_ctime,
                'modified': stat.st_mtime,
                'accessed': stat.st_atime,
                'extension': file_path.suffix.lower(),
                'mime_type': self._get_mime_type(file_path),
                'magic_type': self._get_magic_type(file_path),
                'hash_md5': self._calculate_hash(file_path, 'md5'),
                'hash_sha1': self._calculate_hash(file_path, 'sha1'),
                'hash_sha256': self._calculate_hash(file_path, 'sha256'),
                'entropy': self._calculate_entropy(file_path),
                'file_type': self._classify_file_type(file_path),
                'is_executable': self._is_executable(file_path),
                'is_archive': self._is_archive(file_path),
                'is_image': self._is_image(file_path),
                'is_document': self._is_document(file_path)
            }
            
            # Additional analysis based on file type
            if file_info['is_executable']:
                file_info.update(self._analyze_executable(file_path))
            elif file_info['is_archive']:
                file_info.update(self._analyze_archive(file_path))
            elif file_info['is_image']:
                file_info.update(self._analyze_image(file_path))
            elif file_info['is_document']:
                file_info.update(self._analyze_document(file_path))
            
            return file_info
            
        except Exception as e:
            logger.error(f"Error analyzing file {file_path}: {str(e)}")
            return {'error': str(e)}
    
    def _get_mime_type(self, file_path: Path) -> str:
        """Get MIME type of file"""
        try:
            mime_type, _ = mimetypes.guess_type(str(file_path))
            return mime_type or 'application/octet-stream'
        except:
            return 'application/octet-stream'
    
    def _get_magic_type(self, file_path: Path) -> str:
        """Get file type using python-magic"""
        try:
            if MAGIC_AVAILABLE:
                return magic.from_file(str(file_path))
            else:
                # Fallback to mimetypes
                mime_type, _ = mimetypes.guess_type(str(file_path))
                return mime_type or 'unknown'
        except:
            return 'unknown'
    
    def _calculate_hash(self, file_path: Path, algorithm: str) -> str:
        """Calculate file hash"""
        try:
            hash_obj = hashlib.new(algorithm)
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_obj.update(chunk)
            return hash_obj.hexdigest()
        except:
            return ''
    
    def _calculate_entropy(self, file_path: Path) -> float:
        """Calculate file entropy"""
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            if not data:
                return 0.0
            
            # Calculate byte frequency
            byte_counts = [0] * 256
            for byte in data:
                byte_counts[byte] += 1
            
            # Calculate entropy
            entropy = 0.0
            data_len = len(data)
            for count in byte_counts:
                if count > 0:
                    probability = count / data_len
                    entropy -= probability * (probability.bit_length() - 1)
            
            return entropy
        except:
            return 0.0
    
    def _classify_file_type(self, file_path: Path) -> str:
        """Classify file type"""
        extension = file_path.suffix.lower()
        
        for file_type, extensions in self.supported_formats.items():
            if extension in extensions:
                return file_type
        
        return 'unknown'
    
    def _is_executable(self, file_path: Path) -> bool:
        """Check if file is executable"""
        extension = file_path.suffix.lower()
        return extension in self.supported_formats['executables']
    
    def _is_archive(self, file_path: Path) -> bool:
        """Check if file is archive"""
        extension = file_path.suffix.lower()
        return extension in self.supported_formats['archives']
    
    def _is_image(self, file_path: Path) -> bool:
        """Check if file is image"""
        extension = file_path.suffix.lower()
        return extension in self.supported_formats['images']
    
    def _is_document(self, file_path: Path) -> bool:
        """Check if file is document"""
        extension = file_path.suffix.lower()
        return extension in self.supported_formats['documents']
    
    def _analyze_executable(self, file_path: Path) -> Dict[str, Any]:
        """Analyze executable file"""
        try:
            analysis = {}
            
            # PE file analysis
            if file_path.suffix.lower() == '.exe':
                pe = pefile.PE(str(file_path))
                analysis.update({
                    'pe_analysis': {
                        'machine_type': hex(pe.FILE_HEADER.Machine),
                        'number_of_sections': pe.FILE_HEADER.NumberOfSections,
                        'timestamp': pe.FILE_HEADER.TimeDateStamp,
                        'entry_point': hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint),
                        'image_base': hex(pe.OPTIONAL_HEADER.ImageBase),
                        'subsystem': pe.OPTIONAL_HEADER.Subsystem,
                        'dll_characteristics': hex(pe.OPTIONAL_HEADER.DllCharacteristics),
                        'imports': [imp.dll.decode('utf-8', errors='ignore') for imp in pe.DIRECTORY_ENTRY_IMPORT],
                        'exports': [exp.name.decode('utf-8', errors='ignore') for exp in pe.DIRECTORY_ENTRY_EXPORT.symbols] if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT') else []
                    }
                })
                pe.close()
            
            # YARA rule matching
            try:
                rules = yara.compile(filepath='rules/malware.yar')
                matches = rules.match(str(file_path))
                if matches:
                    analysis['yara_matches'] = [match.rule for match in matches]
            except:
                pass
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing executable {file_path}: {str(e)}")
            return {'error': str(e)}
    
    def _analyze_archive(self, file_path: Path) -> Dict[str, Any]:
        """Analyze archive file"""
        try:
            analysis = {
                'archive_contents': [],
                'total_files': 0,
                'total_size': 0,
                'compression_ratio': 0.0
            }
            
            extension = file_path.suffix.lower()
            
            if extension == '.zip':
                with zipfile.ZipFile(file_path, 'r') as zip_file:
                    for info in zip_file.infolist():
                        analysis['archive_contents'].append({
                            'filename': info.filename,
                            'size': info.file_size,
                            'compressed_size': info.compress_size,
                            'is_encrypted': info.flag_bits & 0x1
                        })
                        analysis['total_files'] += 1
                        analysis['total_size'] += info.file_size
            
            elif extension == '.rar' and RARFILE_AVAILABLE:
                with rarfile.RarFile(file_path, 'r') as rar_file:
                    for info in rar_file.infolist():
                        analysis['archive_contents'].append({
                            'filename': info.filename,
                            'size': info.file_size,
                            'compressed_size': info.compress_size,
                            'is_encrypted': info.needs_password()
                        })
                        analysis['total_files'] += 1
                        analysis['total_size'] += info.file_size
            
            elif extension == '.7z' and PY7ZR_AVAILABLE:
                with py7zr.SevenZipFile(file_path, 'r') as seven_zip:
                    for info in seven_zip.list():
                        analysis['archive_contents'].append({
                            'filename': info.filename,
                            'size': info.uncompressed,
                            'compressed_size': info.compressed,
                            'is_encrypted': info.encrypted
                        })
                        analysis['total_files'] += 1
                        analysis['total_size'] += info.uncompressed
            
            # Calculate compression ratio
            if analysis['total_size'] > 0:
                analysis['compression_ratio'] = file_path.stat().st_size / analysis['total_size']
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing archive {file_path}: {str(e)}")
            return {'error': str(e)}
    
    def _analyze_image(self, file_path: Path) -> Dict[str, Any]:
        """Analyze image file"""
        try:
            analysis = {}
            
            # PIL analysis
            with Image.open(file_path) as img:
                analysis.update({
                    'image_analysis': {
                        'format': img.format,
                        'mode': img.mode,
                        'size': img.size,
                        'width': img.width,
                        'height': img.height,
                        'has_transparency': img.mode in ('RGBA', 'LA') or 'transparency' in img.info
                    }
                })
            
            # OpenCV analysis
            img_cv = cv2.imread(str(file_path))
            if img_cv is not None:
                analysis['opencv_analysis'] = {
                    'shape': img_cv.shape,
                    'channels': img_cv.shape[2] if len(img_cv.shape) > 2 else 1,
                    'dtype': str(img_cv.dtype),
                    'mean_color': np.mean(img_cv, axis=(0, 1)).tolist(),
                    'std_color': np.std(img_cv, axis=(0, 1)).tolist()
                }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing image {file_path}: {str(e)}")
            return {'error': str(e)}
    
    def _analyze_document(self, file_path: Path) -> Dict[str, Any]:
        """Analyze document file"""
        try:
            analysis = {}
            
            # Basic document analysis
            analysis['document_analysis'] = {
                'file_type': file_path.suffix.lower(),
                'size': file_path.stat().st_size
            }
            
            # PDF analysis
            if file_path.suffix.lower() == '.pdf':
                try:
                    import PyPDF2
                    with open(file_path, 'rb') as pdf_file:
                        pdf_reader = PyPDF2.PdfReader(pdf_file)
                        analysis['pdf_analysis'] = {
                            'pages': len(pdf_reader.pages),
                            'encrypted': pdf_reader.is_encrypted,
                            'metadata': pdf_reader.metadata
                        }
                except:
                    pass
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing document {file_path}: {str(e)}")
            return {'error': str(e)}

class FileProcessor:
    """File processing utilities"""
    
    def __init__(self):
        self.analyzer = FileAnalyzer()
    
    def process_uploaded_file(self, file_path: str, analysis_type: str = 'auto') -> Dict[str, Any]:
        """Process uploaded file based on type"""
        try:
            file_info = self.analyzer.get_file_info(file_path)
            
            if 'error' in file_info:
                return file_info
            
            # Determine analysis type if auto
            if analysis_type == 'auto':
                if file_info['is_executable']:
                    analysis_type = 'malware'
                elif file_info['is_image']:
                    analysis_type = 'phishing'
                elif file_info['file_type'] == 'documents':
                    analysis_type = 'phishing'
                else:
                    analysis_type = 'general'
            
            # Add processing metadata
            file_info['analysis_type'] = analysis_type
            file_info['processed_at'] = str(datetime.utcnow())
            
            return file_info
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            return {'error': str(e)}
    
    def extract_strings(self, file_path: str, min_length: int = 4) -> List[str]:
        """Extract strings from file"""
        try:
            strings = []
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Extract ASCII strings
            current_string = ""
            for byte in data:
                if 32 <= byte <= 126:  # Printable ASCII
                    current_string += chr(byte)
                else:
                    if len(current_string) >= min_length:
                        strings.append(current_string)
                    current_string = ""
            
            # Add final string if exists
            if len(current_string) >= min_length:
                strings.append(current_string)
            
            return strings
            
        except Exception as e:
            logger.error(f"Error extracting strings from {file_path}: {str(e)}")
            return []
    
    def convert_to_image(self, file_path: str, output_path: str, width: int = 256, height: int = 256) -> bool:
        """Convert binary file to image for CNN analysis"""
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Pad or truncate data to fit image dimensions
            target_size = width * height
            if len(data) < target_size:
                data = data + b'\x00' * (target_size - len(data))
            else:
                data = data[:target_size]
            
            # Convert to numpy array and reshape
            img_array = np.frombuffer(data, dtype=np.uint8)
            img_array = img_array.reshape((height, width))
            
            # Save as image
            img = Image.fromarray(img_array, mode='L')
            img.save(output_path)
            
            return True
            
        except Exception as e:
            logger.error(f"Error converting file to image: {str(e)}")
            return False
    
    def create_thumbnail(self, file_path: str, output_path: str, size: Tuple[int, int] = (128, 128)) -> bool:
        """Create thumbnail for file preview"""
        try:
            if self.analyzer._is_image(file_path):
                with Image.open(file_path) as img:
                    img.thumbnail(size, Image.Resampling.LANCZOS)
                    img.save(output_path)
                    return True
            else:
                # Create generic file icon
                img = Image.new('RGB', size, color='gray')
                img.save(output_path)
                return True
                
        except Exception as e:
            logger.error(f"Error creating thumbnail: {str(e)}")
            return False

# Global instances
file_analyzer = FileAnalyzer()
file_processor = FileProcessor()

def get_file_analyzer() -> FileAnalyzer:
    """Get file analyzer instance"""
    return file_analyzer

def get_file_processor() -> FileProcessor:
    """Get file processor instance"""
    return file_processor

