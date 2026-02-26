import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

interface TrafficGraphProps {
  data?: {
    timestamps: string[];
    packets: number[];
    bytes: number[];
  };
}

export function TrafficGraph({ data }: TrafficGraphProps) {
  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Network Traffic</Typography>
          <Typography variant="body2" color="textSecondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Packets/s',
        data: data.packets,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Bytes/s',
        data: data.bytes,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Network Traffic Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Traffic
        </Typography>
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}