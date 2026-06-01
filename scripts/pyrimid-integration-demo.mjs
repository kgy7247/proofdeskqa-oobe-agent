import { mkdir, writeFile } from "node:fs/promises";
import { PyrimidResolver } from "@pyrimid/sdk/resolver";
import { calculateSplit } from "@pyrimid/sdk/middleware";
import { PYRIMID_ADDRESSES } from "@pyrimid/sdk/types";

const affiliateId = process.env.PYRIMID_AFFILIATE_ID || "proofdeskqa-2ngzynm";
const catalogUrl = process.env.PYRIMID_CATALOG_URL || "https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed";
const need = process.argv.slice(2).join(" ") || "mcp audit x402 agent tools";

const resolver = new PyrimidResolver({
  affiliateId,
  catalogUrl,
  cacheTtlMs: 60_000,
  preferVerifiedVendors: false,
  maxPriceUsdc: 1_000_000,
});

const catalog = await resolver.getCatalog();
const matches = await resolver.findProducts(need, 5);
const stats = await resolver.getStats().catch((error) => ({
  affiliate_id: affiliateId,
  stats_lookup_error: error instanceof Error ? error.message : String(error),
}));

const recommendations = matches.map((product) => {
  const split = calculateSplit(product.price_usdc, product.affiliate_bps);
  return {
    product_id: product.product_id,
    vendor_id: product.vendor_id,
    vendor_name: product.vendor_name,
    category: product.category,
    endpoint: product.endpoint,
    method: product.method,
    price_display: product.price_display,
    affiliate_bps: product.affiliate_bps,
    tags: product.tags,
    split,
    affiliate_commission_display_usdc: (split.affiliate_commission / 1_000_000).toFixed(6),
  };
});

const output = {
  generatedAt: new Date().toISOString(),
  integration: {
    sdk: "@pyrimid/sdk",
    path: "PyrimidResolver embedded resolver",
    affiliateId,
    catalogUrl,
    need,
    paymentNetwork: "Base",
    asset: "USDC",
    contracts: PYRIMID_ADDRESSES.base,
  },
  catalog: {
    productCount: catalog.length,
    categories: [...new Set(catalog.map((product) => product.category))].sort(),
  },
  recommendations,
  affiliateStats: stats,
  nextPurchaseStep: "Call resolver.purchase(product, buyerWallet) after a funded Base USDC wallet is available.",
};

await mkdir("output", { recursive: true });
await writeFile("output/pyrimid-integration-demo.json", `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify(output, null, 2));
