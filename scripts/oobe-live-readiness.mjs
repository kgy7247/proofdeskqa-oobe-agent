import { mkdir, writeFile } from "node:fs/promises";

const checks = [];

async function checkImport(name) {
  try {
    const mod = await import(name);
    checks.push({
      name,
      status: "ok",
      exportedSymbols: Object.keys(mod).slice(0, 12)
    });
  } catch (error) {
    checks.push({
      name,
      status: "error",
      error: error.message
    });
  }
}

await checkImport("@oobe-protocol-labs/synapse-client-sdk");
try {
  const mod = await import("@oobe-protocol-labs/synapse-sap-sdk");
  checks.push({
    name: "@oobe-protocol-labs/synapse-sap-sdk",
    status: "ok",
    importMode: "package-esm",
    exportedSymbols: Object.keys(mod).slice(0, 12)
  });
} catch (esmError) {
  try {
    const mod = await import("../node_modules/@oobe-protocol-labs/synapse-sap-sdk/dist/cjs/index.js");
    checks.push({
      name: "@oobe-protocol-labs/synapse-sap-sdk",
      status: "ok",
      importMode: "direct-cjs-fallback",
      esmError: esmError.message,
      exportedSymbols: Object.keys(mod).slice(0, 12)
    });
  } catch (cjsError) {
    checks.push({
      name: "@oobe-protocol-labs/synapse-sap-sdk",
      status: "error",
      error: `${esmError.message}; CJS fallback failed: ${cjsError.message}`
    });
  }
}
await checkImport("@virtuals-protocol/acp-node-v2");

const requiredEnv = [
  "SYNAPSE_RPC_URL",
  "SYNAPSE_PRIVATE_KEY",
  "ACE_DATA_CLOUD_API_KEY",
  "X402_FACILITATOR_URL",
  "OOBE_AGENT_REGISTRATION_TX",
  "PUBLIC_REPO_URL",
  "PUBLIC_DEMO_URL"
];

const env = requiredEnv.map((name) => ({
  name,
  present: Boolean(process.env[name])
}));

const blockers = [
  ...checks.filter((check) => check.status !== "ok").map((check) => `${check.name}: ${check.error}`),
  ...env.filter((item) => !item.present).map((item) => `missing env ${item.name}`)
];

const report = {
  status: blockers.length === 0 ? "ready_for_live_oobe_submission" : "not_ready",
  checks,
  env,
  blockers,
  notes: [
    "Do not paste private keys in chat.",
    "Set secrets locally, then rerun this readiness check.",
    "The local demo remains valid as an offline evidence generator, but bounty submission needs live SAP/Ace/x402 evidence."
  ]
};

await mkdir("output", { recursive: true });
await writeFile("output/oobe-live-readiness.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
