# Tessera Roadmap

Updated 2026-09-10 from the current implementation. Three sequential phases
plus a long-term backlog. Each phase builds on the seams completed before it:
finish the shell first, make the seams live second, add transactions third.
Check tasks off as they ship.

## Baseline

| Surface | Routes | Status |
| --- | --- | --- |
| Landing | `/` | Complete: hero video with dark overlay, features, gallery, FAQ, footer |
| Docs | `/docs/*` | Complete: 8 pages on the contract model |
| Explore | `/poaps/[id]`, `/poaps/[id]/claim` | Live Base Sepolia event reads, claim destinations, mint UI still pending |
| App | `/app`, `/app/create`, `/app/created`, `/app/collection`, `/app/explore` | Wallet-gated AppKit/wagmi shell, live reads, responsive sidebar/dock, registration form |

The architecture is seam-based by design: `lib/poap-contract.ts` owns the
typed Base Sepolia read layer and `components/wallet/wallet-provider.tsx`
owns the Reown AppKit/wagmi wallet seam. The create form validates
contract-sized inputs and is the next write boundary; transaction submission
is being added in Phase 3. There is no test framework yet.

Defects open at review time:

1. Created-view rows link to `/poaps/[id]` using `DASHBOARD_EVENTS` IDs
   (35, 32, 28, 24, 17) that `GALLERY_POAPS` does not contain, so every
   row 404s. Fixed by Phase 1.
2. `/app/collection` is a dead link in the sidebar and the mobile dock.
   Fixed by Phase 1.
3. The hero video requires an explicit mobile playback recovery path. Fixed by
   the landing/hero implementation; asset compression remains backlog work.
4. The create funnel dead-ends at "Continue to registration". Fixed by
   Phase 2.

## Phase 1 — Fix and complete the shell (complete, 2026-09-09)

**Goal:** every navigation target resolves and the app shell exposes all
of its views. Data seams only; no chain wiring.

### 1.1 Unify the event registry

- [x] Add `lib/poap-registry.ts`: `ALL_POAP_EVENTS` merges
      `GALLERY_POAPS` and `DASHBOARD_EVENTS`, plus `findPoapEvent(id)`
- [x] Route the `/poaps/[id]` page and its metadata through the registry
- [x] Route the `/poaps/[id]/claim` page through the registry

**Acceptance:** every created-view row resolves to a real event page, and
exactly one lookup seam exists for the future `events(uint256)` swap.

### 1.2 My collection view

- [x] Add `lib/collection-data.ts`: `CollectedToken` shaped like
      `balanceOf`/`tokenOfOwnerByIndex` reads, owned by
      `CONNECTED_ADDRESS`, carrying mint method and `mintedAt`, joined to
      events through the registry
- [x] Build `components/dashboard/collection-view.tsx` following the
      created-view pattern: stat badges in the header, a card grid,
      links out to `/poaps/[id]`
- [x] Add `collection` to `DashboardView` and `VIEW_BY_HREF`
- [x] Render the view in `dashboard-shell.tsx`
- [x] Add the `/app/collection` route via `AppGate initialView="collection"`
- [x] Make the dock's Collection item switch views in-shell by collapsing
      `onExplore`/`onCreate` into a single `onViewChange`

**Acceptance:** sidebar and dock both open the collection view with no
dead link and no full remount; the wallet gate still applies.

## Phase 2 — Turn the seams into a dapp (reads and wallet complete, 2026-09-09)

**Goal:** real addresses and real reads; every screen shows live data.

### 2.1 Real wallet connection

- [x] Replace `WalletProvider` internals with viem + Reown AppKit; the
      components above the provider stay unchanged by design
- [x] Chain switching to Base Sepolia, account display, disconnect
- [x] Explicit user-triggered connection flows for Open App, Create a POAP,
      and See the full gallery; no reconnect on page load
- [x] Redirect to the landing page after an active wallet disconnects

### 2.2 Contract reads

- [x] Swap the `lib/poap-data.ts` / `lib/dashboard-data.ts` placeholders
      for `events(uint256)`, `uri()` and log-derived mint counts
- [x] Keep the `PoapEvent` shape so no component changes

### 2.3 Create flow: registration step

- [x] Second view of the create funnel: public-mint toggle, soulbound
      choice, allowlist decision
- [x] SVG size validation against the 100 KB onchain encoding limit
- [x] Wire to the registration transaction: submit `registerEvent`, wait for
      confirmation, decode `NewEvent`, and route to the created event page

### Current implementation notes

- [x] Landing hero video has a poster, eager preload, muted inline playback,
      and mobile `canplay`/`loadeddata` playback recovery.
- [x] Mobile dock and landing navigation derive active state from the current
      route, with exact and most-specific-prefix matching.
- [x] `/app/collection` and `/app/explore` are implemented with live reads.
- [x] Wallet-required landing actions open the connection modal only after a
      user click and preserve their requested destination.

## Phase 3 — Transactions and lifecycle

**Goal:** writes, not just reads.

**Current status:** the registration, mint, claim, and creator-control write
surfaces are implemented. The remaining development-only milestone is
automated end-to-end coverage; manual testing is intentionally deferred until
the collective verification phase.

### 3.0 Registration transaction

- [x] Prepare `registerEvent` arguments from the validated create form
- [x] Submit through wagmi on Base Sepolia and show signature/submission/
      confirmation/error states
- [x] Extract the emitted event ID and link to the created event after
      confirmation

### 3.1 Mint actions

- [x] Public mint on the event page
- [x] Allowlist claim (merkle proof) on `/poaps/[id]/claim`
- [x] Signature claim (recipient-specific) on `/poaps/[id]/claim`

### 3.2 Creator controls before the day-30 freeze

- [x] Toggle public mint
- [x] Set allowlist root
- [x] Batch airdrops up to `CREATOR_MINT_BATCH_LIMIT` (101)

### 3.3 Testing

- [x] Vitest: deadline arithmetic (`freezeDeadline`, `daysUntil`,
      `upcomingFreezes`) — the awkward fixtures already exist
- [x] Vitest: registration validation and transaction argument builders
- [ ] Playwright: connect, dashboard, explore, claim paths

## Long-term backlog

- **Farcaster mini-app:** `dock-nav.tsx` was built to be shared with the
  mini-app view; the in-shell view pattern is the reuse point.
- **Base mainnet:** keep chain constants centralized in `poap-data.ts` so
  migration stays a config change.
- **Event indexing:** the mint-activity and route-mix charts need
  log-derived counts, cached (TanStack Query/SWR) rather than
  client-side scans.
- **Hero asset performance:** compress or shorten `nftbg.mp4`; the poster,
  eager preload, muted inline playback, and mobile recovery path are already
  implemented.
