import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Globe, Database } from "lucide-react";

interface ThreatItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  source: string;
  timestamp: string;
}

const mockThreats: ThreatItem[] = [
  {
    id: "1",
    severity: "critical",
    type: "Ransomware",
    description: "LockBit 3.0 campaign detected targeting financial sector",
    source: "Dark Web Intel",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    severity: "high",
    type: "Phishing",
    description: "Sophisticated spear-phishing campaign with CEO impersonation",
    source: "Email Gateway",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    severity: "high",
    type: "Zero-Day",
    description: "CVE-2025-1234 actively exploited in enterprise networks",
    source: "Global Threat Feed",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    severity: "medium",
    type: "Data Leak",
    description: "Corporate credentials found on Telegram channel",
    source: "OSINT Monitor",
    timestamp: "2 hours ago",
  },
];

const severityConfig = {
  critical: { color: "bg-destructive", badge: "destructive", icon: AlertTriangle },
  high: { color: "bg-warning", badge: "default", icon: AlertTriangle },
  medium: { color: "bg-primary", badge: "secondary", icon: Shield },
  low: { color: "bg-accent", badge: "outline", icon: Shield },
};

export default function ThreatFeed() {
  return (
    <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Live Threat Intelligence</h3>
        </div>
        <Badge variant="outline" className="text-accent border-accent/50">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Live
        </Badge>
      </div>

      <div className="space-y-4">
        {mockThreats.map((threat) => {
          const config = severityConfig[threat.severity];
          const Icon = config.icon;
          
          return (
            <div
              key={threat.id}
              className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-all bg-background/50"
            >
              <div className={`flex-shrink-0 w-1 rounded-full ${config.color}`} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{threat.type}</span>
                  </div>
                  <Badge variant={config.badge as any} className="text-xs">
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{threat.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {threat.source}
                  </span>
                  <span>{threat.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
