import { Shield, Search, ChevronRight, Database, Zap, Lock, Globe, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import threatIntel, { Indicator } from "@/lib/threatIntel";
import runMockFunction from "@/lib/functionMocks";
import categories from "@/lib/functionCatalog";

interface FunctionCategory {
  name: string;
  icon: any;
  count: number;
  color: string;
  functions: string[];
}


export default function Functions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [selectedFn, setSelectedFn] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [running, setRunning] = useState(false);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.functions.some((fn) => fn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function templateForFunction(fn: string) {
    switch (fn) {
      case 'ingest_darkweb_indicators':
        return JSON.stringify({ sources: ['https://pastebin.com/raw/5fZxYwQx'] }, null, 2);
      case 'correlate_darkweb_with_internal_iocs':
        return JSON.stringify({ darkweb: [{ value: '192.0.2.1', type: 'ip' }], internal: [{ value: '192.0.2.1', type: 'ip' }], fuzzy: true }, null, 2);
      case 'monitor_pastebin_gists_for_iocs':
        return JSON.stringify({ sources: ['https://pastebin.com/raw/5fZxYwQx'] }, null, 2);
      case 'trace_crypto_wallet_transactions':
        return JSON.stringify({ address: '0x0000000000000000000000000000000000000000' }, null, 2);
      case 'analyze_global_threat_exchange_standards':
        return JSON.stringify({ indicator: { value: 'example.com', type: 'domain' } }, null, 2);
      default:
        return JSON.stringify({ note: 'This function is not implemented yet. Provide parameters as JSON.' }, null, 2);
    }
  }

  async function runFunctionByName(fn: string, paramsObj: any) {
    // Map known functions to the threatIntel helper
    try {
      if (fn === 'ingest_darkweb_indicators') return await threatIntel.ingestDarkweb(paramsObj.sources || []);
      if (fn === 'correlate_darkweb_with_internal_iocs') return await threatIntel.correlateDarkweb(paramsObj.darkweb || [], paramsObj.internal || [], !!paramsObj.fuzzy);
      if (fn === 'monitor_pastebin_gists_for_iocs') return await threatIntel.monitorPastes(paramsObj.sources || []);
      if (fn === 'trace_crypto_wallet_transactions') return await threatIntel.traceWallet(paramsObj.address || paramsObj.addr);
      if (fn === 'analyze_global_threat_exchange_standards') return await threatIntel.analyzeStix(paramsObj.indicator || paramsObj);

      // Use local mock implementations for the rest so the UI is fully functional offline
      return await runMockFunction(fn, paramsObj);
    } catch (err) {
      return { error: String(err) };
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Function Catalog</h1>
                <p className="text-xs text-muted-foreground">400+ Security Operations Functions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="default" size="sm">
                  <Shield className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden border border-border bg-gradient-glow p-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-2">Comprehensive Security Function Library</h2>
            <p className="text-muted-foreground mb-6">
              Explore 400+ pre-built security operations functions covering threat intelligence,
              incident response, compliance, and advanced defense capabilities.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search functions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 border-border backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Functions</p>
            <p className="text-2xl font-bold">400+</p>
          </Card>
          <Card className="p-4 bg-card/50 border-border backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-1">Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </Card>
          <Card className="p-4 bg-card/50 border-border backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-1">Integrations</p>
            <p className="text-2xl font-bold">50+</p>
          </Card>
          <Card className="p-4 bg-card/50 border-border backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-1">API Endpoints</p>
            <p className="text-2xl font-bold">400+</p>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Function Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${category.color}/10 border border-${category.color}/20`}>
                      <Icon className={`w-6 h-6 text-${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold">{category.name}</h4>
                        <Badge variant="secondary">{category.count} functions</Badge>
                      </div>
                      <div className="space-y-2">
                        {category.functions.slice(0, 5).map((fn) => (
                          <div
                            key={fn}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedFn(fn);
                              setInputText(templateForFunction(fn));
                              setOutputText('');
                              setRunnerOpen(true);
                            }}
                          >
                            <ChevronRight className="w-3 h-3" />
                            <code className="text-xs">{fn}()</code>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="mt-4 text-primary">
                        View all {category.count} functions
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Threat Intel Demo */}
          <Card className="p-6 bg-card/40 border-border backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-3">Threat Intelligence — Quick Demo</h4>
            <p className="text-sm text-muted-foreground mb-4">Run small, safe demos of the threat-intel functions (calls the Supabase Edge Function).</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={async () => {
                try {
                  const r = await threatIntel.ingestDarkweb(["https://pastebin.com/raw/5fZxYwQx"]);
                  // eslint-disable-next-line no-console
                  console.log('ingest result', r);
                  alert(`Found ${r.indicators.length} indicators (see console)`);
                } catch (e) {
                  alert(String(e));
                }
              }}>Ingest</Button>

              <Button size="sm" onClick={async () => {
                try {
                  const dw: Indicator[] = [{ value: '192.0.2.1', type: 'ip' }];
                  const internal: Indicator[] = [{ value: '192.0.2.1', type: 'ip' }];
                  const r = await threatIntel.correlateDarkweb(dw, internal, true);
                  console.log('correlate', r);
                  alert(`Matches: ${r.matchCount}`);
                } catch (e) { alert(String(e)); }
              }}>Correlate</Button>

              <Button size="sm" onClick={async () => {
                try {
                  const r = await threatIntel.monitorPastes(["https://pastebin.com/raw/5fZxYwQx"]);
                  console.log('monitor', r);
                  alert(`Found ${r.found.length} items`);
                } catch (e) { alert(String(e)); }
              }}>Monitor Pastes</Button>

              <Button size="sm" onClick={async () => {
                try {
                  const r = await threatIntel.traceWallet('0x0000000000000000000000000000000000000000');
                  console.log('trace', r);
                  alert(`Risk score: ${r.riskScore}`);
                } catch (e) { alert(String(e)); }
              }}>Trace Wallet</Button>

              <Button size="sm" onClick={async () => {
                try {
                  const r = await threatIntel.analyzeStix({ value: 'example.com', type: 'domain' });
                  console.log('stix', r);
                  alert(`Normalized type: ${r.recommended.observable.type}`);
                } catch (e) { alert(String(e)); }
              }}>Analyze STIX</Button>
            </div>
          </Card>
        </div>

        {/* Integration Info */}
        <Card className="p-8 bg-gradient-primary/5 border-primary/20 backdrop-blur-sm">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">Enterprise Integration Ready</h3>
            <p className="text-muted-foreground mb-6">
              All functions are API-first, containerized, and ready for integration with your existing
              security stack including SIEM, SOAR, EDR, and threat intelligence platforms.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">REST API</Badge>
              <Badge variant="outline">GraphQL</Badge>
              <Badge variant="outline">Webhooks</Badge>
              <Badge variant="outline">SSE Streams</Badge>
              <Badge variant="outline">OpenAPI 3.0</Badge>
              <Badge variant="outline">OAuth 2.0</Badge>
            </div>
          </div>
        </Card>
      </main>

      {/* Runner Modal */}
      {runnerOpen && selectedFn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRunnerOpen(false)} />
          <div className="relative z-60 w-[90%] max-w-3xl bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Run: {selectedFn}()</h4>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => { setRunnerOpen(false); }}>Close</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Input (JSON)</p>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-48 p-2 bg-background/60 border border-border rounded-md monospace" />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={async () => {
                    setRunning(true);
                    setOutputText('');
                    try {
                      const parsed = JSON.parse(inputText || '{}');
                      const res = await runFunctionByName(selectedFn, parsed);
                      setOutputText(JSON.stringify(res, null, 2));
                    } catch (err) {
                      setOutputText(String(err));
                    } finally { setRunning(false); }
                  }}>{running ? 'Running...' : 'Run'}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setInputText(templateForFunction(selectedFn))}>Reset</Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Output</p>
                <pre className="w-full h-48 p-2 bg-background/60 border border-border rounded-md overflow-auto">{outputText || 'No output yet'}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
