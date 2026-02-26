import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { SecurityAlert } from '../../types';

interface AlertListProps {
  alerts: SecurityAlert[];
}

export function AlertList({ alerts }: AlertListProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (!alerts.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Security Alerts
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No alerts to display
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Security Alerts
        </Typography>
        <List>
          {alerts.map((alert) => (
            <ListItem key={alert.alert_id} divider>
              <ListItemIcon>{getSeverityIcon(alert.severity)}</ListItemIcon>
              <ListItemText
                primary={
                  <>
                    {alert.description}
                    <Chip
                      size="small"
                      label={alert.severity}
                      color={getSeverityColor(alert.severity) as any}
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={
                  <>
                    {alert.timestamp}
                    {alert.source_ip && ` • Source: ${alert.source_ip}`}
                    {alert.target_ip && ` • Target: ${alert.target_ip}`}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}