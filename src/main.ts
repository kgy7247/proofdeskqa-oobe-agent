import Phaser from "phaser";
import { ProofRunnerScene } from "./game/ProofRunnerScene";
import "./style.css";

const walletAddress = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD";
const targetSol = 5;
const ledgerKey = "ai-work-proof-ledger";
const usdcLedgerKey = "ai-work-proof-usdc-ledger";

type LedgerEntry = {
  source: string;
  amount: number;
  createdAt: string;
};

function readLedger(): LedgerEntry[] {
  return readLedgerByKey(ledgerKey);
}

function readUsdcLedger(): LedgerEntry[] {
  return readLedgerByKey(usdcLedgerKey);
}

function readLedgerByKey(key: string): LedgerEntry[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as LedgerEntry[] : [];
  } catch {
    return [];
  }
}

function writeLedger(entries: LedgerEntry[]): void {
  window.localStorage.setItem(ledgerKey, JSON.stringify(entries));
}

function writeUsdcLedger(entries: LedgerEntry[]): void {
  window.localStorage.setItem(usdcLedgerKey, JSON.stringify(entries));
}

function renderLedger(): void {
  const entries = readLedger();
  const usdcEntries = readUsdcLedger();
  const earned = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const earnedUsdc = usdcEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const progress = Math.min(100, (earned / targetSol) * 100);
  const earnedNode = document.querySelector<HTMLElement>("#earnedSol");
  const earnedUsdcNode = document.querySelector<HTMLElement>("#earnedUsdc");
  const progressNode = document.querySelector<HTMLElement>("#solProgress");
  const listNode = document.querySelector<HTMLElement>("#ledgerList");
  const usdcListNode = document.querySelector<HTMLElement>("#usdcLedgerList");

  if (earnedNode) {
    earnedNode.textContent = `${earned.toFixed(2)} / ${targetSol.toFixed(2)} SOL`;
  }
  if (earnedUsdcNode) {
    earnedUsdcNode.textContent = `${earnedUsdc.toFixed(2)} USDC`;
  }
  if (progressNode) {
    progressNode.style.width = `${progress}%`;
  }
  if (listNode) {
    listNode.innerHTML = entries.length
      ? entries.map((entry) => `<li><strong>${entry.amount.toFixed(2)} SOL</strong><span>${entry.source}</span></li>`).join("")
      : "<li><strong>0.00 SOL</strong><span>첫 의뢰 대기 중</span></li>";
  }
  if (usdcListNode) {
    usdcListNode.innerHTML = usdcEntries.length
      ? usdcEntries.map((entry) => `<li><strong>${entry.amount.toFixed(2)} USDC</strong><span>${entry.source}</span></li>`).join("")
      : "<li><strong>0.00 USDC</strong><span>Virtuals 첫 주문 대기 중</span></li>";
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback.
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="shell">
    <section class="workspace">
      <aside class="panel lead-panel">
        <div class="status-row">
          <span class="signal"></span>
          <span>수주 대기 중</span>
        </div>
        <h1>AI Work Proof Desk</h1>
        <p class="lede">게임 프로토타입, 안드로이드 QA, AI 검증 리포트를 바로 납품하고 Solana로 정산받는 작업 표면입니다.</p>

        <div class="wallet-box" aria-label="Solana wallet">
          <span class="label">SOL 결제 주소</span>
          <code id="wallet">${walletAddress}</code>
          <div class="wallet-actions">
            <button id="copyWallet" type="button">주소 복사</button>
            <a href="solana:${walletAddress}" class="link-button">지갑 열기</a>
          </div>
        </div>

        <div class="target-box">
          <div class="target-head">
            <span class="label">SOL 목표</span>
            <strong id="earnedSol">0.00 / 5.00 SOL</strong>
          </div>
          <div class="progress-track" aria-label="5 SOL progress">
            <span id="solProgress"></span>
          </div>
          <form id="ledgerForm" class="ledger-form">
            <input id="ledgerSource" name="source" placeholder="출처: GitWork QA, 개인 의뢰..." autocomplete="off" />
            <input id="ledgerAmount" name="amount" type="number" min="0" step="0.01" placeholder="SOL" />
            <button type="submit">수익 기록</button>
          </form>
          <ul id="ledgerList" class="ledger-list"></ul>
        </div>

        <div class="target-box usdc-box">
          <div class="target-head">
            <span class="label">USDC 수익</span>
            <strong id="earnedUsdc">0.00 USDC</strong>
          </div>
          <form id="usdcLedgerForm" class="ledger-form">
            <input id="usdcLedgerSource" name="source" placeholder="출처: Virtuals ACP, QA 주문..." autocomplete="off" />
            <input id="usdcLedgerAmount" name="amount" type="number" min="0" step="0.01" placeholder="USDC" />
            <button type="submit">USDC 기록</button>
          </form>
          <ul id="usdcLedgerList" class="ledger-list"></ul>
        </div>

        <div class="offer-grid">
          <article>
            <span class="tag">빠른 납품</span>
            <h2>Android QA</h2>
            <p>에뮬레이터 기반 화면 캡처, UI 트리, logcat 증거로 버그 리포트 작성.</p>
          </article>
          <article>
            <span class="tag">데모 포함</span>
            <h2>2D Game Slice</h2>
            <p>Phaser/Vite 브라우저 데모와 플레이테스트 체크리스트 납품.</p>
          </article>
          <article>
            <span class="tag">검증형</span>
            <h2>AI Eval Report</h2>
            <p>프롬프트, 모델 출력, 실패 케이스를 근거로 한 짧은 검증 보고서.</p>
          </article>
        </div>
      </aside>

      <section class="game-panel">
        <div class="game-header">
          <div>
            <p class="eyebrow">Playable proof</p>
            <h2>Proof Runner</h2>
          </div>
          <div class="meter">
            <span>검증 토큰</span>
            <strong id="tokenCount">0 / 8</strong>
          </div>
        </div>
        <div id="game"></div>
        <div class="hud-strip">
          <span>방향키/WASD 이동</span>
          <span>초록 토큰 수집</span>
          <span>빨간 오류 회피</span>
        </div>
      </section>

      <aside class="panel action-panel">
        <h2>오늘 바로 보낼 문구</h2>
        <p class="quote">"작은 웹게임/안드로이드 QA/AI 출력 검증을 빠르게 처리합니다. 샘플 데모와 증거 캡처를 먼저 드리고, 결제는 SOL로 받습니다."</p>
        <a class="primary-action" href="/docs/client-message-ko.md">제안문 열기</a>
        <a class="secondary-action" href="/docs/solana-bounty-leads.md">바운티 리드 보기</a>
        <a class="secondary-action" href="/docs/virtuals-route.md">Virtuals 루트 보기</a>
        <a class="secondary-action" href="/docs/virtuals-usdc-offering.md">USDC Offering 초안</a>
        <a class="secondary-action" href="/docs/virtuals-live-agent.md">Live Agent 상태</a>
        <a class="secondary-action" href="/docs/job-delivery-templates.md">납품 템플릿</a>
        <a class="secondary-action" href="/docs/next-actions-5sol.md">5 SOL 실행순서</a>
      </aside>
    </section>
  </main>
`;

window.addEventListener("proof-token-change", (event) => {
  const detail = (event as CustomEvent<{ current: number; target: number }>).detail;
  const tokenCount = document.querySelector<HTMLElement>("#tokenCount");
  if (tokenCount) {
    tokenCount.textContent = `${detail.current} / ${detail.target}`;
  }
});

document.querySelector<HTMLButtonElement>("#copyWallet")?.addEventListener("click", async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const copied = await copyText(walletAddress);
  button.textContent = copied ? "복사됨" : "직접 복사";
  window.setTimeout(() => {
    button.textContent = "주소 복사";
  }, 1400);
});

document.querySelector<HTMLFormElement>("#ledgerForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const source = document.querySelector<HTMLInputElement>("#ledgerSource");
  const amount = document.querySelector<HTMLInputElement>("#ledgerAmount");
  const parsed = Number(amount?.value ?? 0);

  if (!source || !amount || !source.value.trim() || !Number.isFinite(parsed) || parsed <= 0) {
    return;
  }

  const entries = readLedger();
  entries.unshift({
    source: source.value.trim(),
    amount: parsed,
    createdAt: new Date().toISOString()
  });
  writeLedger(entries);
  source.value = "";
  amount.value = "";
  renderLedger();
});

document.querySelector<HTMLFormElement>("#usdcLedgerForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const source = document.querySelector<HTMLInputElement>("#usdcLedgerSource");
  const amount = document.querySelector<HTMLInputElement>("#usdcLedgerAmount");
  const parsed = Number(amount?.value ?? 0);

  if (!source || !amount || !source.value.trim() || !Number.isFinite(parsed) || parsed <= 0) {
    return;
  }

  const entries = readUsdcLedger();
  entries.unshift({
    source: source.value.trim(),
    amount: parsed,
    createdAt: new Date().toISOString()
  });
  writeUsdcLedger(entries);
  source.value = "";
  amount.value = "";
  renderLedger();
});

renderLedger();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#151c24",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 900,
    height: 540,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [ProofRunnerScene]
});
