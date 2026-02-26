import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface GeoMapProps {
  data?: Array<{
    lat: number;
    lon: number;
    ip: string;
    packets: number;
  }>;
}

export function GeoMap({ data }: GeoMapProps) {
  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Geographic Traffic Distribution</Typography>
          <Typography variant="body2" color="textSecondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Geographic Traffic Distribution
        </Typography>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.map((point, index) => (
              <CircleMarker
                key={index}
                center={[point.lat, point.lon]}
                radius={Math.min(20, Math.log2(point.packets) * 5)}
                fillColor="#ff7800"
                color="#000"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup>
                  IP: {point.ip}
                  <br />
                  Packets: {point.packets}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}