# agent.md: Tessera

Operating manual for any AI agent or contributor working in this repository.
Read this file completely before writing code.

Tessera is an open-source frontend for **Onchain POAPs**, shipping as both a
standalone website and a Farcaster Mini App. It is a bounty submission. The
smart contract already exists and is not ours to change.

---

## 1. Standing instructions

These are hard rules from the project owner. They override convenience.

1. **Never modify the smart contract.** `contracts/` is a verbatim vendored copy
   of the upstream repository, present for reference only. Every file in it is
   byte-identical to upstream and must stay that way. If a contract behaviour is
   inconvenient, the frontend adapts, and the contract does not.
2. **No development-phase language anywhere except `docs/implementation.md`.**
   Not in code, comments, commit messages, UI copy, README, or the docs site. No
   "Phase 1", "MVP", "step 3 of the plan", "coming in a later phase". The product
   reads as finished at every point in time. Features that do not exist yet are
   simply absent, not labelled as pending.
3. **Frontend first.** Build the complete visual surface (landing page,
   dashboard, docs) before wiring contract calls. Static UI with realistic
   placeholder data comes first; live reads and writes replace that data later.
   `docs/implementation.md` holds the ordering.
4. **The hero block sets the theme.** The project owner supplies a
   template/shadcn block for the hero section. Its typography, spacing, colour
   treatment, and motion feel become the design language for every other section
   of the landing page. Do not invent a second visual style alongside it. A
   separate supplied block governs the dashboard the same way.
5. **All placeholder content is app-specific.** Never ship lorem ipsum, never
   ship a supplied block's stock marketing copy. Every heading, label, empty
   state, and sample row talks about POAPs, events, minting, collections,
   creators, attendees. A reader who lands on any screen should understand what
   this product does.
6. **MIT licensed, fully open source, deployable by a stranger.** Setup must work
   from a clean clone with documented environment variables and no private
   services. No API keys required for core functionality.
7. **Test against the real contract.** No mocked contract responses in the final
   product. Base Sepolia is the development network.
8. **Emil Kowalski's design system patterns are mandatory**, not aspirational.
   Section 6 encodes them as checkable rules.
9. **File naming:** `agent.md`, `implementation.md`, and `progress.md` are
   lowercase, and live in `docs/`.
10. **No em dashes in anything written for this repository.** Not in code,
    comments, commit messages, UI copy, documentation, or these files. Use a
    comma, a colon, parentheses, or two sentences. The same applies to en dashes
    used as punctuation and to `·` as a decorative separator; en dashes stay
    correct inside numeric ranges such as 150–250 ms. The one exception is text
    quoted verbatim from outside this project, meaning the bounty brief in §2 and
    every file under `contracts/`, where changing a character would make the
    quote inaccurate.
11. **No slop.** Every sentence carries information the reader does not already
    have. None of the following ship:
    - Padding openers and closers: "In today's fast-paced world", "It is
      important to note that", "At the end of the day".
    - Inflated stakes: "revolutionary", "seamless", "game-changing",
      "cutting-edge", "unlock the power of", "take your events to the next
      level".
    - The "not just X, but Y" construction. Lists of three assembled for rhythm
      rather than because there are exactly three things.
    - Restating a heading in the first sentence beneath it.
    - Closing paragraphs that summarise what was just said.
    - Emoji as decoration, in UI copy, headings, or commit messages.
    - Hedging that dodges a decision: "you may want to consider possibly".
    - Comments narrating syntax: `// increment the counter`.
    - Placeholder prose standing in for content nobody has written yet.

    Write the shortest version a competent reader would find complete. If a
    sentence can be deleted without losing meaning, delete it.
12. **Never run a build or a dev server on the owner's machine.** `next build`,
    `next dev`, `next start`, and any watch or preview process are off limits,
    because they slow the machine down. Verify with static checks instead, which
    are cheap: `npx tsc --noEmit` for types and import resolution, and the
    linter. A real build gets exercised on the deployment host. If something
    genuinely cannot be verified without a build, say so plainly and let the
    owner decide, rather than running one anyway.
13. **Update `docs/progress.md` at the end of every task**, before reporting
    back. It is the handover note between sessions, so record decisions and their
    reasons rather than only file lists, and log corrections to earlier work.

---

