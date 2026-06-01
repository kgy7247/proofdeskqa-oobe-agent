import { mkdir, writeFile } from "node:fs/promises";

const settlementWallet = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD";
const now = new Date();
const knownArchivedRepos = new Set([
  "ubiquity/ubiquibot"
]);

async function getJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ProofDeskQA earning scanner",
      accept: "application/json",
      ...headers
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

function parseReward(labels = [], fallbackAmount = null) {
  const joined = labels.join(" ");
  const price = joined.match(/Price:\s*(\d+)\s*USD/i) ?? joined.match(/\$(\d+)/);
  return price ? Number(price[1]) : fallbackAmount;
}

function parseRewardText(text = "") {
  const match = String(text).match(/\$?\s*(\d+(?:\.\d+)?)\s*(USDC|USD|USDG)?/i);
  return match ? Number(match[1]) : null;
}

function parseGithubIssueUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  return match ? { owner: match[1], repo: match[2], number: match[3] } : null;
}

function deadlineStatus(deadline) {
  if (!deadline) return { expired: null, hoursRemaining: null };
  const end = new Date(deadline);
  const hoursRemaining = (end.getTime() - now.getTime()) / 36e5;
  return {
    expired: hoursRemaining < 0,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10
  };
}

function classifyBlockers(item) {
  const text = `${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();
  const blockers = [];
  if (item.agentAccess === "HUMAN_ONLY") blockers.push("human_only");
  if (item.locked) blockers.push("issue_locked");
  if (item.repoArchived) blockers.push("repo_archived");
  if (item.source === "taskbounty" && item.status !== "OPEN") blockers.push(`taskbounty_status_${String(item.status).toLowerCase()}`);
  if (item.source === "taskbounty" && item.expired) blockers.push("expired_deadline");
  if (item.source === "taskbounty" && item.submissions > 0) blockers.push("existing_submissions");
  if (item.source === "taskbounty" && item.status === "OPEN" && !process.env.TASKBOUNTY_API_KEY) {
    blockers.push("missing_taskbounty_api_key_for_access_and_submission");
  }
  if (item.source === "clawfreelance" && item.status === "ERROR") blockers.push("clawfreelance_tasks_api_unavailable");
  if (item.source === "clawdmarket" && item.expired) blockers.push("expired_task");
  if (item.source === "clawdmarket" && item.bidCount > 5) blockers.push("crowded_bids");
  if (item.source === "monetizeyouragent") {
    if (text.includes("twitter") || text.includes("tweet") || text.includes(" x api")) blockers.push("needs_controlled_x_account");
    if (text.includes("base wallet") || text.includes("base usdc") || text.includes("onchain") || text.includes("x402")) {
      blockers.push("needs_base_usdc_wallet_or_onchain_proof");
    }
    if (item.responses && item.responses > 20) blockers.push("crowded_responses");
  }
  if (item.type === "project") blockers.push("project_submission_needs_real_telegram_url");
  if (text.includes("twitter") || text.includes("x thread") || text.includes("qrt") || text.includes("quote")) {
    blockers.push("needs_controlled_x_account");
  }
  if (text.includes("telegram")) blockers.push("needs_telegram_step");
  if (text.includes("private beta") || text.includes("early access")) blockers.push("needs_private_beta_access");
  if (text.includes("stake ") || text.includes("swap") || text.includes("send assets")) blockers.push("may_need_capital_or_onchain_action");
  if (item.slug === "bento-beta-bounty") {
    blockers.push("needs_private_beta_access", "needs_controlled_x_account", "may_need_capital_or_onchain_action");
  }
  if (item.slug === "write-a-twitter-thread-on-kimia-protocol") {
    blockers.push("needs_controlled_x_account", "needs_telegram_step");
  }
  return [...new Set(blockers)];
}

function scoreOpportunity(item) {
  let score = 0;
  if (item.source === "superteam") score += 15;
  if (item.source === "taskbounty") score += 12;
  if (item.source === "clawfreelance") score += 12;
  if (item.source === "monetizeyouragent") score += 14;
  if (item.source === "clawdmarket") score += 8;
  if (item.source === "github") score += 10;
  if (item.source === "bountic") score += 8;
  if (item.agentAccess === "AGENT_ALLOWED" || item.agentAccess === "AGENT_ONLY") score += 40;
  if (item.rewardUsd) score += Math.min(35, item.rewardUsd / 25);
  if (item.submissions === 0) score += 15;
  if (item.submissions && item.submissions < 10) score += 8;
  if (item.deadlineHoursRemaining && item.deadlineHoursRemaining > 0 && item.deadlineHoursRemaining < 36) score -= 8;
  score -= (item.blockers?.length ?? 0) * 12;
  if (item.blockers?.includes("human_only")) score -= 25;
  if (item.competitionPrs && item.competitionPrs > 0) score -= Math.min(35, item.competitionPrs * 7);
  if (item.bidCount && item.bidCount > 0) score -= Math.min(25, item.bidCount);
  if (item.responses && item.responses > 0) score -= Math.min(25, item.responses / 2);
  if (item.status !== "OPEN") score -= 50;
  return Math.round(score);
}

async function fetchSuperteam() {
  const listings = await getJson("https://superteam.fun/api/listings/?take=50");
  return listings.map((listing) => {
    const deadline = deadlineStatus(listing.deadline);
    const item = {
      source: "superteam",
      title: listing.title,
      url: `https://superteam.fun/earn/listing/${listing.slug}`,
      slug: listing.slug,
      listingId: listing.id,
      type: listing.type,
      status: listing.status,
      token: listing.token,
      rewardAmount: listing.rewardAmount,
      rewardUsd: listing.rewardAmount,
      agentAccess: listing.agentAccess,
      deadline: listing.deadline,
      deadlineHoursRemaining: deadline.hoursRemaining,
      expired: deadline.expired,
      submissions: listing._count?.Submission ?? null,
      sponsor: listing.sponsor?.name ?? null
    };
    item.blockers = classifyBlockers(item);
    item.score = scoreOpportunity(item);
    return item;
  }).filter((item) => item.status === "OPEN" && !item.expired);
}

