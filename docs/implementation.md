# implementation.md: Tessera

Build ordering for the Tessera frontend.

**This is the only file in the repository permitted to use development-phase
language.** Phase numbers, ordering, and "not yet built" framing stay here. They
must never appear in source code, comments, commit messages, UI copy, the README,
or the documentation site. See `docs/agent.md` §1.2.

Read `docs/agent.md` before starting any phase. It holds the standing
instructions, the contract reference, the pinned dependency versions, and the
design system rules that every phase must satisfy.

---

## Ordering principle

Frontend first, by explicit instruction. The full visual surface (landing page,
dashboard, documentation) is built and reviewable before any contract call is
wired. Phases 0 to 3 produce a complete, navigable, well-designed application
driven by realistic placeholder data. Phases 4 to 9 replace that data with live
contract reads and writes, one capability at a time. Phases 10 and 11 harden and
ship.

Two consequences worth stating plainly:

- Placeholder data is shaped exactly like real contract data: same field names,
  same types, same edge cases (empty description, missing event date, 128-byte
  name, expired deadline). Swapping in live reads should be a change of source,
  not a change of component.
- Every screen is designed once. Phases 4 to 9 add no new layouts.

### Blocking inputs

| Needed for | Input | Status |
|---|---|---|
| Phase 1 | Hero section block from the project owner | awaited |
| Phase 2 | Dashboard block from the project owner | awaited |
| Phase 9 | Production domain + signed `accountAssociation` | awaited |
| Phase 11 | Base Sepolia ETH in a test wallet | awaited |

Phases 0 and 3 have no blocking inputs and can proceed immediately.

---

## Phase 0: Foundation

Scaffold the application and the design system before any feature exists.

- Next.js 16 App Router project at the repository root, TypeScript `strict`, npm.
- Tailwind v4 theme: the three foreground tokens, `oklch` alpha hairlines, the
  4 px spacing scale, one radius scale, light and dark themes via `next-themes`.
- Type scale with heading tracking, `text-wrap` defaults, `tabular-nums`
  utility.
- Motion primitives: shared easing and duration constants, a
  `prefers-reduced-motion` wrapper, the `scale(0.98)` press treatment applied
  globally to interactive elements.
- shadcn/ui initialised and themed to the tokens. Base primitives installed as
  needed rather than all at once.
- Layout shells: marketing header/footer, dashboard sidebar/topbar, docs
  sidebar/content/table-of-contents.
- Sonner mounted. Vaul available for mobile sheets.
- `lib/` skeleton, path aliases, ESLint + Prettier, `.env.example`,
  `.env.local` ignored.
- MIT `LICENSE` at the root.

**Exit criteria.** `npx tsc --noEmit` and the linter are clean. Every shell
renders at 320 px and at desktop width, in both themes. A button press feels
right. Reduced-motion is honoured. No feature code yet.

---

## Phase 1: Landing page

Blocked on the hero block.

- Integrate the supplied hero block. Extract its typography, spacing, colour and
  motion decisions into the theme tokens from Phase 0.
- Build the remaining sections in that same language: what an Onchain POAP is,
  how creating works, the three ways to distribute (public, allowlist,
  signature), soulbound versus transferable, the fully-onchain argument, the
  lifecycle timeline, Farcaster availability, and a closing call to action.
- Every word is about POAPs, events and collections. No stock block copy, no
  lorem ipsum.
- The lifecycle timeline visual (registration, day 30, day 37) is introduced
  here and reused in the dashboard. Build it once, properly.
- Scroll-triggered reveals: opacity and small translate only, `ease-out`, under
  250 ms, disabled under reduced motion.
- Static OG image and metadata.

**Exit criteria.** The page reads as a finished product. Someone unfamiliar with
POAPs understands what this does and how it works. Lighthouse accessibility is
clean. No layout shift on load.

---

## Phase 2: Dashboard surface

Blocked on the dashboard block.

Every dashboard screen, fully designed, driven by placeholder data shaped like
real contract responses.

- Dashboard home: collection summary, created POAPs, anything approaching a
  deadline.
- Create wizard: all eight `registerEvent` parameters across steps, with SVG
  drop zone, live preview, byte counters, soulbound and public choices presented
  as plain-language consequences, and the allowlist-now-versus-later decision.
- Created list and the manage screen: lifecycle timeline with live countdowns,
  public mint status as the most prominent element, allowlist panel, batch drop
  panel, signature panel.