## 2. The bounty requirements, verbatim

Preserved unedited as the source of truth for scope. Do not paraphrase away
detail when consulting this section.

> **Build the Onchain POAPs Frontend — Website + Farcaster Mini App**
>
> Build a fully functional, open-source frontend for Onchain POAPs that works
> both as a standalone website and as a Farcaster Mini App.
>
> You are free to be creative with the design and UX. The goal is to make
> creating, distributing, minting, and collecting Onchain POAPs as simple and
> intuitive as possible while exposing the full functionality of the provided
> smart contract.
>
> ## What You Must Build
>
> ### 1. POAP Registration
>
> Users must be able to register a new Onchain POAP by calling the contract's
> register function.
>
> The registration interface must support all allowed contract parameters,
> including:
>
> - POAP name — required
> - POAP SVG image — required
> - Soulbound / non-soulbound POAP
> - Public mint enabled / disabled
> - Allowlist root
> - Optional description
> - Optional location
> - Optional event date
> - Optional external project URL
>
> Check the provided smart contract for the exact parameter types, constraints,
> and behavior.
>
> The frontend should optimize the SVG before registration, or provide a clear
> link/instruction to use a tool such as SVGO to optimize it.
>
> ### 2. Minting
>
> Anyone must be able to use every enabled minting mechanism supported by the
> contract.
>
> The frontend must support:
>
> - Public mint — when public minting is enabled
> - Allowlist mint — when an allowlist root exists and the user is eligible
> - Signature mint — available during the first 37 days after registration
>
> The UI should clearly explain which minting methods are available, who can use
> them, and any relevant time restrictions.
>
> Before a user mints, show them exactly what they are about to mint, including
> the POAP artwork and metadata.
>
> After minting, provide a clear way to verify the resulting POAP, such as links
> to OpenSea and/or BaseScan.
>
> ### 3. Allowlist Management
>
> The POAP creator must be able to set the allowlist root once, within the first
> 30 days after POAP registration.
>
> The frontend must include an allowlist workflow that:
>
> - Explains how allowlists work
> - Provides a guide for creators explaining how to distribute allowlist
>   recipients/proofs
> - Accepts an appropriate recipient list or proofs
> - Can generate the necessary Merkle proof data from a recipient list
> - Allows eligible users to complete an allowlist mint
>
> The goal is for a creator to be able to go from "I have a list of addresses" →
> "my allowlist is configured" without needing to understand the underlying
> Merkle-tree mechanics.
>
> ### 4. Public Mint Controls
>
> The POAP creator must be able to:
>
> - Open public minting
> - Close public minting
>
> These actions must respect the contract's restriction that they are only
> available within the first 30 days after registration.
>
> The UI should make the current public-mint status obvious.
>
> ### 5. Signature Minting
>
> Include a detailed guide for creators explaining:
>
> - How signature minting works
> - How to generate the required signatures
> - How to distribute signatures to recipients
> - The relevant time restrictions
> - How to create QR codes for live-event minting
>
> The goal is to make the signature-minting functionality useful for real-world
> events, where a creator can put a QR code on a screen, poster, badge, or other
> physical object and allow attendees to mint their POAPs.
>
> ### 6. Gallery
>
> Include a gallery where users can:
>
> - View the POAPs they own
> - View POAP artwork
> - View POAP metadata
> - Open individual POAPs for more information
> - Verify their ownership/mint onchain
>
> Make this feel like a real POAP collection rather than simply a blockchain
> transaction viewer.
>
> ## UX & Education
>
> A major part of this bounty is making the protocol understandable.
>
> The frontend should explain the different options to both creators and minters
> in plain language.
>
> For example, creators should understand the practical difference between:
>
> - Soulbound vs. transferable
> - Public minting
> - Allowlists
> - Signature minting
> - Different distribution methods
> - The relevant deadlines and restrictions
>
> Don't assume users already understand Merkle roots, signatures, or smart
> contracts.
>
> ## Documentation
>
> The app must include a comprehensive Docs section explaining the entire system.
>
> At minimum, document:
>
> - Creating a POAP
> - POAP metadata
> - SVG requirements/optimization
> - Soulbound POAPs
> - Public minting
> - Allowlists
> - Generating allowlist proofs
> - Signature minting
> - QR-code distribution
> - Creator permissions
> - Minting deadlines
> - Contract restrictions
> - How to verify minted POAPs
>
> The documentation should be useful enough that a developer or event organizer
> can actually use the system without needing to ask the bounty creator how it
> works.
>
> ## Farcaster Mini App
>
> The frontend must work as both:
>
> - A normal standalone web application
> - A Farcaster Mini App
>
> The Mini App should provide a genuinely usable experience rather than simply
> embedding a website.
>
> You must:
>
> - Deploy the Mini App
> - Post the Mini App in a Farcaster cast
> - Include a link to the standalone app
> - Include a link to the GitHub repository
> - Tag @jvaleska.eth and @kenny
>
> After posting, take a screenshot of the cast and submit the screenshot and a
> link to the cast as part of your POIDH claim.
>
> ## Open Source
>
> The project must include a public GitHub repository.
>
> The entire frontend must be:
>
> - Fully open source
> - MIT licensed
> - Well organized
> - Deployable by someone other than the original developer
> - Documented with setup/development instructions
>
> ## Smart Contract Compatibility
>
> Do not modify the provided smart contract.
>
> The frontend must be fully compatible with the supplied contract and its
> existing interface.
>
> You can use Base Sepolia to test everything during development. Mainnet
> deployment/testing will happen later.
>
> Test the actual contract interactions rather than mocking them.
>
> ## Contract Resources
>
> - Base Sepolia contract:
>   https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code
> - Contract repository: https://github.com/jvaleskadevs/onchain-poaps.git
>
> Be sure to inspect the contract code carefully before implementing the
> frontend. The contract is the source of truth for function parameters,
> permissions, timing restrictions, and validation.
>
> ## What We're Looking For
>
> This isn't just a design contest.
>
> **It must work.**
>
> We want to see a frontend that someone could actually use to create a POAP,
> configure distribution, mint it, and manage the resulting collection.
>
> You have significant freedom over the implementation and design. Clever UX,
> creative distribution flows, excellent documentation, and thoughtful Farcaster
> integration are all encouraged.
>
> The winning claim will be the most creative, efficient, polished, and fully
> functional implementation, as judged by the bounty contributors.
>
> ## Claim Requirements
>
> Your claim must include:
>
> - A link to the deployed standalone frontend
> - A link to the deployed Farcaster Mini App
> - A link to the public GitHub repository
> - A screenshot of your Farcaster cast
> - A link to the Farcaster cast
>
> The cast must tag @jvaleska.eth and @kenny and include the Mini App, frontend,
> and GitHub links.
>
> ## Important
>
> We reserve the right to cancel the bounty if there are no fully functional
> frontend claims.
>
> However, if nobody produces a completely functional implementation, we may
> still consider substantially complete / almost fully functional claims at our
> discretion.
>
> Build something people can actually use. 🚀

