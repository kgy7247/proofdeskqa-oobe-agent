import { mkdir, readFile, writeFile } from "node:fs/promises";

const taskId = "b7c2a3c9-c412-4613-9cfb-d8a5f54d14b7";
const taskUrl = `https://app.gib.work/tasks/${taskId}`;
const taskApiUrl = `https://app.gib.work/api/tasks/${taskId}`;
const prUrl = "https://github.com/gibwork/gibwork-website/pull/13";
const payoutWalletSolana = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD";

const args = new Set(process.argv.slice(2));
const model = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";
const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const localDateStamp = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date()).replaceAll("-", "");
const outputPath =
  process.env.GIBWORK_AGENT_OUTPUT ||
  `output/gibwork-local-agent-run-${localDateStamp}.json`;

async function getText(path, fallback = "") {
  try {
    return await readFile(path, "utf8");
  } catch {
    return fallback;
  }
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ProofDeskQA local Gibwork bounty scout",
      accept: "application/json"
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
  }
  return JSON.parse(text);
}

async function callOllama(prompt) {
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 900
      }
    })
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
  }
  return JSON.parse(text).response?.trim() || "";
}

function compactTask(task) {
  return {
    id: task?.id ?? taskId,
    title: task?.title,
    status: task?.status,
    rewardAmount: task?.rewardAmount ?? task?.reward_amount ?? task?.budget,
    rewardToken: task?.rewardToken ?? task?.reward_token ?? task?.token,
    submissions: task?.submissions?.length ?? task?.submissionCount ?? task?.submissionsCount,
    pendingSubmissions: task?.pendingSubmissions ?? task?.pending_submissions,
    url: taskUrl
  };
}

function heuristicDecision(context) {
  const status = String(context.submissionStatus?.uiStatus || "").toLowerCase();
  if (status.includes("review")) {
    return [
      "Decision: wait for creator review while monitoring the PR and Gibwork task.",
      "Next action: do not resubmit unless the reviewer asks for changes.",
      "Follow-up draft: Thanks for reviewing. The PR is ready, build-verified, and includes viewport QA evidence. I can adjust scope if you want a narrower copy or layout pass.",
      "Revenue note: do not count this as earned until Gibwork marks the work accepted or funds are claimable."
    ].join("\n");
  }
  return [
    "Decision: finish or re-open the Gibwork submission flow.",
    "Next action: verify the logged-in Gibwork tab and submit the PR package.",
    "Follow-up draft: I completed the landing-page PR and attached verification evidence for review.",
    "Revenue note: this is still pending until accepted or claimable."
  ].join("\n");
}

function safeDecision(context, localLlmResponse) {
  const status = String(context.submissionStatus?.uiStatus || "").toLowerCase();
  if (status.includes("review")) {
    return [
      "Current status: Gibwork UI shows the submission is In Review.",
      "Next action: wait for creator review and monitor the GitHub PR; do not resubmit unless a reviewer asks for changes.",
      "Reviewer follow-up draft: Thanks for reviewing. The PR is ready, build-verified, and includes desktop/mobile viewport QA evidence. I can adjust the landing-page copy or section scope if you want a narrower pass.",
      "Evidence before counting revenue: Gibwork must show accepted/approved or funds claimable, or the payout wallet must show received USDC/SOL.",
      localLlmResponse ? `Local LLM draft generated: yes, model=${model}. Deterministic safety status above takes precedence.` : "Local LLM draft generated: no; heuristic fallback used."
    ].join("\n");
  }
  return localLlmResponse || heuristicDecision(context);
}

function buildPrompt(context) {
  return `You are a local bounty operator for a user trying to earn SOL or USDC.

Rules:
- Recommend only actions that can lead to real bounty revenue.
- Do not ask to spend funds, subscribe, sign transactions, or connect wallets.
- Treat submitted or in-review work as pending, not earned.
- Keep the answer actionable and short.

Task:
${JSON.stringify(context.task, null, 2)}

Submission status evidence:
${JSON.stringify(context.submissionStatus, null, 2)}

Submission package excerpt:
${context.submissionPackage.slice(0, 3500)}

Return:
1. current status
2. next best action
3. short reviewer follow-up draft
4. what evidence to check before counting revenue`;
}

async function main() {
  await mkdir("output", { recursive: true });

  let task = null;
  let taskError = null;
  try {
    task = compactTask(await getJson(taskApiUrl));
  } catch (error) {
    taskError = error.message;
    task = { id: taskId, url: taskUrl, apiError: taskError };
  }

  const submissionPackage = await getText("docs/gibwork-landing-submission-package.md");
  const submissionStatusText = await getText("output/gibwork-submission-status-20260602.json", "{}");
  let submissionStatus = {};
  try {
    submissionStatus = JSON.parse(submissionStatusText);
  } catch {
    submissionStatus = { parseError: "could not parse output/gibwork-submission-status-20260602.json" };
  }

  const context = {
    checkedAt: new Date().toISOString(),
    localModel: { provider: "ollama", model, url: ollamaUrl },
    task,
    taskError,
    prUrl,
    payoutWalletSolana,
    submissionStatus,
    submissionPackage
  };

  let localLlmResponse = null;
  let localLlmError = null;
  if (!args.has("--no-llm")) {
    try {
      localLlmResponse = await callOllama(buildPrompt(context));
    } catch (error) {
      localLlmError = error.message;
    }
  }

  const result = {
    ...context,
    agentDecision: safeDecision(context, localLlmResponse),
    localLlmRawResponseStored: false,
    localLlmError,
    mode: localLlmResponse ? "ollama" : "heuristic-fallback",
    revenueCounted: false,
    revenueCountReason: "Pending or in-review work is not earned until accepted or claimable."
  };

  await writeFile(outputPath, JSON.stringify(result, null, 2), "utf8");
  console.log(JSON.stringify({ outputPath, mode: result.mode, localLlmError, status: submissionStatus.uiStatus }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