- Collection grid and the single-POAP view with its metadata and verification
  panel.
- Explore grid and the public POAP page with its mint panel.
- The claim page in each of its states.
- Every loading skeleton, every empty state, every error state, every disabled
  control with its reason. This is where they get designed, not retrofitted
  later.

**Exit criteria.** Every route in `docs/agent.md` §7 renders completely. A
reviewer can click through the entire product and understand it without a wallet.
Placeholder data covers the awkward cases: no description, no event date,
maximum-length name, deadline passed, already claimed, soulbound.

---

## Phase 3: Documentation

No blocking inputs. Can run in parallel with Phases 1 and 2.

MDX docs with shiki highlighting, sidebar navigation, per-page table of contents,
and search. Every topic the bounty requires:

creating a POAP, POAP metadata, SVG requirements and optimization, soulbound
POAPs, public minting, allowlists, generating allowlist proofs, signature
minting, QR-code distribution, creator permissions, minting deadlines,
contract restrictions, and verifying minted POAPs.

Plus what a real organiser needs: choosing a distribution method for a given
event shape, the complete deadline reference, the irreversible decisions and when
they lock, error messages and what they mean, and a self-hosting guide.

Two topics need unusual care because the honest answer is not the obvious one:

- **Signature minting.** Signatures are bound to a single recipient address. A
  poster QR cannot carry one signature that everybody reuses. Explain the real
  options, which are pre-signed per-attendee codes, a creator-run signing
  endpoint, or public minting with a time window, and when each fits. Do not
  imply a shared signature works.
- **Allowlists.** The leaf format here is not OpenZeppelin's default. Document
  the exact scheme for developers, while keeping the creator-facing path free of
  the word "Merkle".

**Exit criteria.** An event organiser can run a POAP distribution using only
these docs. A developer can rebuild proof generation from the reference alone.
Every deadline number matches the contract.

---

## Phase 4: Chain layer

The first live data. No new UI.

- wagmi + viem config, Base Sepolia, RainbowKit themed to the tokens,
  react-query defaults.
- ABI imported from `contracts/abi/OnchainPOAPs.json`, typed.
- Multicall3 batching for list reads.
- `uri()` decoding: base64 JSON → metadata → embedded base64 SVG, safely
  rendered.
- Typed read hooks for every view function, with pagination over `totalEvents()`.
- Contract error decoding: every custom error mapped to a human sentence,
  including the `field` argument of `POAP__InvalidValue`.
- Deadline helpers derived from `createdAt`, returning both a boolean and a
  human remaining-time string.
- Placeholder data sources swapped for live reads across the screens built in
  Phase 2.

**Exit criteria.** Explore, POAP detail, collection and created lists all show
real Base Sepolia data. Loading and error states behave against a throttled RPC.
Nothing regressed visually.

---

## Phase 5: Registration

- SVG pipeline: parse, optimize via `svgo/browser`, before/after byte counts,
  projected onchain size after base64 inflation, and a warning as it approaches
  the practical ceiling. Reject non-SVG input and scripted content.
- Byte-accurate validation on all four string fields, plus rejection of
  JSON-unsafe characters with an explanation of why they are refused.
- Flags assembled from the soulbound and public choices.
- Allowlist-at-registration versus later, with the one-time-update consequence
  stated at the point of decision.
- Transaction lifecycle through sonner's promise API; `NewEvent` parsed from the
  receipt to learn the new ID; success routes to the manage screen.

**Exit criteria.** A POAP is registered on Base Sepolia through the UI and
appears in explore with correct artwork and metadata. Every validation failure is
caught client-side before it costs gas.

---

## Phase 6: Minting

- Public mint, allowlist mint, signature mint, each with clear eligibility
  reasoning and the relevant time restriction.
- Method availability computed from `isPublic`, `allowlistRoot`, `hasClaimed`,
  and the 37-day window, with the reason shown when a method is unavailable.
- Pre-mint confirmation showing the exact artwork and metadata.
- Post-mint verification: BaseScan transaction and token links, OpenSea where
  supported, and the onchain balance re-read as proof.
- The claim page consumes proof or signature data from its URL.

**Exit criteria.** All three methods succeed against the live contract. An
already-claimed wallet is told so before it can spend gas. Every closed method
explains itself.

---

## Phase 7: Creator controls

