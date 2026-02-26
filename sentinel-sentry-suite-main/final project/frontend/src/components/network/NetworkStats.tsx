import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { NetworkTrafficStats } from '../../types';

interface NetworkStatsProps {
  stats: NetworkTrafficStats | null;
}

export function NetworkStats({ stats }: NetworkStatsProps) {
  if (!stats) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Packets
            </Typography>
            <Typography variant="h6">
              {stats.packets_total.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Bytes
            </Typography>
            <Typography variant="h6">
              {formatBytes(stats.bytes_total)}
            </Typography>
          </Grid>
          {stats.protocols && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Protocol Distribution
              </Typography>
              {Object.entries(stats.protocols).map(([protocol, count]) => (
                <Typography key={protocol} variant="body2">
                  {protocol}: {count}
                </Typography>
              ))}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}