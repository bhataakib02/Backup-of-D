import categories from '@/lib/functionCatalog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import threatIntel from '@/lib/threatIntel';
import runMockFunction from '@/lib/functionMocks';
import { abuseIpLookup, shodanLookup, otxLookup, zeekParse, suricataParse } from '@/lib/threatIntel';

export default function AllFunctions() {
  const [output, setOutput] = useState<string>('');

  async function run(fn: string) {
    setOutput('Running...');
    try {
      // basic mapping: reuse threatIntel for its functions else use mocks
      let res: any;
      if (fn === 'ingest_darkweb_indicators') res = await threatIntel.ingestDarkweb(['https://pastebin.com/raw/5fZxYwQx']);
      else if (fn === 'correlate_darkweb_with_internal_iocs') res = await threatIntel.correlateDarkweb([{ value: '192.0.2.1', type: 'ip' }], [{ value: '192.0.2.1', type: 'ip' }], true);
      else if (fn === 'monitor_pastebin_gists_for_iocs') res = await threatIntel.monitorPastes(['https://pastebin.com/raw/5fZxYwQx']);
      else if (fn === 'trace_crypto_wallet_transactions') res = await threatIntel.traceWallet('0x0000000000000000000000000000000000000000');
      else if (fn === 'analyze_global_threat_exchange_standards') res = await threatIntel.analyzeStix({ value: 'example.com', type: 'domain' });
      else res = await runMockFunction(fn, {});
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setOutput(String(err));
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Functions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.functions.map((fn) => (
                <Button key={fn} size="sm" onClick={() => run(fn)}>{fn}</Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Provider Tools</h3>
          <div className="flex gap-2 mb-2">
            <input placeholder="IP for abuseipdb/shodan" id="provider-ip" className="p-2 border border-border rounded" />
            <Button onClick={async () => {
              const ip = (document.getElementById('provider-ip') as HTMLInputElement).value;
              const r = await abuseIpLookup(ip);
              setOutput(JSON.stringify(r, null, 2));
            }}>AbuseIPDB</Button>
            <Button onClick={async () => {
              const ip = (document.getElementById('provider-ip') as HTMLInputElement).value;
              const r = await shodanLookup(ip);
              setOutput(JSON.stringify(r, null, 2));
            }}>Shodan</Button>
            <Button onClick={async () => {
              const ip = (document.getElementById('provider-ip') as HTMLInputElement).value;
              const r = await otxLookup(ip);
              setOutput(JSON.stringify(r, null, 2));
            }}>OTX</Button>
          </div>

          <p className="text-sm text-muted-foreground mb-2">Paste Zeek/Suricata text below and parse:</p>
          <textarea id="provider-log" className="w-full h-32 p-2 border border-border rounded mb-2" />
          <div className="flex gap-2">
            <Button onClick={async () => {
              const text = (document.getElementById('provider-log') as HTMLTextAreaElement).value;
              const r = await zeekParse(text);
              setOutput(JSON.stringify(r, null, 2));
            }}>Parse Zeek</Button>
            <Button onClick={async () => {
              const text = (document.getElementById('provider-log') as HTMLTextAreaElement).value;
              const r = await suricataParse(text);
              setOutput(JSON.stringify(r, null, 2));
            }}>Parse Suricata</Button>
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Output</h4>
        <pre className="p-3 bg-card/50 border-border rounded-md h-64 overflow-auto">{output}</pre>
      </div>
    </div>
  );
}