- Allowlist builder: paste or upload addresses, deduplicate, validate,
  checksum, resolve ENS where possible, build the tree with the contract's exact
  leaf format, preview, then set the root. Export per-recipient proofs as claim
  links, a QR sheet, and CSV.
- Public mint toggle with its current state unmistakable and the day-30 freeze
  spelled out.
- Batch drop via `creatorMint`: chunked at 101, per-address outcome reporting
  that reflects the contract's skip-don't-revert behaviour.
- Signature studio: sign for one address or many, generate claim links and QR
  codes, print sheet, live countdown to day 37.
- Lifecycle timeline wired to real timestamps.

**Exit criteria.** An allowlist configured through the UI produces proofs that
mint successfully, verified end to end on Base Sepolia. Signature claim links
work. A batch drop reports accurately when some recipients already held the POAP.

---

## Phase 8: Collection

- Collection built from `balanceOfBatch` across registered IDs.
- Grid that reads as a collection of objects, not a table of transactions.
- Single POAP view: artwork at full fidelity, all metadata and attributes,
  creator, soulbound status, multichain event ID.
- Ownership proof: balance, mint transaction, BaseScan links.
- Soulbound tokens show no transfer affordance at all.

**Exit criteria.** A wallet's POAPs load correctly and feel like a collection.
Ownership is verifiable onchain from the UI.

---

## Phase 9: Farcaster Mini App

Blocked on the production domain.

- `/.well-known/farcaster.json` with `accountAssociation` and the full `miniapp`
  object including discovery fields.
- `sdk.actions.ready()` called when the interface is genuinely ready.
- Mini App detection and auto-connect via the Farcaster connector, bypassing the
  wallet modal; standard flow retained on the web.
- `fc:miniapp` embeds (mirrored to `fc:frame`) on the landing page, POAP pages
  and claim pages, backed by dynamic 3:2 PNG OG routes with sane cache headers.
- `composeCast` sharing after a mint or a registration.
- Safe-area insets, Farcaster back navigation, touch-first spacing.

**Exit criteria.** The Mini App launches in Farcaster with no infinite splash,
connects without a modal, and completes a real mint. Embeds render correctly in
the embed debugger. The same build still works as a plain website.

---

## Phase 10: Polish

- Accessibility: keyboard paths, focus order and visibility, labels, live regions
  for transaction status, contrast, screen-reader passes on the wizard and mint
  flows.
- Performance: bundle audit, `svgo` and merkle code split out of the initial
  load, image and font strategy, Core Web Vitals.
- Motion audit against every rule in `docs/agent.md` §6.
- 320 px through ultrawide. Both themes. Every state.
- A sweep for phase or plan language anywhere outside this file.

**Exit criteria.** Clean accessibility audit. No layout shift. Nothing in the
repository outside this file references a development phase.

---

## Phase 11: Ship

- Full manual pass on Base Sepolia: register soulbound and transferable, public
  and private, allowlist at registration and later, all three mint methods, batch
  drop, toggle public on and off, verify every deadline boundary.
- Automated tests for the silent-failure surfaces: merkle leaf and root against
  the contract's scheme, signature digest construction, byte-length validation,
  JSON-unsafe rejection, deadline arithmetic.
- README: what it is, screenshots, setup, environment variables, development,
  deployment, contract reference, licence.
- Deploy to Vercel. Verify the manifest and embeds on the production domain.
- Cast with Mini App, standalone and repository links, tagging @jvaleska.eth and
  @kenny. Screenshot it.

**Exit criteria.** Every claim requirement in `docs/agent.md` §2 is satisfied. A
stranger can clone, configure and deploy from the README alone.

---

## Progress

Update as work completes. Keep it factual.

| Phase | State |
|---|---|
| Contract reference vendored and verified | done, 25 files byte-identical to upstream `c313c856` |
| ABI extracted | done, `contracts/abi/OnchainPOAPs.json` |
| 0 Foundation | not started |
| 1 Landing page | blocked on hero block |
| 2 Dashboard surface | blocked on dashboard block |
| 3 Documentation | not started |
| 4 Chain layer | not started |
| 5 Registration | not started |
| 6 Minting | not started |
| 7 Creator controls | not started |
| 8 Collection | not started |
| 9 Farcaster Mini App | blocked on domain |
| 10 Polish | not started |
| 11 Ship | not started |
