import { describe, it, expect } from 'vitest';
import { extractIocsFromText, correlate_darkweb_with_internal_iocs } from '../src/lib/threatIntelUtils';

describe('threatIntelUtils', () => {
  it('extracts IPs, domains and hashes', () => {
    const text = `Contact admin at admin@example.com. Malicious host: 198.51.100.23 and domain evil.com. sha256: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
    const iocs = extractIocsFromText(text);
  const types = iocs.map((i: any) => i.type).sort();
    expect(types).toEqual(expect.arrayContaining(['ip', 'domain', 'email', 'sha256']));
  });

  it('correlates exact and fuzzy domain matches', () => {
    const darkweb = [{ value: 'sub.evil.com', type: 'domain' }];
    const internal = [{ value: 'evil.com', type: 'domain' }];
    const res = correlate_darkweb_with_internal_iocs(darkweb as any, internal as any, { fuzzy: true });
    expect(res.matchCount).toBeGreaterThan(0);
    expect(res.matches[0].score).toBe(0.75);
  });
});
