import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Line } from 'react-chartjs-2';

interface AnomalyData {
  timestamp: string;
  metric: string;
  value: number;
  baseline: number;
  anomalyScore: number;
}

interface AnomalyAlerts {
  severity: 'low' | 'medium' | 'high';
  message: string;
  details: string;
  timestamp: string;
}

interface AnomalyDetectionProps {
  data: AnomalyData[];
  alerts: AnomalyAlerts[];
  onSensitivityChange?: (value: number) => void;
  onMetricChange?: (metric: string) => void;
}

export const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({
  data,
  alerts,
  onSensitivityChange,
  onMetricChange
}) => {
  const [sensitivity, setSensitivity] = useState<number>(5);
  const [selectedMetric, setSelectedMetric] = useState<string>('traffic');

  const handleSensitivityChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setSensitivity(value);
    if (onSensitivityChange) {
      onSensitivityChange(value);
    }
  };

  const handleMetricChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedMetric(value);
    if (onMetricChange) {
      onMetricChange(value);
    }
  };

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Actual Value',
        data: data.map(d => d.value),
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Baseline',
        data: data.map(d => d.baseline),
        borderColor: 'rgba(192,192,192,0.5)',
        tension: 0.1,
        fill: false,
        borderDash: [5, 5]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Anomaly Detection Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Anomaly Detection
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  label="Metric"
                  onChange={handleMetricChange}
                >
                  <MenuItem value="traffic">Network Traffic</MenuItem>
                  <MenuItem value="latency">Latency</MenuItem>
                  <MenuItem value="errors">Error Rate</MenuItem>
                  <MenuItem value="requests">Request Rate</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom>
                Detection Sensitivity
              </Typography>
              <Slider
                value={sensitivity}
                onChange={handleSensitivityChange}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                aria-label="Anomaly Detection Sensitivity"
              />
            </Box>

            <Line data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Anomaly Alerts
        </Typography>
        {alerts.map((alert, index) => (
          <Alert 
            key={index} 
            severity={alert.severity === 'high' ? 'error' : 
                     alert.severity === 'medium' ? 'warning' : 'info'}
            sx={{ mb: 1 }}
          >
            <AlertTitle>
              {alert.message} - {new Date(alert.timestamp).toLocaleString()}
            </AlertTitle>
            {alert.details}
          </Alert>
        ))}
      </Grid>
    </Grid>
  );
};