async function fetchBountic() {
  const data = await getJson("https://bountic.vercel.app/api/explore");
  const items = await Promise.all((data.bounties ?? []).map(async (bounty) => {
    const item = {
      source: "bountic",
      title: bounty.issue_id,
      url: `https://github.com/${bounty.owner}/${bounty.repo}/issues/${bounty.issue_number}`,
      status: bounty.status,
      token: "USD",
      rewardAmount: bounty.total_amount,
      rewardUsd: bounty.total_amount,
      agentAccess: "UNKNOWN",
      issue: bounty.issue_id,
      updatedAt: bounty.updated_at,
      repoArchived: knownArchivedRepos.has(`${bounty.owner}/${bounty.repo}`),
      blockers: bounty.status === "OPEN" ? [] : ["not_open"]
    };
    item.competitionPrs = await countCompetingPrs(item.url);
    if (item.competitionPrs === null) item.blockers.push("competition_unknown");
    if (item.competitionPrs && item.competitionPrs > 0) item.blockers.push("competing_prs_exist");
    item.blockers = [...new Set([...item.blockers, ...classifyBlockers(item)])];
    item.score = scoreOpportunity(item);
    return item;
  }));
  return items.filter((item) => item.status === "OPEN");
}

async function fetchTaskBounty() {
  const data = await getJson("https://www.task-bounty.com/api/v1/tasks");
  return (data.data ?? []).map((task) => {
    const deadline = deadlineStatus(task.submission_deadline);
    const rewardUsd = Number.isFinite(task.bounty_cents) ? task.bounty_cents / 100 : null;
    const item = {
      source: "taskbounty",
      title: task.title,
      url: "https://www.task-bounty.com/browse",
      taskId: task.id,
      slug: task.slug,
      category: task.category,
      description: task.short_summary,
      status: task.status,
      token: task.currency?.toUpperCase() ?? "USD",
      rewardAmount: rewardUsd,
      rewardUsd,
      agentAccess: "AGENT_ALLOWED",
      deadline: task.submission_deadline,
      deadlineHoursRemaining: deadline.hoursRemaining,
      expired: deadline.expired,
      submissions: task.submission_count ?? null,
      publishedAt: task.published_at
    };
    item.blockers = classifyBlockers(item);
    item.score = scoreOpportunity(item);
    return item;
  });
}

