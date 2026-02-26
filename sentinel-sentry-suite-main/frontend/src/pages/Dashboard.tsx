import React from 'react';
import {
  Grid,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  NetworkCheck as NetworkIcon,
  PhishingOutlined as PhishingIcon,
  BugReport as MalwareIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
// Local lightweight placeholders to avoid cross-package import resolution issues.
type MetricCardProps = {
  title: string;
  value: string | number;
  change?: number | string;
  unit?: string;
  color?: 'error' | 'warning' | 'success' | 'info';
};

function MetricCard({ title, value, change, unit }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h5">
          {value} {unit || ''}
        </Typography>
        {change !== undefined && (
          <Typography variant="caption">{String(change)}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

function ThreatFeed() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Threat Feed</Typography>
      <Typography variant="body2">No items (placeholder)</Typography>
    </Paper>
  );
}

function IncidentTimeline() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Incident Timeline</Typography>
      <Typography variant="body2">No incidents (placeholder)</Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const metrics = [
    {
      title: 'Network Threats',
      value: '12',
      icon: <NetworkIcon />,
      change: '+2',
      duration: 'since yesterday',
    },
    {
      title: 'Phishing Attempts',
      value: '45',
      icon: <PhishingIcon />,
      change: '-5',
      duration: 'since yesterday',
    },
    {
      title: 'Malware Detected',
      value: '3',
      icon: <MalwareIcon />,
      change: '0',
      duration: 'since yesterday',
    },
    {
      title: 'Security Score',
      value: '85%',
      icon: <SecurityIcon />,
      change: '+5',
      duration: 'since last week',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Security Dashboard
        </Typography>
        <IconButton>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Metrics */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}

        {/* Threat Feed */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Threats
            </Typography>
            <ThreatFeed />
          </Paper>
        </Grid>

        {/* Incident Timeline */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Incident Timeline
            </Typography>
            <IncidentTimeline />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}