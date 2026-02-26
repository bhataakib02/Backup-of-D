import Hero from "@/components/Hero";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Database, Activity, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Hero />

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Link to="/auth">
          <Button size="lg" variant="default" className="gap-2">
            <LogIn className="w-5 h-5" />
            Get Started
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Threat Intelligence</h3>
            <p className="text-muted-foreground">
              Real-time threat detection and analysis powered by AI-driven insights
            </p>
          </Card>
          <Card className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all">
            <Activity className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Incident Response</h3>
            <p className="text-muted-foreground">
              Automated incident management and orchestration across your security stack
            </p>
          </Card>
          <Card className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all">
            <Database className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">400+ Functions</h3>
            <p className="text-muted-foreground">
              Comprehensive security operations functions ready for deployment
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}