async function fetchClawFreelance() {
  try {
    const data = await getJson("https://clawfreelance.com/api/v1/tasks?status=open&limit=50");
    const tasks = Array.isArray(data) ? data : data.tasks ?? data.data ?? [];
    return tasks.map((task) => {
      const rewardUsd = Number(task.rewardUsd ?? task.reward_usd ?? task.reward ?? task.amount ?? 0) || null;
      const item = {
        source: "clawfreelance",
        title: task.title ?? task.name ?? task.id ?? "ClawFreelance task",
        url: task.url ?? "https://www.clawfreelance.com/tasks",
        taskId: task.id ?? null,
        status: String(task.status ?? "OPEN").toUpperCase(),
        token: task.currency?.toUpperCase?.() ?? "USDC",
        rewardAmount: rewardUsd,
        rewardUsd,
        agentAccess: "AGENT_ALLOWED",
        submissions: task.submissionCount ?? task.submissions ?? null,
        blockers: []
      };
      item.blockers = classifyBlockers(item);
      item.score = scoreOpportunity(item);
      return item;
    });
  } catch (error) {
    const item = {
      source: "clawfreelance",
      title: "ClawFreelance open task API check failed",
      url: "https://www.clawfreelance.com/docs/api",
      status: "ERROR",
      token: null,
      rewardAmount: null,
      rewardUsd: null,
      agentAccess: "AGENT_ALLOWED",
      blockers: [`clawfreelance_api_error: ${error.message.slice(0, 120)}`]
    };
    item.blockers = [...new Set([...item.blockers, ...classifyBlockers(item)])];
    item.score = scoreOpportunity(item);
    return [item];
  }
}

async function fetchClawdMarket() {
  const data = await getJson("https://clawdmkt.com/api/tasks?status=open");
  return (data.tasks ?? []).map((task) => {
    const deadline = deadlineStatus(task.expires_at);
    const item = {
      source: "clawdmarket",
      title: task.title,
      url: `https://clawdmkt.com/task/${task.id}`,
      taskId: task.id,
      status: task.status?.toUpperCase?.() ?? "OPEN",
      token: "USD",
      rewardAmount: task.budget_usd ?? null,
      rewardUsd: task.budget_usd ?? null,
      agentAccess: "AGENT_ALLOWED",
      deadline: task.expires_at,
      deadlineHoursRemaining: deadline.hoursRemaining,
      expired: deadline.expired || task.expires_in === "expired",
      bidCount: task.bid_count ?? null,
      capabilities: task.required_capabilities ?? [],
      blockers: []
    };
    item.blockers = classifyBlockers(item);
    item.score = scoreOpportunity(item);
    return item;
  });
}

async function fetchMonetizeYourAgentJobs() {
  const data = await getJson("https://monetizeyouragent.fun/api/v1/jobs");
  return (data.data ?? []).map((job) => {
    const rewardUsd = parseRewardText(job.reward);
    const item = {
      source: "monetizeyouragent",
      title: job.title,
      url: job.contact_endpoint ?? `https://monetizeyouragent.fun/jobs`,
      jobId: job.id,
      status: job.status === "active" ? "OPEN" : job.status?.toUpperCase?.() ?? "OPEN",
      token: String(job.reward ?? "").toUpperCase().includes("USDC") ? "USDC" : "USD",
      rewardAmount: rewardUsd,
      rewardUsd,
      agentAccess: "AGENT_ALLOWED",
      description: job.description,
      rewardType: job.reward_type,
      responses: job.responses_count ?? null,
      contactType: job.contact_type ?? null,
      blockers: []
    };
    item.blockers = classifyBlockers(item);
    item.score = scoreOpportunity(item);
    return item;
  });
}

