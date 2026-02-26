import React, { useState } from 'react'
import { 
  Paper, Typography, TextField, Button, 
  Grid, Alert, CircularProgress
} from '@mui/material'
import { PhishingResult } from '../types'
import { analyzeThreat } from '../api'

export default function PhishingAnalysis() {
  const [url, setUrl] = useState('')
  const [emailText, setEmailText] = useState('')
  const [result, setResult] = useState<PhishingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await analyzeThreat({
        url,
        emailText,
        type: 'phishing'
      })
      setResult(data)
    } catch (err) {
      setError('Failed to analyze: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Phishing Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL to analyze"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Email text (optional)"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste suspicious email content here..."
          />
        </Grid>

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            onClick={handleAnalyze}
            disabled={loading || !url}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {result && (
          <Grid item xs={12}>
            <Alert 
              severity={result.threat ? "error" : "success"}
              sx={{ mb: 2 }}
            >
              {result.threat 
                ? `Threat detected! Risk level: ${result.risk_level}`
                : 'No immediate threats detected'
              }
            </Alert>

            <Typography variant="subtitle1" gutterBottom>
              Analysis Details:
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}