---

## 3. Contract reference

`OnchainPOAPs`, an ERC1155 with fully onchain SVG metadata via SSTORE2.

| | |
|---|---|
| Base Sepolia | `0xC3249356a483fbe17d5355D39105D2eA666d9de6` |
| Chain ID | 84532 |
| Base Mainnet | not yet deployed |
| Compiler | solc `0.8.30`, `viaIR: true`, optimizer **disabled** |
| Verified source | `contracts/src/Poap.sol` (identical to the verified deployment) |
| ABI | `contracts/abi/OnchainPOAPs.json` |
| Upstream | https://github.com/jvaleskadevs/onchain-poaps |

**Event ID == token ID.** IDs are sequential from 1; ID 0 is the genesis POAP
created in the constructor. `totalEvents()` is the highest valid ID.

### Write functions

```solidity
function registerEvent(
    string calldata name,        // required, 1..128 bytes
    string calldata description, // optional, <=512 bytes
    uint256 eventDate,           // optional, unix seconds, 0 allowed
    string calldata location,    // optional, <=128 bytes
    bytes32 allowlistRoot,       // bytes32(0) = no allowlist
    string calldata svgImage,    // required, non-empty raw SVG
    string calldata externalUrl, // optional, <=128 bytes
    uint8 flags                  // 0..3
) external returns (uint256 eventId);

function mint(uint256 eventId) external;
function allowlistMint(uint256 eventId, bytes32[] calldata merkleProof) external;
function mintWithSignature(uint256 eventId, bytes calldata signature) external;
function creatorMint(uint256 eventId, address[] calldata recipients) external;
function updateAllowlistRoot(uint256 eventId, bytes32 newRoot) external;
function updateEventPublic(uint256 eventId, bool isPublic) external;
```

