import {
  NetworkScanRequest,
  NetworkScanResult,
  NetworkMonitoringRequest,
  NetworkTrafficStats,
  SecurityAlert,
  ApiResponse,
  ApiError
} from './types'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    throw new ApiError(
      data.error || 'An unexpected error occurred',
      response.status
    )
  }

  return data
}

export async function analyzeNetwork(params: NetworkScanRequest): Promise<NetworkScanResult> {
  const response = await fetch(`${API_BASE_URL}/api/network/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  return handleResponse<NetworkScanResult>(response)
}

export async function analyzeMalware(params: { sample: string }): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/malware/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  return handleResponse<any>(response)
}

export async function startMonitoring(params: NetworkMonitoringRequest): Promise<{ stats: NetworkTrafficStats }> {
  const response = await fetch(`${API_BASE_URL}/api/monitor/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return handleResponse<{ stats: NetworkTrafficStats }>(response);
}

export async function stopMonitoring(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/monitor/stop`, {
    method: 'POST',
  });

  return handleResponse<void>(response);
}

export async function uploadPcap(file: File): Promise<{ filename: string; packet_count: number; analysis: any; alerts: SecurityAlert[] }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze/pcap`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<{ filename: string; packet_count: number; analysis: any; alerts: SecurityAlert[] }>(response);
}

// Add additional API client functions here for other security analysis endpoints