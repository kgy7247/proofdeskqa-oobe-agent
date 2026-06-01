import { mkdir, writeFile } from "node:fs/promises";

const BASE_USDC_WALLET = "0x66890857dc33d5066c28aadbeb7cd078f50799a3";
const CATALOG_URL = "https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed";
const OUTPUT_PATH = "output/pyrimid-signal-distribution.json";

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "ProofDeskQA signal distributor"
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
  }
  return JSON.parse(text);
}

function microsToUsdc(value) {
  return Number(value ?? 0) / 1_000_000;
}

function pickSignalProducts(products) {
  return products
    .filter((product) => {
      const haystack = [
        product.vendor_id,
        product.vendor_name,
        product.product_id,
        product.description,
        product.category,
        ...(product.tags ?? [])
      ].join(" ").toLowerCase();
      return haystack.includes("pragma") || haystack.includes("signal") || haystack.includes("trading");
    })
    .map((product) => {
      const priceUsdc = microsToUsdc(product.price_usdc);
      const commissionRate = Number(product.affiliate_bps ?? 0) / 10_000;
      return {
        vendor_id: product.vendor_id,
        vendor_name: product.vendor_name,
        product_id: product.product_id,
        endpoint: product.endpoint,
        method: product.method,
        category: product.category,
        price_usdc: priceUsdc,
        price_display: product.price_display,
        affiliate_bps: product.affiliate_bps,
        estimated_commission_usdc: Number((priceUsdc * commissionRate).toFixed(6)),
        network: product.network,
        asset: product.asset,
        source: product.source,
        tags: product.tags ?? []
      };
    })
    .sort((a, b) => b.estimated_commission_usdc - a.estimated_commission_usdc);
}

const catalog = await fetchJson(CATALOG_URL);
const products = pickSignalProducts(catalog.products ?? []);
const recommended = products[0] ?? null;

const report = {
  generatedAt: new Date().toISOString(),
  distributor: "ProofDeskQA",
  baseUsdcWallet: BASE_USDC_WALLET,
  catalogUrl: CATALOG_URL,
  catalogUpdatedAt: catalog.updated_at ?? null,
  totalCatalogProducts: catalog.total ?? (catalog.products ?? []).length,
  signalProductsFound: products.length,
  recommended,
  products,
  distributionPlan: {
    buyerFlow: [
      "Fetch Pyrimid catalog.",
      "Select the highest-fit trading signal product.",
      "Request the endpoint and receive HTTP 402 payment requirements.",
      "Buyer agent pays through Pyrimid Router on Base USDC.",
      "Pyrimid routes affiliate commission to the distributor wallet when configured by the buyer/payment path."
    ],
    targetBuyerAgents: [
      "trading research agents",
      "portfolio risk agents",
      "market briefing agents",
      "x402 buyer-agent demos"
    ],
    disclosure: "This distributor does not trade, provide financial advice, or self-purchase. Revenue only counts after a real non-self routed payment is received or claimable."
  }
};

await mkdir("output", { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
