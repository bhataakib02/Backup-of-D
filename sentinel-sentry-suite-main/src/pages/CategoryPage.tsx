import { useParams } from 'react-router-dom';
import categories from '@/lib/functionCatalog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import threatIntel, { abuseIpLookup, shodanLookup, otxLookup } from '@/lib/threatIntel';
import runMockFunction from '@/lib/functionMocks';

export default function CategoryPage() {
  const { name } = useParams();
  const decoded = name ? decodeURIComponent(name) : '';
  const category = categories.find((c) => c.name === decoded);
  const [output, setOutput] = useState<string>('');

  if (!category) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p className="text-sm text-muted-foreground">No category named {decoded}</p>
      </div>
    );
  }

  async function run(fn: string) {
    setOutput('Running...');
    try {
      let res: any;
      // threatIntel functions
      if (fn === 'ingest_darkweb_indicators') res = await threatIntel.ingestDarkweb(['https://pastebin.com/raw/5fZxYwQx']);
      else if (fn === 'correlate_darkweb_with_internal_iocs') res = await threatIntel.correlateDarkweb([{ value: '192.0.2.1', type: 'ip' }], [{ value: '192.0.2.1', type: 'ip' }], true);
      else if (fn === 'monitor_pastebin_gists_for_iocs') res = await threatIntel.monitorPastes(['https://pastebin.com/raw/5fZxYwQx']);
      else if (fn === 'trace_crypto_wallet_transactions') res = await threatIntel.traceWallet('0x0000000000000000000000000000000000000000');
      else if (fn === 'analyze_global_threat_exchange_standards') res = await threatIntel.analyzeStix({ value: 'example.com', type: 'domain' });
  else if (fn === 'abuseipdb_lookup') res = await abuseIpLookup('198.51.100.23');
  else if (fn === 'shodan_lookup') res = await shodanLookup('198.51.100.23');
  else if (fn === 'otx_lookup') res = await otxLookup('198.51.100.23');
      else if (fn === 'zeek_log_parse' || fn === 'suricata_eve_parse') res = { note: 'Use Provider Tools to parse logs' };
      else res = await runMockFunction(fn, {});
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setOutput(String(err));
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {category.functions.map((fn) => (
            <Button key={fn} size="sm" onClick={() => run(fn)}>{fn}</Button>
          ))}
        </div>
      </Card>

      <div>
        <h4 className="text-lg font-semibold mb-2">Output</h4>
        <pre className="p-3 bg-card/50 border-border rounded-md h-64 overflow-auto">{output || 'No output yet'}</pre>
      </div>
    </div>
  );
}
