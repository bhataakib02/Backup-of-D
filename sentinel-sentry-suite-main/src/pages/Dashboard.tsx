import { Shield, Activity, AlertTriangle, Database, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/MetricCard";
import ThreatFeed from "@/components/ThreatFeed";
import IncidentTimeline from "@/components/IncidentTimeline";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIncidents } from "@/hooks/useIncidents";
import { useThreats } from "@/hooks/useThreats";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { incidents } = useIncidents();
  const { threats } = useThreats();

  const stats = {
    activeIncidents: incidents?.filter(i => i.status !== 'resolved' && i.status !== 'closed').length || 0,
    criticalThreats: threats?.filter(t => t.severity === 'critical' || t.severity === 'high').length || 0,
    totalThreats: threats?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Security Operations Center</h1>
                <p className="text-xs text-muted-foreground">Real-time threat monitoring & response</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Link to="/functions">
                <Button variant="outline" size="sm">
                  <Database className="w-4 h-4" />
                  Functions
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden border border-border bg-gradient-glow p-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-2">Welcome to Security Command</h2>
            <p className="text-muted-foreground">
              Real-time monitoring and threat intelligence across your infrastructure
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Activity}
            title="Active Incidents"
            value={stats.activeIncidents.toString()}
            change={`${incidents?.length || 0} total`}
            trend="neutral"
          />
          <MetricCard
            icon={AlertTriangle}
            title="Critical Threats"
            value={stats.criticalThreats.toString()}
            change={`${stats.totalThreats} total threats`}
            trend={stats.criticalThreats > 0 ? "up" : "neutral"}
          />
          <MetricCard
            icon={Shield}
            title="Systems Protected"
            value="247"
            change="100% uptime"
            trend="neutral"
          />
          <MetricCard
            icon={Database}
            title="Total Functions"
            value="400+"
            change="8 categories"
            trend="neutral"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ThreatFeed />
          <IncidentTimeline />
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threat Intel Feeds</span>
                <span className="text-sm font-medium text-accent">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ML Detection Engine</span>
                <span className="text-sm font-medium text-accent">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Automation</span>
                <span className="text-sm font-medium text-accent">Operational</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Coverage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Segments</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Endpoints</span>
                <span className="text-sm font-medium">98.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cloud Assets</span>
                <span className="text-sm font-medium">100%</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ISO 27001</span>
                <span className="text-sm font-medium text-accent">Compliant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">GDPR</span>
                <span className="text-sm font-medium text-accent">Compliant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">SOC 2 Type II</span>
                <span className="text-sm font-medium text-accent">Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}