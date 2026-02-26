import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  MonitorOutlined,
  SecurityOutlined,
  WarningOutlined,
  CloudUpload,
} from '@mui/icons-material';

import { NetworkStats } from '../components/network/NetworkStats';
import { TrafficGraph } from '../components/network/TrafficGraph';
import { AlertList } from '../components/network/AlertList';
import { PacketAnalyzer } from '../components/network/PacketAnalyzer';
import { AnomalyDetection } from '../components/network/AnomalyDetection';
import { GeoMap } from '../components/network/GeoMap';
import { startMonitoring, stopMonitoring, uploadPcap } from '../api';
import { NetworkTrafficStats, SecurityAlert } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function NetworkMonitoring() {
  const [activeTab, setActiveTab] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NetworkTrafficStats | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [packets, setPackets] = useState<Array<{
    id: string;
    timestamp: string;
    sourceIP: string;
    destinationIP: string;
    protocol: string;
    size: number;
    flags: string[];
    payload: string;
  }>>([]);
  const [anomalyData, setAnomalyData] = useState<Array<{
    timestamp: string;
    metric: string;
    value: number;
    baseline: number;
    anomalyScore: number;
  }>>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<Array<{
    severity: 'low' | 'medium' | 'high';
    message: string;
    details: string;
    timestamp: string;
  }>>([]);
  const [pcapResult, setPcapResult] = useState<null | {
    filename: string;
    packet_count: number;
    analysis?: any;
    alerts: SecurityAlert[];
  }>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isMonitoring) {
        handleStopMonitoring();
      }
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStartMonitoring = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await startMonitoring({ interface: 'any', duration: 3600 });
      setStats(response.stats);
      setIsMonitoring(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
    } finally {
      setLoading(false);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      setLoading(true);
      setError(null);
      await stopMonitoring();
      setIsMonitoring(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
        const response = await uploadPcap(selectedFile);
        // Handle response - update state with analysis results
        setAlerts((prev) => [...prev, ...response.alerts]);
        setPcapResult({ filename: response.filename, packet_count: response.packet_count, analysis: response.analysis, alerts: response.alerts });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PCAP');
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<MonitorOutlined />} label="Live Monitoring" />
          <Tab icon={<SecurityOutlined />} label="Analysis" />
          <Tab icon={<WarningOutlined />} label="Alerts" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color={isMonitoring ? 'error' : 'primary'}
                  onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : undefined}
                >
                  {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
              </Box>
                  {pcapResult && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Analysis summary</Typography>
                      <Typography variant="body2">Filename: {pcapResult.filename}</Typography>
                      <Typography variant="body2">Packets: {pcapResult.packet_count}</Typography>
                      {pcapResult.analysis?.protocols && (
                        <Typography variant="body2">Top protocols: {Object.entries(pcapResult.analysis.protocols).slice(0,5).map(([k,v]) => `${k}(${v})`).join(', ')}</Typography>
                      )}
                      {pcapResult.alerts.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {pcapResult.alerts.map((a, i) => (
                            <Alert key={i} severity="warning" sx={{ mb: 1 }}>{(a as any).message || JSON.stringify(a)}</Alert>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
            </Grid>

            <Grid item xs={12} md={8}>
              <TrafficGraph data={stats?.traffic_data} />
            </Grid>

            <Grid item xs={12} md={4}>
              <NetworkStats stats={stats} />
            </Grid>

            <Grid item xs={12}>
              <GeoMap data={stats?.geo_data} />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    PCAP Analysis
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <input
                      accept=".pcap,.pcapng"
                      style={{ display: 'none' }}
                      id="pcap-file-upload"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="pcap-file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                      >
                        Upload PCAP
                      </Button>
                    </label>
                    {selectedFile && (
                      <Button
                        sx={{ ml: 2 }}
                        variant="contained"
                        onClick={handleFileUpload}
                        disabled={loading}
                      >
                        Analyze
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <PacketAnalyzer packets={packets} />
            </Grid>

            <Grid item xs={12}>
              <AnomalyDetection
                data={anomalyData}
                alerts={anomalyAlerts}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AlertList alerts={alerts} />
        </TabPanel>
      </Paper>
    </Box>
  );
}