async function githubSearch(query, perPage = 10) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${perPage}&sort=updated&order=desc`;
  const data = await getJson(url, {
    accept: "application/vnd.github+json"
  });
  return data.items ?? [];
}

async function countCompetingPrs(issueUrl) {
  const parsed = parseGithubIssueUrl(issueUrl);
  if (!parsed) return null;
  const query = `repo:${parsed.owner}/${parsed.repo} ${parsed.number} type:pr`;
  try {
    const items = await githubSearch(query, 10);
    return items.length;
  } catch {
    return null;
  }
}

async function fetchGithubBounties() {
  const queries = [
    'org:ubiquity state:open label:"Price: 150 USD"',
    'org:ubiquity state:open label:"Price: 200 USD"',
    'org:ubiquity-os-marketplace state:open label:"Time: <2 Hours"',
    '"bounty" "USDC" "help wanted" state:open',
    '"bounty:" "USDC" state:open'
  ];
  const seen = new Set();
  const items = [];
  for (const query of queries) {
    let issues = [];
    try {
      issues = await githubSearch(query, 10);
    } catch (error) {
      items.push({
        source: "github",
        title: `GitHub query failed: ${query}`,
        url: "https://github.com/search",
        status: "ERROR",
        token: null,
        rewardAmount: null,
        rewardUsd: null,
        labels: [],
        comments: null,
        updatedAt: now.toISOString(),
        agentAccess: "UNKNOWN",
        blockers: [`github_api_error: ${error.message.slice(0, 120)}`],
        score: -50
      });
      continue;
    }
    for (const issue of issues) {
      if (seen.has(issue.html_url) || issue.pull_request) continue;
      seen.add(issue.html_url);
      const labels = (issue.labels ?? []).map((label) => label.name);
      const rewardUsd = parseReward(labels);
      const parsed = parseGithubIssueUrl(issue.html_url);
      const item = {
        source: "github",
        title: issue.title,
        url: issue.html_url,
        status: issue.state?.toUpperCase(),
        token: rewardUsd ? "USD" : null,
        rewardAmount: rewardUsd,
        rewardUsd,
        labels,
        comments: issue.comments,
        updatedAt: issue.updated_at,
        agentAccess: "UNKNOWN",
        locked: issue.locked,
        repoArchived: parsed ? knownArchivedRepos.has(`${parsed.owner}/${parsed.repo}`) : false,
        blockers: []
      };
      item.blockers = classifyBlockers(item);
      if ((issue.comments ?? 0) > 20) item.blockers.push("crowded_thread");
      item.competitionPrs = await countCompetingPrs(issue.html_url);
      if (item.competitionPrs === null) item.blockers.push("competition_unknown");
      if (item.competitionPrs && item.competitionPrs > 0) item.blockers.push("competing_prs_exist");
      item.score = scoreOpportunity(item);
      items.push(item);
    }
  }
  return items;
}

function toMarkdown(report) {
  const rows = report.ranked.slice(0, 20).map((item, index) => {
    const reward = item.rewardAmount ? `${item.rewardAmount} ${item.token ?? "USD"}` : "variable/unknown";
    const blockers = item.blockers.length ? item.blockers.join(", ") : "none seen";
    return `| ${index + 1} | ${item.score} | ${item.source} | [${item.title}](${item.url}) | ${reward} | ${item.agentAccess ?? ""} | ${blockers} |`;
  }).join("\n");
  return `# USDC/Solana Earning Opportunities

Generated: ${report.generatedAt}

Settlement wallet: \`${settlementWallet}\`

## Ranking

| # | Score | Source | Opportunity | Reward | Agent access | Blockers |
|---:|---:|---|---|---|---|---|
${rows}

## Current Best Actions

- Kimia is agent-eligible and pays 110 USDC, but it requires a real X/Twitter thread and Telegram community step.
- Bento is agent-eligible and pays from a 200 USDC pool, but useful submission needs private beta access and product testing.
- TaskBounty exposes an agent-friendly public API, but the latest API scan returned no open tasks.
- ClawFreelance exposes a public task API, but the latest open-task API probe failed server-side.
- MonetizeYourAgent exposes active USDC jobs, but most practical items require Base wallet/on-chain proof or have many existing responses.
- ClawdMarket registration and bidding work, but the current public tasks are expired or heavily bid.
- Bountic currently exposes only one small open bounty and it already has competing PRs.
- Ubiquity/GitHub bounties can pay in USD equivalents, but the currently visible easy issues are either crowded or already have competing PRs.

## Completion Rule

This file is opportunity discovery, not revenue. Count progress only after a payout is received, claimable, or accepted by the sponsor.
`;
}

await mkdir("output", { recursive: true });
await mkdir("docs", { recursive: true });

const [superteam, bountic, taskbounty, clawfreelance, clawdmarket, monetizeyouragent, github] = await Promise.all([
  fetchSuperteam(),
  fetchBountic(),
  fetchTaskBounty(),
  fetchClawFreelance(),
  fetchClawdMarket(),
  fetchMonetizeYourAgentJobs(),
  fetchGithubBounties()
]);

const ranked = [...superteam, ...bountic, ...taskbounty, ...clawfreelance, ...clawdmarket, ...monetizeyouragent, ...github]
  .sort((a, b) => b.score - a.score);

const report = {
  generatedAt: now.toISOString(),
  settlementWallet,
  sources: {
    superteam: superteam.length,
    bountic: bountic.length,
    taskbounty: taskbounty.length,
    clawfreelance: clawfreelance.length,
    clawdmarket: clawdmarket.length,
    monetizeyouragent: monetizeyouragent.length,
    github: github.length
  },
  ranked
};

await writeFile("output/earning-opportunities.json", JSON.stringify(report, null, 2));
await writeFile("docs/usdc-earning-opportunities.md", toMarkdown(report));
console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  scanned: report.sources,
  top: ranked.slice(0, 8).map((item) => ({
    score: item.score,
    source: item.source,
    title: item.title,
    reward: item.rewardAmount ? `${item.rewardAmount} ${item.token ?? "USD"}` : null,
    blockers: item.blockers
  }))
}, null, 2));
