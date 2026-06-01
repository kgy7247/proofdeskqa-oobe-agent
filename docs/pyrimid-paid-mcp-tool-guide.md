# Sell a Paid MCP Tool with x402 and Pyrimid

This guide shows a reproducible path for turning an MCP tool or simple API endpoint into a paid tool discoverable through Pyrimid. It uses public Pyrimid endpoints as the working reference so another agent can reproduce the flow before writing its own vendor integration.

## Working Endpoint

Use the public seed product below to inspect the expected payment flow:

```text
GET https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp
```

Unauthenticated requests return `402 Payment Required`. That is the desired behavior for a paid MCP/API tool: the caller first receives machine-readable payment terms, pays with x402/Base USDC, then retries with payment proof.

Verification command:

```powershell
Invoke-WebRequest `
  -Uri 'https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp' `
  -Headers @{ Accept = 'application/json' } `
  -UseBasicParsing
```

Observed response summary:

```json
{
  "status": 402,
  "error": "payment_required",
  "message": "Pay $0.10 USDC on Base through Pyrimid, then retry with X-PAYMENT or X-PAYMENT-TX.",
  "docs": "https://pyrimid.ai/quickstart",
  "catalog": "https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed"
}
```

The response also includes an `X-Payment-Required` header with the product terms. The important fields are:

```json
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "base",
  "asset": "USDC",
  "maxAmountRequired": "0.10",
  "payTo": "0xc949AEa380D7b7984806143ddbfE519B03ABd68B",
  "productId": "mcp-server-audit",
  "vendorId": "pyrimid-growth",
  "affiliateBps": 4000,
  "protocol": "pyrimid"
}
```

## Catalog Metadata

Agents need a catalog entry before they can reliably buy or recommend a tool. Pyrimid exposes catalog metadata here:

```text
GET https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed
```

Relevant catalog entry:

```json
{
  "vendor_id": "pyrimid-growth",
  "vendor_name": "Pyrimid Growth",
  "product_id": "mcp-server-audit",
  "description": "Paid MCP monetization audit: tells an MCP server how to add paid tools, x402 pricing, and affiliate routing.",
  "category": "devtools",
  "price_display": "$0.10",
  "affiliate_bps": 4000,
  "endpoint": "https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp",
  "method": "GET",
  "network": "base",
  "asset": "USDC",
  "source": "pyrimid-seed",
  "sdk_integrated": true
}
```

The MCP discovery document is also public:

```text
GET https://pyrimid.ai/.well-known/mcp.json
```

It points agents to:

- MCP endpoint: `https://pyrimid.ai/api/mcp`
- Catalog: `https://pyrimid.ai/api/v1/catalog`
- Agent discovery: `https://pyrimid.ai/agents.txt`
- LLM instructions: `https://pyrimid.ai/llms.txt`

## Vendor Implementation Pattern

For your own paid tool, expose a normal endpoint first:

```text
GET https://your-domain.example/api/tools/repo-risk?repo=https://github.com/org/repo
```

Before payment, return `402 Payment Required` with JSON and an `X-Payment-Required` header:

```json
{
  "error": "payment_required",
  "message": "Pay $0.05 USDC on Base, then retry with X-PAYMENT or X-PAYMENT-TX.",
  "accepts": [
    {
      "x402Version": 2,
      "scheme": "exact",
      "network": "base",
      "asset": "USDC",
      "maxAmountRequired": "0.05",
      "payTo": "0xYOUR_VENDOR_WALLET",
      "resource": "https://your-domain.example/api/tools/repo-risk",
      "description": "Repository risk scan for MCP and agent-tool vendors.",
      "mimeType": "application/json",
      "vendorId": "your-vendor-id",
      "productId": "repo-risk-scan",
      "affiliateBps": 2000,
      "protocol": "pyrimid"
    }
  ],
  "docs": "https://pyrimid.ai/quickstart"
}
```

After payment proof is present, validate the proof and return the paid result:

```json
{
  "result": {
    "repo": "https://github.com/org/repo",
    "risk_level": "medium",
    "paid_tool_recommendation": {
      "price_usdc": "0.05",
      "route": "/api/tools/repo-risk",
      "catalog_product_id": "repo-risk-scan"
    }
  },
  "routed_by": "pyrimid"
}
```

## Minimal MCP Wrapper

If the product is an MCP tool, keep the MCP server free to discover and put payment enforcement at the tool execution endpoint.

Example tool shape:

```json
{
  "name": "repo_risk_scan",
  "description": "Paid repository risk scan for MCP/x402 monetization readiness.",
  "inputSchema": {
    "type": "object",
    "required": ["repo"],
    "properties": {
      "repo": { "type": "string" }
    }
  }
}
```

Tool call flow:

1. Agent discovers MCP tools through your MCP endpoint.
2. Agent calls `repo_risk_scan`.
3. Your server returns a 402 payment requirement if no payment proof is provided.
4. Agent pays using x402/Base USDC.
5. Agent retries with `X-PAYMENT` or `X-PAYMENT-TX`.
6. Your server returns the paid JSON result.

## Checklist

- Public discovery: publish `.well-known/mcp.json`, `llms.txt`, or `agents.txt`.
- Catalog fields: include `vendor_id`, `product_id`, endpoint, method, price, network, asset, category, tags, and output schema.
- Payment behavior: return HTTP 402 before payment, not a generic 401 or HTML paywall.
- Retry behavior: document exactly which header the buyer should send after payment.
- Pricing: start with a small price such as `$0.02` to `$0.10` USDC for agent testing.
- Affiliate routing: include `affiliate_bps` if you want other agents to recommend the tool.
- Verification: test with a plain unauthenticated request and confirm the 402 body and header are machine-readable.

## References

- Pyrimid quickstart: `https://pyrimid.ai/quickstart`
- Pyrimid seed catalog: `https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed`
- Pyrimid MCP discovery: `https://pyrimid.ai/.well-known/mcp.json`
- Working 402 endpoint: `https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp`
