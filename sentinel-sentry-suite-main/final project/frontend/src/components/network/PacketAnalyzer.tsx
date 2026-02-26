import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';

interface Packet {
  id: string;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  size: number;
  flags: string[];
  payload: string;
}

interface PacketAnalyzerProps {
  packets: Packet[];
  onFilterChange?: (filter: string) => void;
}

export const PacketAnalyzer: React.FC<PacketAnalyzerProps> = ({ 
  packets, 
  onFilterChange 
}) => {
  const [protocolFilter, setProtocolFilter] = useState<string>('all');

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setProtocolFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const filteredPackets = protocolFilter === 'all' 
    ? packets 
    : packets.filter(p => p.protocol === protocolFilter);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Packet Analysis
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Protocol</InputLabel>
            <Select
              value={protocolFilter}
              label="Protocol"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="TCP">TCP</MenuItem>
              <MenuItem value="UDP">UDP</MenuItem>
              <MenuItem value="ICMP">ICMP</MenuItem>
              <MenuItem value="HTTP">HTTP</MenuItem>
              <MenuItem value="HTTPS">HTTPS</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Destination IP</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Size (bytes)</TableCell>
                <TableCell>Flags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackets.map((packet) => (
                <TableRow key={packet.id}>
                  <TableCell>{new Date(packet.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{packet.sourceIP}</TableCell>
                  <TableCell>{packet.destinationIP}</TableCell>
                  <TableCell>
                    <Chip 
                      label={packet.protocol} 
                      color={
                        packet.protocol === 'TCP' ? 'primary' :
                        packet.protocol === 'UDP' ? 'secondary' :
                        packet.protocol === 'ICMP' ? 'warning' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{packet.size}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {packet.flags.map((flag, index) => (
                        <Chip
                          key={index}
                          label={flag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};