`flags` is a two-bit field, validated as `flags > 3 → revert`:

| flags | isSoulbound | isPublic |
|---|---|---|
| 0 | false | false |
| 1 | **true** | false |
| 2 | false | **true** |
| 3 | **true** | **true** |

Derived in the contract as `isSoulbound = flags == 1 || flags == 3` and
`isPublic = flags == 2 || flags == 3`.

### Read functions

```solidity
function events(uint256) external view returns (
    string name, string description, uint256 eventDate, string location,
    bytes32 allowlistRoot, address svgImage, address creator,
    uint256 createdAt, string externalUrl, bool isSoulbound, bool isPublic
);
function hasClaimed(uint256 eventId, address account) external view returns (bool);
function totalEvents() external view returns (uint256);
function uri(uint256 eventId) external view returns (string);      // data:application/json;base64,...
function getMultichainEventId(uint256 eventId) external view returns (string);
function CREATOR_TIMELOCK() external view returns (uint256);       // 30 days in seconds
function totalSupply(uint256 id) external view returns (uint256);  // collectors of one POAP
function totalSupply() external view returns (uint256);
function exists(uint256 id) external view returns (bool);
function balanceOf(address, uint256) external view returns (uint256);
function balanceOfBatch(address[], uint256[]) external view returns (uint256[]);
```

`svgImage` is an **SSTORE2 pointer address**, not image data. The base64 SVG is
only reachable through `uri()`. Never render `svgImage` as an image source.

### Events

```solidity
event NewEvent(uint256 indexed eventId, string name, address indexed creator);
event NewMint(uint256 indexed eventId, address indexed recipient);
event AllowlistUpdated(uint256 indexed eventId, bytes32 newRoot);
event EventPublicUpdated(uint256 indexed eventId, bool isPublic);
```

### Custom errors

Protocol: `POAP__InvalidValue(string field)`, `POAP__TimeLockExpired()`,
`POAP__OnlyCreator()`, `POAP__AlreadyClaimed()`, `POAP__EventNotPublic()`,
`POAP__AllowlistNotEnabled()`, `POAP__RootAlreadySet()`,
`POAP__SoulboundNotTransferable()`.

Inherited: the OpenZeppelin `ERC1155*`, `ECDSA*`, `Strings*` and
`ReentrancyGuardReentrantCall` errors.

Every one of these must map to a specific, human sentence in the UI. Decode
`POAP__InvalidValue`'s `field` argument and name the offending input.

### Deadline matrix

All windows are measured from `events(id).createdAt`, which is the block
timestamp of registration, not `eventDate`.

| Action | Window | Extra conditions |
|---|---|---|
| `mint` | unlimited | `isPublic == true` |
| `allowlistMint` | unlimited | `allowlistRoot != 0` and valid proof |
| `mintWithSignature` | **createdAt + 37 days** | signature recovers to `creator` |
| `creatorMint` | **createdAt + 30 days** | creator only, ≤ 101 recipients |
| `updateAllowlistRoot` | **createdAt + 30 days** | creator only, **once**, current root must be 0 |
| `updateEventPublic` | **createdAt + 30 days** | creator only |

The timelock modifier is `createdAt + 30 days + extraTime < block.timestamp →
revert`, so the boundary is inclusive. `mintWithSignature` passes
`extraTime = 7 days`, giving 37 days total.

### Behaviours that shape the UI

Verified by reading `contracts/src/Poap.sol` directly. Each one is a real
constraint, not a guess.

1. **Signature mints are recipient-bound.** The digest is
   `keccak256(abi.encodePacked(uint256 eventId, uint256 chainId, address recipient))`
   passed through `MessageHashUtils.toEthSignedMessageHash`, and `recipient` is
   `msg.sender`. A signature only works for the one address it was signed for.
   There is no universal signature that any scanner can reuse. Any "QR on a
   poster" flow must therefore be one of: pre-signed per-recipient QR codes, a
   creator-operated signing endpoint that signs on demand, or a plain public
   mint. Document this honestly rather than implying a shared signature works.
