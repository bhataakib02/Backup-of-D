import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  status: "resolved" | "investigating" | "in-progress";
  timestamp: string;
  assignee: string;
}

const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Suspicious login from anomalous geolocation",
    status: "resolved",
    timestamp: "14:32",
    assignee: "SOC Team Alpha",
  },
  {
    id: "2",
    title: "Malware signature detected in email attachment",
    status: "investigating",
    timestamp: "14:15",
    assignee: "Threat Hunter-02",
  },
  {
    id: "3",
    title: "Unusual data exfiltration pattern detected",
    status: "in-progress",
    timestamp: "13:45",
    assignee: "IR Team Beta",
  },
  {
    id: "4",
    title: "Multiple failed authentication attempts",
    status: "resolved",
    timestamp: "12:20",
    assignee: "SOC Team Alpha",
  },
];

const statusConfig = {
  resolved: { icon: CheckCircle, color: "text-accent", badge: "outline" },
  investigating: { icon: AlertCircle, color: "text-warning", badge: "secondary" },
  "in-progress": { icon: PlayCircle, color: "text-primary", badge: "default" },
};

export default function IncidentTimeline() {
  return (
    <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Incidents</h3>
      </div>

      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

        {mockIncidents.map((incident, index) => {
          const config = statusConfig[incident.status];
          const Icon = config.icon;

          return (
            <div key={incident.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full border-2 border-border bg-card flex items-center justify-center z-10 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{incident.title}</h4>
                    <Badge variant={config.badge as any} className="text-xs">
                      {incident.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{incident.timestamp}</span>
                    <span>•</span>
                    <span>{incident.assignee}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
