import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "accent" | "warning" | "destructive";
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral",
  color = "primary" 
}: MetricCardProps) {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    accent: "text-accent border-accent/20 bg-accent/5",
    warning: "text-warning border-warning/20 bg-warning/5",
    destructive: "text-destructive border-destructive/20 bg-destructive/5",
  };

  const trendColors = {
    up: "text-accent",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", trendColors[trend])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg border", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
