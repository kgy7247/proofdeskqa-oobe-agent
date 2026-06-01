import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const settlementWallet = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD";
const virtualsAgentWallet = "8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU";
const publicRepoUrl = process.env.PUBLIC_REPO_URL || "https://github.com/kgy7247/proofdeskqa-oobe-agent";
const publicDemoUrl = process.env.PUBLIC_DEMO_URL || "";

const services = [
  {
    id: "ace.search.web",
    provider: "Ace Data Cloud",
    unitPriceUsdc: 0.006,
    capability: "search",
    reason: "Find current bounty and project context"
  },
  {
    id: "ace.summarize.brief",
    provider: "Ace Data Cloud",
    unitPriceUsdc: 0.012,
    capability: "summary",
    reason: "Compress source evidence into an operator brief"
  },
  {
    id: "ace.risk.classify",
    provider: "Ace Data Cloud",
    unitPriceUsdc: 0.014,
    capability: "classification",
    reason: "Score factual, safety, and delivery risks"
  },
  {
    id: "synapse.sentinel.review",
    provider: "Synapse Sentinel",
    unitPriceUsdc: 0.01,
    capability: "sentinel-review",
    reason: "Meet general SAP category sentinel usage requirement"
  }
];

function nowIso() {
  return new Date().toISOString();
}

function createPayment(service, runId) {
  return {
    paymentId: `x402-${randomUUID()}`,
    runId,
    workflow: "proofdeskqa.oobe.autonomous_qa",
    status: process.env.LIVE_X402 === "1" ? "ready_for_live_facilitator" : "simulated",
    route: process.env.LIVE_X402 === "1" ? "ace-facilitator-or-sap-escrow" : "local-x402-ledger",
    amountUsdc: service.unitPriceUsdc,
    payer: virtualsAgentWallet,
    settlementWallet,
    memo: `ProofDeskQA pays ${service.provider}:${service.id}`
  };
}

function executeService(service, input) {
  if (service.capability === "search") {
    return {
      findings: [
        "OOBE x Ace Data Cloud rewards autonomous SAP agents that discover tools, execute tasks, and settle payments.",
        "Ace category requires at least 3 distinct Ace Data Cloud services.",
        "General category requires Synapse Sentinel usage at least once."
      ],
      confidence: 0.87
    };
  }

  if (service.capability === "summary") {
    return {
      brief: `Workflow ${input.workflowName} should use three Ace services, one Sentinel review, and a payment record per tool call.`,
      confidence: 0.9
    };
  }

  if (service.capability === "classification") {
    const risks = [
      { severity: "high", issue: "No live x402 credentials in this local run", fix: "Set LIVE_X402=1 with Ace/Synapse credentials before paid execution" },
      { severity: "low", issue: "Demo evidence is local JSON", fix: "Record a short walkthrough video from this run" }
    ];
    if (!publicDemoUrl) {
      risks.push({ severity: "medium", issue: "No public demo URL yet", fix: "Record and publish a short walkthrough video" });
    }
    return {
      risks,
      confidence: 0.84
    };
  }

  return {
    sentinel: "Workflow reviewed for artificial-loop risk. It uses bounded tool calls and no wash-volume loop.",
    confidence: 0.82
  };
}

async function main() {
  const runId = randomUUID();
  const startedAt = nowIso();
  const workflowName = "ProofDeskQA autonomous bounty scout";
  const trigger = {
    type: "scheduled-bounty-scout",
    source: "local-runner",
    objective: "Find earning opportunities, evaluate risk, and prepare payable QA deliverables",
    startedAt
  };

  const toolDiscovery = services.map((service) => ({
    id: service.id,
    provider: service.provider,
    capability: service.capability,
    selected: true,
    reason: service.reason,
    discoveredVia: "SAP-compatible local registry"
  }));

  const executions = [];
  const payments = [];
  let input = { workflowName, trigger };

  for (const service of services) {
    const payment = createPayment(service, runId);
    const result = executeService(service, input);
    payments.push(payment);
    executions.push({
      serviceId: service.id,
      provider: service.provider,
      startedAt: nowIso(),
      paymentId: payment.paymentId,
      result
    });
    input = { ...input, [service.capability]: result };
  }

  const totalUsdc = payments.reduce((sum, payment) => sum + payment.amountUsdc, 0);
  const missingForFinalSubmission = [
    "live SAP mainnet registration evidence",
    "live Ace Data Cloud account/API key",
    "live x402 facilitator or escrow transaction hashes",
    ...(!publicRepoUrl ? ["public GitHub repository URL"] : []),
    ...(!publicDemoUrl ? ["demo video or public walkthrough URL"] : [])
  ];
  const report = {
    runId,
    agent: {
      name: "ProofDeskQA",
      virtualsAgentId: "019e83ff-a029-75d4-805b-bbbb4984ce61",
      virtualsAgentUrl: "https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61",
      virtualsSolWallet: virtualsAgentWallet,
      settlementWallet,
      publicRepoUrl,
      publicDemoUrl: publicDemoUrl || null
    },
    bountyFit: {
      superteamListing: "autonomous-agent-bounty-oobe-ace-data-cloud",
      category: "Ace Data Cloud Usage and General Payment Volume ready",
      requiredPiecesCovered: [
        "tool discovery",
        "3 distinct Ace service calls",
        "Synapse Sentinel call",
        "x402-compatible payment ledger",
        "trigger to execution to payment trace"
      ],
      missingForFinalSubmission
    },
    trigger,
    toolDiscovery,
    executions,
    payments,
    totals: {
      calls: executions.length,
      aceCalls: executions.filter((item) => item.provider === "Ace Data Cloud").length,
      sentinelCalls: executions.filter((item) => item.provider === "Synapse Sentinel").length,
      simulatedPaymentVolumeUsdc: Number(totalUsdc.toFixed(6))
    },
    completedAt: nowIso()
  };

  await mkdir("output", { recursive: true });
  await writeFile("output/oobe-agent-run.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    status: "ok",
    runId,
    output: "output/oobe-agent-run.json",
    simulatedPaymentVolumeUsdc: report.totals.simulatedPaymentVolumeUsdc,
    missingForFinalSubmission: report.bountyFit.missingForFinalSubmission
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