2. **Allowlist leaves are single-hashed raw addresses**:
   `keccak256(abi.encodePacked(msg.sender))`, verified with OpenZeppelin
   `MerkleProof.verify`, which hashes sibling pairs in sorted order. This is
   **not** the `StandardMerkleTree` double-hash. Use `SimpleMerkleTree` from
   `@openzeppelin/merkle-tree` with pre-hashed leaves, or the proofs will be
   rejected onchain. This is the single easiest way to ship a broken allowlist,
   so cover it with a test that reproduces the contract's leaf and root exactly.
3. **Metadata strings are interpolated into JSON with no escaping.** `name`,
   `description`, `location` and `externalUrl` are concatenated straight into the
   metadata document. One `"` or `\` permanently corrupts that token's JSON for
   every consumer, forever, with no way to fix it. Reject those characters at the
   input, and explain why. Control characters and newlines are equally unsafe.
   The SVG is exempt, since it is base64-encoded before storage.
4. **Length limits are byte lengths, not character counts.** `bytes(x).length` on
   UTF-8. An emoji costs 4 bytes, most accented Latin costs 2. Count bytes with
   `TextEncoder` and show byte counters, or non-ASCII names will revert at the
   limit.
5. **The public flag freezes permanently at day 30.** Whatever `isPublic` is when
   the creator timelock expires is what it stays, forever. Warn creators well
   before the deadline; this is the most consequential irreversible moment in a
   POAP's life.
6. **An allowlist set at registration can never be changed.**
   `updateAllowlistRoot` reverts with `POAP__RootAlreadySet()` when the current
   root is non-zero. Passing a root to `registerEvent` therefore burns the
   one-time update. Registering with `bytes32(0)` and setting the root later
   keeps flexibility. Make this tradeoff explicit at the point of decision.
7. **One POAP per wallet per event, across all mint methods.** Enforced by a
   shared `hasClaimed` mapping. Always check `hasClaimed` before offering a mint.
8. **`creatorMint` skips rather than reverts.** Already-claimed recipients are
   silently passed over, so a batch never fails as a whole. Report per-address
   outcomes after the transaction instead of claiming every address was minted.
   Hard cap 101 recipients per call; batch larger lists client-side.
9. **Soulbound is enforced in `_update`.** Transfers revert with
   `POAP__SoulboundNotTransferable()`; mints and burns still work. Hide transfer
   affordances entirely for soulbound tokens.
10. **`uri()` reverts for `eventId > totalEvents`** with
    `POAP__InvalidValue("eventId")`. Validate IDs before fetching. Note that
    `uri()` does not revert for unminted-but-registered IDs, only out-of-range
    ones.
11. **SVG size is bounded by SSTORE2 and EIP-170, not by gas.** SSTORE2 writes
    the base64-inflated (~4/3) SVG as the bytecode of one deployed contract,
    and EIP-170 caps deployed code at 24,576 bytes. The largest raw SVG that
    can ever register is 18,429 bytes (24,572 stored); anything larger reverts
    with `DeploymentFailed` no matter the gas offered. Optimize aggressively,
    show the projected onchain size, and refuse anything past the ceiling.
12. **`registerEvent` returns `eventId` as a return value, not just an event.**
    A `NewEvent` log is emitted; parse the receipt logs to learn the new ID after
    a wallet transaction, since return values are not available from a mined
    transaction.

### Reading data without an indexer

`totalEvents()` + `events(id)` + `uri(id)` + `totalSupply(id)` +
`balanceOfBatch` cover explore, gallery and collector counts. Multicall3 is at
the canonical `0xcA11bde05977b3631167028862bE2a173976CA11` on Base Sepolia
(confirmed deployed), so a page of POAPs costs one round trip. Keep it this way:
no indexer, no API keys, so anyone can deploy the app with only an RPC URL.

Public RPC endpoints reject wide `eth_getLogs` ranges with HTTP 413. Any
log-derived feature must chunk block ranges and degrade gracefully. Never make
core functionality depend on log queries.

---

## 4. Tech stack

Versions are pinned deliberately. Do not bump without checking peer ranges.

| Concern | Choice | Version |
|---|---|---|
| Framework | Next.js, App Router | 16.3.4 |
| UI runtime | React | 19.2.x |
| Language | TypeScript, `strict` | 5.x |
| Styling | Tailwind CSS | 4.3.x |
| Components | shadcn/ui (CLI) | 4.19.x |
| Package manager | **npm** | 11.x |
| Chain client | viem | 2.56.x |
| React hooks | wagmi | **2.19.5** |
| Wallet UI | Reown AppKit + wagmi adapter | 1.8.23 |
| Async state | @tanstack/react-query | 5.102.x |
| Mini App SDK | @farcaster/miniapp-sdk | 0.3.0 |
| Mini App connector | @farcaster/miniapp-wagmi-connector | 2.0.0 |
| Merkle | @openzeppelin/merkle-tree | 1.0.8 |
| SVG optimization | svgo, `svgo/browser` entry | 4.1.0 |
| Animation | motion | 13.1.x |
| Forms | react-hook-form + zod | 7.87 / 4.5 |
| Toasts | sonner | 2.0.8 |
| Drawers | vaul | 1.1.2 |
| Icons | lucide-react | 1.39.x |
| Theme | next-themes | 0.4.6 |
| Docs | MDX via @next/mdx + shiki | 16.3.4 / 4.4.x |
| QR | qrcode | 1.5.4 |
| Hosting | Vercel | n/a |

**wagmi stays on 2.x.** wagmi 3 exists but the Reown AppKit wagmi adapter
1.8.23 peer-requires `wagmi >=2.19.5` and `@wagmi/core >=2.21.2`, and
`@farcaster/miniapp-wagmi-connector` 2.0.0 peer-requires
`@wagmi/core ^2.14.1`. Upgrading to wagmi 3 breaks both. Revisit only when
both publish v3-compatible releases.

`svgo` 4 exposes a browser build at the `svgo/browser` subpath export. Import
from there so optimization runs client-side with no server round trip and no
Node built-ins in the bundle.

Node 22.11+ is required by the Farcaster SDK.

---

## 5. Repository layout

```
tessera/
├── docs/
│   ├── agent.md              this file
│   ├── farcaster.md          Mini App manifest, assets, embeds, deploy notes
│   ├── implementation.md     build ordering
│   └── progress.md           running record of what is built and why
├── contracts/                vendored upstream reference, READ ONLY
│   ├── src/Poap.sol
│   ├── src/SSTORE2.sol
│   ├── abi/OnchainPOAPs.json extracted from the verified deployment
│   ├── script/               upstream Foundry scripts
│   ├── test/Poap.t.sol
│   ├── assets/               upstream sample SVGs
│   ├── input/Poap.json       upstream standard-json compiler input
│   ├── foundry.toml, foundry.lock, remappings.txt, .gitmodules
│   └── .env.example, .gitignore, README.md
├── app/, components/, lib/, public/    the Next.js application
│   ├── lib/farcaster/        runtime adapter, manifest and embed builders
│   └── components/farcaster/ host provider and share control
├── README.md
└── .gitignore
```

`docs/progress.md` is the first thing to read when picking up work cold. It
records the current state, the decisions already settled, and the known gaps.

`contracts/` carries upstream's own `.gitignore`, `.env.example` and `README.md`
unchanged, because they are part of the vendored snapshot.

### Verifying the vendored copy

Every file under `contracts/` was fetched at upstream commit
`c313c856cd9f26bbc9e61e4ef12cb3e463409708` and confirmed byte-identical by
recomputing the git blob SHA-1 (`sha1("blob " + len + "\0" + bytes)`) and
comparing against the upstream tree listing. All 24 files matched. Re-run that
check after any change under `contracts/`; it must always report zero mismatches.

`contracts/lib/` is intentionally absent. Upstream tracks forge-std and
openzeppelin-contracts as git submodules (gitlinks, mode `160000`), which carry
no file content. Compiling requires `forge install`; the pinned revisions are in
`foundry.lock` (forge-std `v1.16.2`, openzeppelin-contracts `v5.0.0`).

`contracts/abi/OnchainPOAPs.json` is the one file in that directory not present
upstream. It was extracted from the verified Base Sepolia deployment so the
frontend can import a typed ABI without a Solidity toolchain: 52 entries, 23
functions, 8 events, 20 errors.

---

## 6. Design system

Emil Kowalski's patterns, written as rules that can be checked in review.

### Motion

- Animate `transform` and `opacity` only. Never `width`, `height`, `top`,
  `left`, `margin`, or anything that triggers layout.
- `ease-out` for entrances, `ease-in` for exits. Never `ease-in-out` on an
  entrance, which reads sluggish.
- 150–250 ms for interface transitions. Never exceed 400 ms.
- Anchor `transform-origin` to whatever triggered the element. A menu grows from
  its button.
- Every animation is interruptible. Reversing mid-flight must not glitch.
- Honour `prefers-reduced-motion: reduce` globally: drop transforms, keep
  opacity, or disable entirely.
- An optional ~4 px blur that resolves on enter adds depth. Use sparingly.
- Large or repeated movements are worse than none. Restraint is the default.

### Interaction feedback

- `scale(0.98)` on `:active`, ~100 ms. Every pressable element.
- Transitions on all hover states, never an instant snap.
- `:focus-visible` rings only; never remove focus indication.
- `-webkit-tap-highlight-color: transparent` and `user-select: none` on
  interactive chrome. Never on prose or copyable values like addresses and
  hashes.
- Cursor communicates affordance. Interactive text is not selectable by accident.

### Typography

- Negative letter-spacing on large headings only, `-0.02em` to `-0.04em`,
  scaling with size. Body text keeps default tracking.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body copy.
- `font-variant-numeric: tabular-nums` on every number that changes in place:
  countdowns, byte counters, collector counts, token IDs. Non-negotiable, because
  the 37-day countdown must not jitter.
- A restrained type scale. Fewer sizes, used consistently.

### Surfaces and colour

- Hairline borders as alpha colours in `oklch`, never opaque grey.
- Several small stacked shadows read better than one large blur.
- `inset 0 1px 0 rgb(255 255 255 / 6%)` as a top highlight on raised surfaces.
- Exactly three foreground weights as tokens: primary, secondary, tertiary.
  No ad-hoc greys anywhere.
- One 4 px-based spacing scale. One radius scale. No magic numbers.
- Both light and dark themes are first-class.

### States

- Skeletons match the final content's dimensions exactly. Zero layout shift.
- **Never a dead disabled button.** Every disabled control states its reason in
  adjacent text or a tooltip: "Signature minting closed 3 days ago", "You
  already collected this POAP", "Connect a wallet to mint".
- Every list has a designed empty state that teaches the next action.
- Every error is a sentence a non-developer understands, with a way forward.
- Optimistic UI where safe; never optimistic about transaction success.

### Progressive disclosure

This is the education strategy, not a nicety. The default path never says
"Merkle", "root", "ECDSA", or "calldata". Plain language leads, as in "only these
addresses can mint", with the mechanism available behind an "Advanced" toggle,
an inline explainer, or a link to the docs. Depth on demand, never up front.

---

## 7. Product surface

```
/                          landing
/poaps                     explore, paginated over totalEvents() via multicall
/poaps/[id]                public POAP page: art, metadata, mint panel, collectors, verify
/poaps/[id]/claim          QR / claim-link destination for signature and allowlist mints
/app                       dashboard home
/app/create                registration wizard
/app/created               POAPs I created
/app/created/[id]          manage: lifecycle timeline, allowlist, public toggle, batch drop, signatures
/app/collection            my collection
/app/collection/[id]       one owned POAP with onchain ownership proof
/docs, /docs/[...slug]     MDX documentation
/.well-known/farcaster.json            Mini App manifest, cacheable JSON
/miniapp-assets/[kind]                 PNG icon, splash, hero and share assets
/poaps/[id]/opengraph-image            3:2 PNG event share card
/poaps/[id]/claim/opengraph-image      3:2 PNG claim share card
```

The dashboard sits behind a wallet connection. The landing page, explore, public
POAP pages and docs are all readable without connecting.

`creatorMint` is not on the bounty checklist, but the brief asks for the
contract's *full* functionality, and batch airdrop is the real answer for an
organiser holding a list of attendee addresses. Ship it.

---

## 8. Farcaster Mini App

The full operational detail lives in `docs/farcaster.md`. The rules that must
hold in this codebase:

- **Wallet-only authorization.** Farcaster context is host context only. Never
  use an FID as an account identifier, never create a server session, and never
  let host context grant creator or mint permission. The connected address is
  the only contract authorization identity.
- **No automatic connection.** The native connector is selected only from an
  explicit user action (Open App, Create a POAP, See the full gallery, mint,
  claim, creator controls) inside a confirmed host; AppKit remains the web
  fallback. There is no reconnect on mount and no wallet request during load.
- **Host detection is capability-based.** Use the SDK's `isInMiniApp` and
  `getCapabilities`, never a path or query hint as proof. The runtime adapter
  lives in `lib/farcaster/runtime.ts` and no-ops on the website.
- **`sdk.actions.ready()` is called exactly once**, after the interface is
  renderable, and never blocks rendering on failure. Skipping it leaves users on
  an infinite splash screen; calling it on the wrong signal causes the same bug.
- Manifest at `/.well-known/farcaster.json`, containing `accountAssociation`
  (signed via Farcaster developer tools for the exact production domain) and the
  `miniapp` object: `version: "1"`, `name`, `iconUrl`, `homeUrl`,
  `splashImageUrl`, `splashBackgroundColor`, plus the discovery fields
  `subtitle`, `description`, `primaryCategory`, `tags`, `heroImageUrl`,
  `tagline`, `ogTitle`, `ogDescription`, `ogImageUrl`.
- Manifest assets are sized to the contract: **icon 1024×1024** PNG, **splash
  200×200**, **hero/OG 1200×630** (1.91:1). Field limits are enforced in
  `lib/farcaster/manifest.ts` and covered by tests: name ≤ 32, subtitle ≤ 30,
  description ≤ 170, tagline ≤ 30, ogTitle ≤ 30, ogDescription ≤ 100, up to five
  lowercase tags of ≤ 20 characters.
- Per-page share embeds via a `fc:miniapp` meta tag holding stringified JSON
  (`version`, `imageUrl`, `button.title`, `button.action.type: "launch_miniapp"`,
  `button.action.url`). Mirror it to `fc:frame` for backward compatibility.
- Embed images: **PNG**, 3:2, 600×400 minimum, 3000×2000 maximum, under 10 MB,
  URL ≤ 1024 characters. SVG may render in preview tools but is unreliable in
  production clients. Cache them with a non-zero `max-age`.
- Use `composeCast` so a fresh mint or a new POAP can be shared straight back
  into the feed, only ever after an explicit click, with a copy-link fallback
  when the composer is unavailable. Host back navigation goes through a narrow
  adapter that stays inert when the host does not advertise `back`.
- No notification permission, no notification tokens or webhooks, and no
  Sign in with Farcaster in this release.
- Domain choice is permanent, because a Mini App is identified by its domain and
  `www.` counts as a different app. Pick once, then use it identically in the
  manifest, the `accountAssociation`, and every embed URL.
- The mobile surface is frozen: no second layout, route tree or mobile shell,
  and no changes to the dock, menu composition, spacing or CTA placement beyond
  additive status and share controls.

---

## 9. Working agreements

- Read before writing. The contract in `contracts/src/Poap.sol` is the authority
  on behaviour; this document summarises it, but the source wins.
- After any code change, run the static checks: `npx tsc --noEmit`, the linter,
  and `npm test`. Fix what breaks before reporting done. Do not run a build or
  dev server locally, per instruction 12.
- Test the things that are easy to get silently wrong: Merkle leaf and root
  construction against the contract's exact scheme, the signature digest, byte
  length validation, JSON-unsafe character rejection, and every deadline
  boundary.
- Never commit secrets. `.env.local` is ignored; `.env.example` documents the
  variable names with safe defaults.
- Public RPC endpoints are rate-limited. `NEXT_PUBLIC_RPC_URL` must be
  overridable, with a sensible public default so a clean clone still runs.
- Prefer editing existing files over adding new ones. Match the conventions
  already in the codebase rather than importing a new style.
- Conventional commit messages, with no phase or plan references.

### Definition of done

A change is complete when types and lint are clean, the affected screens work
against the real Base Sepolia contract, loading and empty and error states all
exist, disabled controls explain themselves, motion respects
`prefers-reduced-motion`, keyboard navigation and focus order are correct, the
layout survives 320 px width, both themes look right, and nothing anywhere
mentions a development phase.
