import React, { useState } from 'react'
import {
  Paper, Typography, TextField, Button,
  Grid, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material'
import { NetworkScanResult } from '../types'
import { analyzeNetwork } from '../api'

export default function NetworkSecurity() {
  const [indicator, setIndicator] = useState('')
  const [indicatorType, setIndicatorType] = useState('ip')
  const [results, setResults] = useState<NetworkScanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await analyzeNetwork({
        indicator,
        type: indicatorType
      })
      setResults(prev => [data, ...prev])
    } catch (err) {
      setError('Failed to analyze: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Network Security Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Network Indicator"
            value={indicator}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndicator(e.target.value)}
            placeholder="Enter IP address, domain, or hash"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Type"
            value={indicatorType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIndicatorType(e.target.value)}
            SelectProps={{
              native: true
            }}
          >
            <option value="ip">IP Address</option>
            <option value="domain">Domain</option>
            <option value="hash">File Hash</option>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading || !indicator}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {results.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Analysis History
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Indicator</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Alerts</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.indicator}</TableCell>
                      <TableCell>{result.type}</TableCell>
                      <TableCell>
                        <Alert 
                          severity={
                            result.risk_score > 0.7 ? "error" :
                            result.risk_score > 0.4 ? "warning" : "success"
                          }
                          sx={{ display: 'inline-flex' }}
                        >
                          {(result.risk_score * 100).toFixed(0)}%
                        </Alert>
                      </TableCell>
                      <TableCell>
                        {result.alerts.length 
                          ? result.alerts.join(", ")
                          : "No alerts"
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(result.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}