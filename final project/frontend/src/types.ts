// Network Security Types
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