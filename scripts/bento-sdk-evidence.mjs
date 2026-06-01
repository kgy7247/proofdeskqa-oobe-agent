import { readFile, mkdir, writeFile } from "node:fs/promises";
import { Keypair, SystemInstruction, TransactionMessage } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import * as bentoSdk from "@bentoguard/sdk";

const OUT_PATH = "output/bento-sdk-evidence.json";
const BENTO_API = "https://api.bentoguard.xyz/api/v1";

function withTimeout(ms = 12_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

async function fetchJson(url) {
  const { controller, timeout } = withTimeout();
  try {
    const response = await fetch(url, { signal: controller.signal });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text.slice(0, 500);
    }
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.name,
      message: error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function signInstruction(instruction, keypair) {
  const messageBytes = new TextEncoder().encode(instruction);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
}

function summarizeParsedInstruction(client, instruction, agentPublicKey) {
  const vtx = client.parseInstruction(instruction, agentPublicKey);
  const decompiled = TransactionMessage.decompile(vtx.message);
  const firstInstruction = decompiled.instructions[0];
  const transfer = SystemInstruction.decodeTransfer(firstInstruction);

  return {
    instruction,
    serializedBase64Prefix: Buffer.from(vtx.serialize()).toString("base64").slice(0, 80),
    accountKeys: vtx.message.staticAccountKeys.map((key) => key.toBase58()),
    decodedTransfer: {
      from: transfer.fromPubkey.toBase58(),
      to: transfer.toPubkey.toBase58(),
      lamports: Number(transfer.lamports),
      sol: Number(transfer.lamports) / 1_000_000_000,
    },
  };
}

async function runSecondArgumentExperiment(client, keypair) {
  const captured = [];
  const originalApi = client.api;
  const relayerKey = Array.from({ length: 32 }, (_, index) => index + 1);

  client.api = {
    ...originalApi,
    getRelayerInfo: async () => ({ relayer: "local-stub" }),
    getOnchainConfig: async () => ({ relayer_encryption_key: relayerKey }),
    postTransaction: async (payload) => {
      captured.push({
        agentAddress: payload.agent_address,
        network: payload.network,
        base64TxSha256: await crypto.subtle
          .digest("SHA-256", new TextEncoder().encode(payload.base64_tx))
          .then((buf) => Buffer.from(buf).toString("hex")),
        base64TxPrefix: payload.base64_tx.slice(0, 80),
        encryptedPayloadLength: payload.encrypted_payload.length,
        signatureLength: payload.signature.length,
      });
      return {
        recommendation: "ALLOW",
        riskScore: 1,
        reasoning: "local stub; no network submission",
      };
    },
  };

  const instruction = "Swap 1 USDC for SOL on Jupiter.";
  const validInstructionSignature = signInstruction(instruction, keypair);
  const fakeRawUnsignedTransaction = Buffer.from("not-a-real-solana-transaction").toString("base64");

  await bentoSdk.protect(instruction, validInstructionSignature, {
    autoPollEscalation: false,
  });
  await bentoSdk.protect(instruction, fakeRawUnsignedTransaction, {
    autoPollEscalation: false,
  });

  client.api = originalApi;

  return {
    purpose: "Detect whether protect() uses its second argument as caller-provided transaction/signature input.",
    inputs: [
      { secondArgumentKind: "valid Ed25519 signature over instruction" },
      { secondArgumentKind: "fake raw unsigned tx base64" },
    ],
    capturedPostTransactions: captured,
    sameGeneratedBase64Tx:
      captured.length === 2 && captured[0].base64TxSha256 === captured[1].base64TxSha256,
    conclusion:
      captured.length === 2 && captured[0].base64TxSha256 === captured[1].base64TxSha256
        ? "The SDK generated the same base64_tx for both second arguments, so the caller-supplied second argument was not the transaction audited in this path."
        : "The generated transaction differed or the experiment did not capture two calls.",
  };
}

async function main() {
  const packageJson = JSON.parse(
    await readFile("node_modules/@bentoguard/sdk/package.json", "utf8"),
  );

  const keypair = Keypair.generate();
  const privateKeyBase58 = bs58.encode(keypair.secretKey);
  process.env.AGENT_WALLET_PRIVATE_KEY = privateKeyBase58;
  process.env.BENTO_NETWORK = "testnet";

  const client = bentoSdk.BentoClient.initialize({
    agentWalletPrivateKey: privateKeyBase58,
    network: "testnet",
    timeout: 12_000,
  });

  const prototypeMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(client))
    .filter((name) => name !== "constructor")
    .sort();

  const recipient = Keypair.generate().publicKey.toBase58();
  const parsedInstructions = [
    summarizeParsedInstruction(client, "Swap 1 USDC for SOL on Jupiter.", keypair.publicKey),
    summarizeParsedInstruction(client, `Send 2 SOL to ${recipient}`, keypair.publicKey),
  ];

  const registrationViaSdk = await bentoSdk.verifyRegistration({
    agentAddress: keypair.publicKey.toBase58(),
  }).catch((error) => ({
    error: error.name,
    code: error.code,
    message: error.message,
  }));

  const api = {
    relayer: await fetchJson(`${BENTO_API}/system/relayer`),
    config: await fetchJson(`${BENTO_API}/system/config`),
    checkRegistration: await fetchJson(
      `${BENTO_API}/agents/check-registration?agentAddress=${keypair.publicKey.toBase58()}`,
    ),
  };

  const secondArgumentExperiment = await runSecondArgumentExperiment(client, keypair);

  const evidence = {
    generatedAt: new Date().toISOString(),
    sdk: {
      package: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    },
    safety: {
      burnerAgentAddress: keypair.publicKey.toBase58(),
      privateKeyPersisted: false,
      userWalletTouched: false,
      realFundsMoved: false,
    },
    docsChecked: [
      "https://bento-1.gitbook.io/bento-docs/getting-started/quickstart.md",
      "https://bento-1.gitbook.io/bento-docs/getting-started/sdk-integration.md",
      "https://bento-1.gitbook.io/bento-docs/getting-started/sample-bento-test.md",
      "https://bento-1.gitbook.io/bento-docs/overview/system/protect-flow.md",
    ],
    sdkSurface: {
      prototypeMethods,
      hasGetActionStatus: prototypeMethods.includes("getActionStatus"),
      hasUpdateActionDecision: prototypeMethods.includes("updateActionDecision"),
      note:
        "Docs and sample code reference client.getActionStatus/updateActionDecision, but these methods are not present on the exported BentoClient instance in this package version.",
    },
    registrationViaSdk,
    api,
    parsedInstructions,
    secondArgumentExperiment,
  };

  await mkdir("output", { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Wrote ${OUT_PATH}`);
  console.log(JSON.stringify({
    sdk: evidence.sdk,
    burnerAgentAddress: evidence.safety.burnerAgentAddress,
    sameGeneratedBase64Tx: evidence.secondArgumentExperiment.sameGeneratedBase64Tx,
    hasGetActionStatus: evidence.sdkSurface.hasGetActionStatus,
    hasUpdateActionDecision: evidence.sdkSurface.hasUpdateActionDecision,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
