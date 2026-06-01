import { mkdir, writeFile } from "node:fs/promises";

const settlementWallet = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD";
const now = new Date();

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
  if (item.source === "taskbounty" && item.status !== "OPEN") blockers.push(`taskbounty_status_${String(item.status).toLowerCase()}`);
  if (item.source === "taskbounty" && item.expired) blockers.push("expired_deadline");
  if (item.source === "taskbounty" && item.submissions > 0) blockers.push("existing_submissions");
  if (item.source === "taskbounty" && item.status === "OPEN" && !process.env.TASKBOUNTY_API_KEY) {
    blockers.push("missing_taskbounty_api_key_for_access_and_submission");
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
  return (data.bounties ?? []).map((bounty) => {
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
      blockers: bounty.status === "OPEN" ? [] : ["not_open"]
    };
    item.score = scoreOpportunity(item);
    return item;
  }).filter((item) => item.status === "OPEN");
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

async function githubSearch(query, perPage = 10) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${perPage}&sort=updated&order=desc`;
  const data = await getJson(url, {
    accept: "application/vnd.github+json"
  });
  return data.items ?? [];
}

async function countCompetingPrs(issueUrl) {
  const match = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) return null;
  const [, owner, repo, number] = match;
  const query = `repo:${owner}/${repo} ${number} type:pr`;
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
        blockers: []
      };
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
- Bountic currently exposes only one small open bounty and it already has competing PRs.
- Ubiquity/GitHub bounties can pay in USD equivalents, but the currently visible easy issues are either crowded or already have competing PRs.

## Completion Rule

This file is opportunity discovery, not revenue. Count progress only after a payout is received, claimable, or accepted by the sponsor.
`;
}

await mkdir("output", { recursive: true });
await mkdir("docs", { recursive: true });

const [superteam, bountic, taskbounty, github] = await Promise.all([
  fetchSuperteam(),
  fetchBountic(),
  fetchTaskBounty(),
  fetchGithubBounties()
]);

const ranked = [...superteam, ...bountic, ...taskbounty, ...github]
  .sort((a, b) => b.score - a.score);

const report = {
  generatedAt: now.toISOString(),
  settlementWallet,
  sources: {
    superteam: superteam.length,
    bountic: bountic.length,
    taskbounty: taskbounty.length,
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
