# Tessera

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Network: Base Sepolia](https://img.shields.io/badge/Base_Sepolia-84532-blue.svg)](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini_App-8a63d2.svg)](https://farcaster.xyz/)

> Create proof-of-attendance tokens stored 100% onchain. Zero IPFS, zero pinning services, zero centralized metadata servers. Runs simultaneously as a web application and a native Farcaster Mini App.
>
> *A **tessera** was the token that admitted citizens to events in ancient Rome, and a single glass tile in a mosaic. One token proves you were present; together they form a picture.*

---

## Features

- ✅ **100% Onchain SVG via SSTORE2**: Vector artwork is compressed and written directly to smart contract bytecode. The token and metadata live forever onchain without relying on IPFS, Arweave, or external pinning APIs.
- ✅ **Interactive Vector Studio**: Design tokens directly on a custom SVG canvas featuring 10 responsive vector templates, 30 color palettes, Star and Hexagon geometric tools, custom stamps, frames, and typography controls.
- ✅ **Image Import & Optimisation**: Upload PNG, JPEG, GIF, WebP, or AVIF files with automatic cropping, resizing, and byte-budget calculations to prevent gas spikes during contract deployment.
- ✅ **Three Distribution Models**:
  - **Public Mint**: Open to all collectors, toggleable within the first 30 days.
  - **Allowlist Mint**: Merkle-proof claims with automated proof and tree generation from raw address lists.
  - **Signature Mint**: Single-wallet cryptographic ECDSA signatures for in-person attendance verification.
- ✅ **Automated Merkle Claim Generator**: Paste recipient addresses to automatically calculate the onchain Merkle root, export claim links, and generate printable QR code packets.
- ✅ **Farcaster Mini App Integration**: Ready-to-deploy Farcaster manifest (`/.well-known/farcaster.json`), frame embeds (`fc:miniapp`, `fc:frame`), and one-tap cast sharing after minting.
- ✅ **Creator Timelock Management**: Live dashboard tracking onchain expiration deadlines for allowlist commits, public mint toggles, and creator airdrops.
- 🚧 **Base Mainnet Deployment**: Contract deployment to Base mainnet scheduled following testnet audit cycles.

---

## Architecture

```
+------------------------------------------------------------------------+
|                              Client Layer                              |
|           Next.js 16 (App Router) • React 19 • Wagmi 2 • Viem 2        |
|             (Web Browser / Farcaster Mini App & Frame Embed)           |
+------------------------------------------------------------------------+
                                    |
                                    | Read / Write calls (EIP-1193)
                                    v
+------------------------------------------------------------------------+
|                          Base Sepolia Network                          |
|             OnchainPOAPs Contract (`0xC3249...d9de6`)                 |
|                     (ERC-1155 Standard Implementation)                 |
+------------------------------------------------------------------------+
              |                                            |
              v                                            v
+-------------------------------+            +---------------------------+
|      Artwork Vector Code      |            |      Onchain Metadata     |
|   (SSTORE2 Contract Bytecode) |            |   (Base64 Encoded JSON)   |
+-------------------------------+            +---------------------------+
```

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Dominion116/tessera.git
cd tessera

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installation

### Prerequisites

- **Node.js**: `v22.11.0` or higher (strictly enforced via `engines`)
- **Package Manager**: npm 10+, yarn 1.22+, or pnpm 9+
- **Wallet**: An Ethereum wallet configured for **Base Sepolia** with testnet ETH (obtainable from any Base Sepolia faucet)

### npm

```bash
npm install
```

### yarn

```bash
yarn install
```

### pnpm

```bash
pnpm install
```

---

## Usage

### 1. Creating a POAP
1. Connect your wallet to Base Sepolia on [http://localhost:3000/create](http://localhost:3000/create).
2. Choose a template or draw your vector artwork on the canvas studio.
3. Configure POAP metadata: Name, Description, Location, and Event Date.
4. Review onchain storage byte calculation and gas estimate.
5. Submit the registration transaction to write the SVG bytecode directly via SSTORE2.

### 2. Distributing via Merkle Allowlist
1. Navigate to your created POAP's management dashboard.
2. Paste a list of eligible attendee Ethereum addresses (or upload a `.csv` / `.txt`).
3. Tessera generates the Merkle tree and formats the 32-byte root hash.
4. Execute `setAllowlist(poapId, merkleRoot)` onchain (must be done within 30 days of creation).
5. Export personalized claim links or printable QR codes.

### 3. In-Person Signature Claims
1. Select **Signature Minting** when preparing your event station.
2. Sign a claim authorization for an attendee's specific wallet address using EIP-712 / personal sign.
3. Attendee executes the claim transaction within 37 days of POAP registration.

> [!NOTE]
> Signatures authorize a single, explicit wallet address. A single printed signature QR code cannot be shared with multiple attendees.

---

## Smart Contract Reference

| Property | Value |
|---|---|
| **Network** | Base Sepolia (`chainId: 84532`) |
| **Contract Address** | [`0xC3249356a483fbe17d5355D39105D2eA666d9de6`](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code) |
| **Token Standard** | ERC-1155 Multi-Token Standard |
| **Storage Engine** | Solady SSTORE2 (Immutable Bytecode Storage) |
| **Upstream Source** | [jvaleskadevs/onchain-poaps](https://github.com/jvaleskadevs/onchain-poaps) |

A verbatim copy of the upstream contracts resides under [`contracts/`](./contracts) for ABI extraction and offline verification.

### Contract Deadlines & Lifecycles

All timelocks are calculated strictly from the onchain registration timestamp:

| Action | Allowed Window | Permanence |
|---|---|---|
| **Public Minting** | Always (while active) | Toggleable during first 30 days; freezes permanently thereafter |
| **Allowlist Minting** | Always (once set) | Settable once within first 30 days; immutable thereafter |
| **Signature Minting** | First 37 days | Closes permanently at $t = 37\text{ days}$ |
| **Creator Airdrop** | First 30 days | Closes permanently at $t = 30\text{ days}$ |

---

## Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_CHAIN_ID` | No | `84532` | Target network ID (`84532` for Base Sepolia). |
| `NEXT_PUBLIC_POAP_ADDRESS` | No | `0xC324935...` | Deployed OnchainPOAPs contract address. |
| `NEXT_PUBLIC_RPC_URL` | Recommended | `https://sepolia.base.org` | RPC endpoint. Use Alchemy/Infura/QuickNode for production. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Optional | Shared Demo ID | Reown AppKit Cloud Project ID for WalletConnect modal. |
| `NEXT_PUBLIC_APP_URL` | For Production | `http://localhost:3000` | Canonical origin without trailing slash (used in Mini App manifests). |
| `FARCASTER_ACCOUNT_ASSOCIATION_HEADER` | For Mini App | None | Signed manifest header generated via Farcaster dev tools. |
| `FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD` | For Mini App | None | Signed manifest payload. |
| `FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE` | For Mini App | None | Cryptographic signature verifying domain ownership. |

---

## Development

```bash
# Run local development server with Turbopack
npm run dev

# Run TypeScript compiler checks
npm run typecheck

# Run ESLint validation
npm run lint

# Run unit and integration tests (Vitest)
npm test

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## Troubleshooting

### Common Issues

#### 1. RPC Rate Limit (HTTP 429)
- **Symptom:** POAP artwork, balances, or metadata fail to load on the dashboard.
- **Fix:** Public RPC endpoints (`sepolia.base.org`) enforce strict rate limits. Obtain a dedicated API key from an RPC provider (Alchemy, Infura, or QuickNode) and set `NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY`.

#### 2. Signature Mint "Unauthorized / Invalid Signature"
- **Symptom:** Transaction reverts when attempting to mint with a signature.
- **Fix:** Ensure the connected wallet matches the exact recipient address specified during ECDSA signature creation. Signatures are strictly single-recipient.

#### 3. Action Reverts with "Deadline Expired"
- **Symptom:** Unable to enable public minting, airdrop to attendees, or submit an allowlist root.
- **Fix:** Check POAP age against the registration block timestamp. The contract permanently locks allowlists, airdrops, and public mint toggle states after 30 days (and signatures after 37 days).

#### 4. JSON Serialization Error on Registration
- **Symptom:** Metadata fails verification or produces unparseable JSON onchain.
- **Fix:** Ensure event names and descriptions do not contain unescaped quotes (`"`) or backslashes (`\`). The contract constructs JSON strings directly onchain without escaping characters.

---

## Contributing

Contributions are welcome! Please read [`docs/agent.md`](./docs/agent.md) for architectural guidelines and security invariants.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

### Development Invariants
- **Do not modify files in `contracts/`**: Upstream contracts are strictly vendored.
- **Metadata byte safety**: Input strings are constrained by byte count, not character count.
- **Test coverage**: All Merkle tree operations, signature schemas, and canvas shape generators require unit tests in `tests/`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

The smart contracts in `contracts/` are copyright (c) J. Valeska and licensed under the MIT License.

---

## Acknowledgments

- [J. Valeska](https://github.com/jvaleskadevs) - Author of the [onchain-poaps](https://github.com/jvaleskadevs/onchain-poaps) protocol and contract architecture.
- [POAP.xyz](https://poap.xyz) - Pioneers of the proof of attendance concept.
- [Vectorized](https://github.com/Vectorized/solady) - Creators of the gas-efficient `SSTORE2` library.
- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contract building blocks.

---

Made with ❤️ for the onchain community by [Dominion116](https://github.com/Dominion116)
