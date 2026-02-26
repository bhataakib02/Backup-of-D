# threat-intel Supabase Edge Function

This function exposes several threat intelligence utilities via a single POST endpoint. Use the `action` field in the JSON body to invoke a specific utility.

Example request payloads:

- Ingest dark web indicators:

```
{ "action": "ingest_darkweb_indicators", "sources": ["https://pastebin.com/raw/xxxx"] }
```

- Correlate:

```
{ "action": "correlate_darkweb_with_internal_iocs", "darkweb": [...], "internal": [...], "fuzzy": true }
```

- Trace crypto address:

```
{ "action": "trace_crypto_wallet_transactions", "address": "0x..." }
```

The function is implemented in Deno and intended for use as a Supabase Edge Function. It is intentionally self-contained and safe to extend with provider integrations (block explorers, TIPs, etc.).

Environment variables (optional providers):

- `VIRUSTOTAL_API_KEY` - If set, the function will call VirusTotal to enrich domain/ip/file indicators.
- `ETHERSCAN_API_KEY` - If set, the function will query Etherscan for ETH transactions for `trace_crypto_wallet_transactions`.
- `BLOCKCHAIR_API_KEY` - If set, Blockchair will be used as a fallback provider for blockchain data.

If no provider keys are configured the function falls back to safe simulated responses and local extraction logic.
