<p align="center">
  <img src="./brand/logo-full.png" alt="Vaultfire" width="420" />
</p>

<div align="center">

> **⚠️ Alpha Software** — Vaultfire Protocol is in active development. Contracts are deployed on mainnet but APIs and SDK interfaces may change. Use in production at your own discretion.

# Vaultfire Developer Portal

Developer documentation and interactive tools for [Vaultfire Protocol](https://github.com/Ghostkey316/ghostkey-316-vaultfire-init).

**The Trust Standard for AI Agents**

On-chain identity, reputation, and economic accountability.
Deployed on Base · Avalanche · Arbitrum · Polygon.

</div>

---

## Quick Start

```bash
npm install @vaultfire/langchain
```

```typescript
import { createVaultfireTools } from '@vaultfire/langchain';
const tools = createVaultfireTools({ chain: 'base' });
```

## Ecosystem

| Package | Type | Description |
|---------|------|-------------|
| `@vaultfire/agent-sdk` | npm | Core agent registration and bond SDK |
| `@vaultfire/langchain` | npm | LangChain/LangGraph integration |
| `@vaultfire/mcp-server` | npm | MCP server for Claude, Copilot, Cursor |
| `@vaultfire/crewai` | pip | CrewAI multi-agent trust tools |
| `@vaultfire/openai-agents` | npm | OpenAI Agents SDK integration |
| `@vaultfire/vercel-ai` | npm | Vercel AI SDK trust middleware |
| `@vaultfire/a2a` | npm | A2A Agent Card enrichment |
| `@vaultfire/enterprise` | npm | Enterprise IAM bridge (Okta/Azure AD) |
| `@vaultfire/x402` | npm | HTTP 402 payment channels |
| `@vaultfire/xmtp` | npm | XMTP agent messaging |
| `@vaultfire/vns` | npm | Vaultfire Name Service |

## Why Vaultfire Bonds > Trust Scores

| Feature | Vaultfire Bonds | Trust Scores |
|---------|----------------|-------------|
| Skin in the game | Real economic stake | None |
| Manipulation resistant | Economic cost to fake | Easy to game |
| Verifiable | On-chain, trustless | Centralized API |
| Cross-chain | 4 chains, day one | Single provider |
| Accountability | Bond at risk on failure | Score drops |

## Deployed Contracts

Vaultfire Protocol is deployed across **4 mainnet chains** with **127 smart contracts**.

- **Base** (Chain ID: 8453) — Primary Hub
- **Avalanche** (Chain ID: 43114)
- **Arbitrum** (Chain ID: 42161)
- **Polygon** (Chain ID: 137)

See the [developer portal](https://github.com/Ghostkey316/) for full contract addresses and interactive trust checker.

## Links

- [GitHub](https://github.com/Ghostkey316/)
- [npm](https://www.npmjs.com/search?q=%40vaultfire)
- [The Loop Breaker](https://theloopbreaker.com)


## Vaultfire Ecosystem

| Package | Description |
|---|---|
| [`@vaultfire/agent-sdk`](https://github.com/Ghostkey316/vaultfire-sdk) | Core SDK — register agents, create bonds, query reputation |
| [`@vaultfire/langchain`](https://github.com/Ghostkey316/vaultfire-langchain) | LangChain / LangGraph integration |
| [`@vaultfire/a2a`](https://github.com/Ghostkey316/vaultfire-a2a) | Agent-to-Agent (A2A) protocol bridge |
| [`@vaultfire/enterprise`](https://github.com/Ghostkey316/vaultfire-enterprise) | Enterprise IAM bridge (Okta, Azure AD, OIDC) |
| [`@vaultfire/mcp-server`](https://github.com/Ghostkey316/vaultfire-mcp-server) | MCP server for Claude, Copilot, Cursor |
| [`@vaultfire/openai-agents`](https://github.com/Ghostkey316/vaultfire-openai-agents) | OpenAI Agents SDK integration |
| [`@vaultfire/vercel-ai`](https://github.com/Ghostkey316/vaultfire-vercel-ai) | Vercel AI SDK middleware and tools |
| [`@vaultfire/xmtp`](https://github.com/Ghostkey316/vaultfire-xmtp) | XMTP messaging with trust verification |
| [`@vaultfire/x402`](https://github.com/Ghostkey316/vaultfire-x402) | X402 payment protocol with trust gates |
| [`@vaultfire/vns`](https://github.com/Ghostkey316/vaultfire-vns) | Vaultfire Name Service — human-readable agent IDs |
| [`vaultfire-crewai`](https://github.com/Ghostkey316/vaultfire-crewai) | CrewAI integration (Python) |
| [`vaultfire-agents`](https://github.com/Ghostkey316/vaultfire-agents) | 3 reference agents with live on-chain trust |
| [`vaultfire-a2a-trust-extension`](https://github.com/Ghostkey316/vaultfire-a2a-trust-extension) | A2A Trust Extension spec — on-chain trust for Agent Cards |
| [`vaultfire-showcase`](https://github.com/Ghostkey316/vaultfire-showcase) | Why Vaultfire Bonds beat trust scores — live proof |
| [`vaultfire-whitepaper`](https://github.com/Ghostkey316/vaultfire-whitepaper) | Trust Framework whitepaper — economic accountability for AI |
| [`vaultfire-docs`](https://github.com/Ghostkey316/vaultfire-docs) | **This package** — Developer portal — quickstart, playground, framework picker |

## License

MIT © 2025 Ghostkey316

> "Morals over metrics. Privacy over surveillance. Freedom over control."
