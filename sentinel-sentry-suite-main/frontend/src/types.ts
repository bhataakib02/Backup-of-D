// Network Security Types

export interface NetworkTrafficStats {
  packets_total: number;
  bytes_total: number;
  start_time: string;
  protocols?: Record<string, number>;
  top_ips?: Record<string, number>;
  traffic_data?: {
    timestamps: string[];
    packets: number[];
    bytes: number[];
  };
  geo_data?: Array<{
    lat: number;
    lon: number;
    ip: string;
    packets: number;
  }>;
}

export interface SecurityAlert {
  alert_id: string;
  type: string;
  severity: string;
  description: string;
  timestamp: string;
  source_ip?: string;
  target_ip?: string;
  indicators: Record<string, any>;
  recommendations: string[];
}

export interface NetworkMonitoringRequest {
  interface: string;
  duration: number;
  capture_filter?: string;
}

export interface PacketAnalysis {
  file_hash: string;
  packet_count: number;
  protocols: Record<string, number>;
  timestamp: string;
  duration?: number;
  avg_packet_size?: number;
  top_sources?: Record<string, number>;
  top_destinations?: Record<string, number>;
}

export interface NetworkScanResult {
  indicator: string
  type: 'ip' | 'domain' | 'hash'
  risk_score: number
  alerts: string[]
  timestamp: string
}

export interface NetworkScanRequest {
  indicator: string
  type: string
}

// Common Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
}

// API Error Types
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}