import { Button } from "@/components/ui/button";
import { Shield, Zap, Database, Activity } from "lucide-react";
import heroImage from "@/assets/hero-cyber.jpg";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-dark" />
        <img 
          src={heroImage} 
          alt="Cybersecurity network visualization" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-glow" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Enterprise Security Operations Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Next-Generation
            </span>
            <br />
            Cyber Defense Platform
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            400+ integrated security functions delivering real-time threat intelligence, 
            automated incident response, and comprehensive cyber defense capabilities.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                <Activity className="w-5 h-5" />
                Launch Dashboard
              </Button>
            </Link>
            <Link to="/functions">
              <Button variant="outline" size="xl">
                <Database className="w-5 h-5" />
                Explore Functions
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-primary/50 transition-all">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Threat Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Real-time correlation from dark web, OSINT, and global threat feeds
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-accent/50 transition-all">
              <Zap className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Automated Response</h3>
              <p className="text-sm text-muted-foreground">
                ML-powered incident detection with orchestrated remediation workflows
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-warning/50 transition-all">
              <Database className="w-10 h-10 text-warning mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Engine</h3>
              <p className="text-sm text-muted-foreground">
                Automated audit trails for ISO 27001, GDPR, and regulatory frameworks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
