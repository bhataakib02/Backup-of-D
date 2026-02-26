// Network monitoring types and interfaces
export interface Packet {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  size: number;
  flags: string[];
  payload: string;
}

export interface AnomalyData {
  timestamp: string;
  metric: string;
  value: number;
  baseline: number;
  anomalyScore: number;
}

export interface AnomalyAlert {
  severity: 'low' | 'medium' | 'high';
  message: string;
  details: string;
  timestamp: string;
}

export interface NetworkData {
  packets: Packet[];
  anomalyData: AnomalyData[];
  anomalyAlerts: AnomalyAlert[];
  geoData: Array<{
    lat: number;
    lon: number;
    ip: string;
    packets: number;
  }>;
}

// Initial state for network monitoring
export const initialNetworkData: NetworkData = {
  packets: [],
  anomalyData: [],
  anomalyAlerts: [],
  geoData: []
};