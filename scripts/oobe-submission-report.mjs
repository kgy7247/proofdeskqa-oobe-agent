import { readFile, writeFile, mkdir } from "node:fs/promises";

const run = JSON.parse(await readFile("output/oobe-agent-run.json", "utf8"));

const lines = [
  "# ProofDeskQA OOBE Evidence Report",
  "",
  `Run ID: \`${run.runId}\``,
  `Completed: \`${run.completedAt}\``,
  "",
  "## Agent",
  "",
  `- Name: \`${run.agent.name}\``,
  `- Virtuals agent: ${run.agent.virtualsAgentUrl}`,
  `- Settlement wallet: \`${run.agent.settlementWallet}\``,
  "",
  "## Requirement Coverage",
  "",
  ...run.bountyFit.requiredPiecesCovered.map((item) => `- ${item}`),
  "",
  "## Tool Calls",
  "",
  "| Provider | Service | Payment ID | Result Summary |",
  "| --- | --- | --- | --- |",
  ...run.executions.map((item) => {
    const resultSummary = item.result.brief
      ?? item.result.sentinel
      ?? item.result.findings?.[0]
      ?? item.result.risks?.[0]?.issue
      ?? "completed";
    return `| ${item.provider} | \`${item.serviceId}\` | \`${item.paymentId}\` | ${String(resultSummary).replaceAll("|", "/")} |`;
  }),
  "",
  "## Payment Ledger",
  "",
  "| Status | Route | Amount USDC | Payer | Settlement Wallet |",
  "| --- | --- | ---: | --- | --- |",
  ...run.payments.map((payment) => `| ${payment.status} | ${payment.route} | ${payment.amountUsdc.toFixed(3)} | \`${payment.payer}\` | \`${payment.settlementWallet}\` |`),
  "",
  "## Totals",
  "",
  `- Calls: ${run.totals.calls}`,
  `- Ace calls: ${run.totals.aceCalls}`,
  `- Sentinel calls: ${run.totals.sentinelCalls}`,
  `- Simulated payment volume: ${run.totals.simulatedPaymentVolumeUsdc} USDC`,
  "",
  "## Missing For Live Submission",
  "",
  ...run.bountyFit.missingForFinalSubmission.map((item) => `- ${item}`),
  ""
];

await mkdir("output", { recursive: true });
await writeFile("output/oobe-submission-report.md", lines.join("\n"));
console.log(JSON.stringify({
  status: "ok",
  output: "output/oobe-submission-report.md"
}, null, 2));
