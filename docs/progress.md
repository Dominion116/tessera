# progress.md: Tessera

What exists in this repository right now, and what state it is in.

**Update this file at the end of every task**, before reporting back. It is the
handover note between sessions: an agent picking up cold should be able to read
this and know what is built, what was decided, and what to do next, without
re-deriving any of it.

How to keep it: append to the log in reverse chronological order, newest first.
Record decisions and their reasons, not just file lists. Corrections belong here
too, because a wrong assumption that already shipped is more dangerous than one
that never did. Related documents are `docs/agent.md` for the rules and the
contract reference, and `docs/implementation.md` for the build ordering.

---

## Current state

The contract reference is vendored and verified. The landing page is complete:
hero plus five blocks down to the footer, all in the hero's visual language,
after consolidation passes that took the blocks below the hero from thirteen
to eight, then eight to five. The app surface at `/app` is a live dapp now:
wallets connect through Reown AppKit over wagmi, and every screen reads the
OnchainPOAPs contract on Base Sepolia directly, batched through Multicall3,
with no mock or placeholder data source left. The create funnel runs two
steps, artwork and details then registration choices, with byte-accurate
validation and the SVG size ceiling enforced. Registration, public, allowlist
and signature mints, and the creator controls all submit transactions.

The same build also serves as a Farcaster Mini App. A client-only runtime
adapter detects the host and calls `ready()` once, the native connector handles
explicit wallet actions inside the host while AppKit remains the web fallback,
and the manifest, PNG assets, `fc:miniapp`/`fc:frame` embeds and an explicit
share control are served from the existing route tree. The mobile surface is
unchanged. Only the signed account association and host acceptance remain; see
`docs/farcaster.md`.

Superseded, see the FAQ block log entry: application files are committed now
(`c33b38e`, `5cf5135` and `75176d0` landed after the documentation commit
`5649145`), and the working tree was clean apart from `.gitignore` before the
FAQ block task.

### What runs

`/` renders the full landing page, whose gallery carousel and holder row now
read the newest registered events off the chain. `/hero-03` still renders the
hero on its own, and `/cta-01` renders the CTA block on its own, at the paths
the block prompts specified. `/app` renders the wallet gate until a wallet
connects through the AppKit modal, then the dashboard shell: the dashboard
home (stats, mint activity, event mix, events table, deadline watch), Explore
with paginated live reads, the two-step create view, the created list and the
collection, all scoped to the connected address. `/poaps/[id]` and
`/poaps/[id]/claim` render server-side reads with per-page loading and error
boundaries. Light and dark themes both work, the toggle switches them, and
the AppKit modal follows the site theme. The dashboard's Open App entry
points (navbar and mobile dropdown) open the AppKit modal when disconnected
and link to `/app` when connected.

The Farcaster surface serves the same landing, POAP and claim routes as Mini
App routes, plus `/.well-known/farcaster.json`, the
`/miniapp-assets/{icon,splash,hero,share}` PNGs, and the 3:2 `opengraph-image`
routes for the event and claim share cards.

### Verification standard

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0. Builds and dev servers are
never run locally, per `docs/agent.md` instruction 12. The two remaining lint
warnings are `no-img-element` on the `<img>` tags the supplied hero block itself
specifies, left in place because converting them would alter the block. The read
layer's live behaviour was additionally exercised against the real contract with
a throwaway Node script (since deleted): out-of-range IDs drop through the
`uri()` failure, the UTF-8 metadata decode round-trips non-ASCII names, and a
60-call multicall batch succeeds in one round trip.

### Files

```
docs/agent.md                 rules, bounty text, contract reference
docs/implementation.md        build ordering
docs/progress.md              this file
contracts/                    vendored upstream snapshot, read only
app/layout.tsx                ThemeProvider, WalletProvider, metadata; passes
                              request cookies into wagmi's SSR hydration
app/page.tsx                  root, renders the landing page, 300 s revalidate
app/opengraph-image.tsx       1200x800 share image, drawn from the theme tokens
app/hero-03/page.tsx          block path from the supplied prompt, hero only
app/cta-01/page.tsx           block path, CTA only
app/globals.css               Tailwind v4 theme, shadcn neutral tokens, base layer
app/app/page.tsx              the dashboard route
app/app/{create,created,collection}/page.tsx  AppGate routes for each view
app/poaps/[id]/page.tsx       public POAP page, server-side live read, 60 s
app/poaps/[id]/claim/page.tsx claim destination, server-side live read
app/poaps/[id]/loading.tsx    skeleton matching the detail layout
app/poaps/[id]/error.tsx      read failure with a retry
app/.well-known/farcaster.json/route.ts   Mini App manifest, cacheable JSON
app/miniapp-assets/[kind]/route.tsx       PNG icon, splash, hero and share assets
app/poaps/[id]/opengraph-image.tsx        3:2 PNG event share card
app/poaps/[id]/claim/opengraph-image.tsx  3:2 PNG claim share card
lib/farcaster/config.ts       canonical origin, asset paths, sizes, capabilities
lib/farcaster/runtime.ts      host detection, ready-once, back adapter, transport
lib/farcaster/manifest.ts     manifest builder with the field limits
lib/farcaster/embeds.ts       fc:miniapp and fc:frame payload builders
components/farcaster/farcaster-provider.tsx   host context at the root
components/farcaster/share-cast-button.tsx    explicit cast or copy share
components/farcaster/brand-og.tsx             shared PNG share-card layout
tests/farcaster-{runtime,embeds,manifest}.test.ts  26 tests
docs/farcaster.md             Mini App operational notes
components/shadcn-space/blocks/hero-03/{index,hero,navbar,navlink}.tsx
components/shadcn-space/button/button-01.tsx    Open App, gated by the wallet
components/shadcn-space/badge/badge-01.tsx      Badge usage at the block path
components/landing/landing-page.tsx             navbar, section order, footer
components/landing/{section,section-heading,section-footer,feature-card,
                                                reveal,wordmark,arrow-button}.tsx,
                                                the shared section primitives
components/landing/what-it-is-section.tsx       supplied bento grid, five facts,
                                                live holder row off the chain
components/landing/how-it-works-section.tsx     register, hand out, prove
components/lifecycle-timeline.tsx               day 0, day 30, day 37 track,
                                                milestones as props
components/landing/gallery-section.tsx          carousel gallery, live showcase
components/ui/carousel-07.tsx                   stacked card carousel from the
                                                shadcn registry, slides as props
components/ui/faq-monocrhome.tsx               supplied FAQ block, seven questions
                                                with meta chips, teal accent on
                                                site tokens
components/ui/bento-product-features.tsx      supplied bento grid layout, six slots
components/shadcn-space/blocks/cta-01/cta.tsx   closing CTA block, teal glow
components/landing/site-footer.tsx              footer composition, brand and nav
                               columns above a divider, meta row, wordmark
components/landing/footer-brand.tsx             Tessera mark, tagline, contract details
components/landing/footer-nav.tsx               Explore, Create, Learn link columns
components/landing/footer-meta.tsx              licence line, BaseScan, source, Docs
components/landing/footer-wordmark.tsx          oversized TESSERA background text
components/ui/{button,dropdown-menu,card,badge,accordion}.tsx  shadcn registry
                              badge carries one added variant, accent
components/ui/{chart,sidebar,table,dialog,sheet,tooltip,separator,
                              skeleton,input}.tsx   shadcn registry, pulled in
                              for the dashboard; sidebar and use-mobile carry
                              two forced lint rewrites, see the log
hooks/use-mobile.ts           media-query hook, rewritten from the registry
hooks/use-poap-reads.ts       react-query hooks over the read layer: event
                              pages, created, collection, claim records,
                              mint scans, day series, event mix
components/wallet/wallet-provider.tsx  AppKit + wagmi behind useWallet, the
                              seam every component above still consumes
components/wallet/connect-prompt.tsx   one prompt, modal and full-page
components/wallet/wallet-chip.tsx      short address plus disconnect
lib/appkit.ts                 WagmiAdapter, projectId, metadata, transports
lib/poap-contract.ts          the read layer: typed ABI, multicall batching,
                              uri() decode, hasClaimed, balances
lib/mint-logs.ts              NewMint log scan, 10k-block chunks, graceful
lib/deadlines.ts              freeze and signature deadline arithmetic
lib/registration.ts           byte limits, JSON-unsafe rejection, SVG size
                              ceiling, flags, root and date parsing
lib/poap-data.ts              the PoapEvent type and chain constants
lib/utils.ts                  cn
lib/motion.ts                 shared easing, duration, distance, stagger
lib/format.ts                 UTC date, thousands, short address, data URL, bytes
components/dashboard/dashboard-shell.tsx sidebar shell at lg, topbar below
components/dashboard/sidebar-nav.tsx    dashboard nav, exact match on /app
components/navigation/dock-nav.tsx      fixed bottom dock below lg, shared
components/dashboard/app-gate.tsx       /app switch: prompt or shell
components/dashboard/dashboard-page.tsx live stats and chart composition
components/dashboard/stat-cards.tsx     four numbers, teal icon chips
components/dashboard/mint-activity-chart.tsx  area chart, log-derived mints
components/dashboard/method-mix-chart.tsx     donut, mints by event
components/dashboard/events-table.tsx   your events with artwork thumbs
components/dashboard/deadline-watch.tsx timeline plus approaching deadlines
components/dashboard/dashboard-explore-view.tsx  paginated live gallery
components/dashboard/created-poaps-view.tsx    live creator library
components/dashboard/collection-view.tsx       live balanceOfBatch grid
components/dashboard/create-poap-view.tsx      two-step create, SVG canvas,
                              templates, registration choices
components/explore/{explore-card,poap-detail-page,mint-action,claim-page,
                    public-header}.tsx  the public surfaces, live reads
components/theme-provider.tsx
components/theme-toggle.tsx
public/tessera-mark.svg       four-tile mosaic, favicon and spinning nav mark
public/tessera-wordmark.svg   nav logo
package.json, package-lock.json, tsconfig.json, components.json
next.config.ts, postcss.config.mjs, eslint.config.mjs
.env.example, .gitignore, LICENSE, README.md
```

### Known gaps

- The hero background video still points at `images.shadcnspace.com`. It needs
  real footage or a different treatment before this ships. Content decision.
- In light mode the dropdown panel goes light while the nav still sits over dark
  video. Not yet reconciled.
- The Farcaster Mini App is complete except for the signed `accountAssociation`
  for the production domain and acceptance in a real Farcaster client. The
  manifest, assets, embeds and connector selection are verified locally; a real
  host run still has to happen. See `docs/farcaster.md`.
- Automated end-to-end coverage now exists as a Playwright suite in `e2e/`
  covering the landing page, documentation, the public POAP page, the claim
  destination, the wallet connection and dashboard, and the Farcaster manifest
  and assets. It has not been run here, because instruction 12 rules out a dev
  server on this machine; the first run and any adjustment belong to the owner.
  Mini App host flows inside a real Farcaster client are still to be covered.
- `/app/created/[id]`, the manage screen with the allowlist builder, the
  public toggle and the batch drop and signature panels, does not exist yet.
- The landing page reads the chain during static generation: a build without
  RPC access renders the gallery and holder fallbacks instead of failing, but
  the first revalidation needs the RPC up.
- The dashboard charts and the collection's mint dates scan `NewMint` logs in
  10k-block chunks. A wallet holding the genesis event scans roughly 130
  chunks against the public RPC, which can take tens of seconds; the UI
  degrades to "Minted onchain" and zero-count charts rather than erroring,
  and a private RPC shortens the wait.
- `app/opengraph-image.tsx` renders through `next/og`, which was never executed
  here because builds are not run locally. Worth eyeballing once deployed.
- Vendored contracts cannot be compiled here: Foundry is not installed, and
  `contracts/lib/` is absent because upstream tracks its dependencies as git
  submodules. Not a problem, since the source is byte-identical to a deployment
  that is already verified onchain.

---

## Decisions worth not relitigating

**Name.** Tessera. A tessera was the token that admitted you to an event in
Rome, and it is also the single tile in a mosaic. Both meanings fit: one token
proves attendance, and a collection forms a picture. The four-tile mark comes
from the mosaic reading. Unresolved: an NFT project called Tessera existed around
2022, believed wound down, but search engines blocked every query, so a trademark
check is still outstanding before a domain is bought.

**Reown AppKit, not RainbowKit.** The roadmap named AppKit and the wallet seam
was always shaped for it. AppKit 1.8.23 with the wagmi adapter peer-requires
`wagmi >=2.19.5` and `@wagmi/core >=2.21.2`, so wagmi stays 2.19.5 and
`@wagmi/core` is pinned explicitly at 2.22.1, because npm otherwise resolves
the adapter's peer against `@wagmi/core` 3.x. Without
`NEXT_PUBLIC_WC_PROJECT_ID` the adapter runs on Reown's documented public
development projectId, which serves injected wallets; production sets a real
one.

**wagmi stays on 2.x.** Not 3.x. The AppKit wagmi adapter and
`@farcaster/miniapp-wagmi-connector` 2.0.0 both peer-require wagmi 2.x core.
wagmi 3 breaks both.

**No indexer, no API keys.** All reads come from the contract through
Multicall3, which is deployed at the canonical address on Base Sepolia, plus
chunked `NewMint` log scans for the counts logs alone can answer. This is
what makes the app deployable by a stranger with only an RPC URL, and mint-log
data stays enrichment: every screen renders without it.

**`uri()` is the range check.** `events(uint256)` is a mapping read, so an
out-of-range ID returns a zero struct, not a revert. `readEvents` drops any
ID whose `uri()` call fails in the aggregate, the only contract-precise
signal that the ID does not exist.

**The wallet seam kept its shape.** `useWallet` still exposes
`address, connect, disconnect`; AppKit's modal replaces the mock's in-memory
address behind it. Disconnecting clears the shared query cache, so a second
wallet never inherits the first one's reads.

**Theme switching is class-based.** `next-themes` with `attribute="class"`,
default dark, system detection on. The theme toggle drives icon visibility
through Tailwind `dark:` variants rather than a mount flag, so server and client
markup are identical.

**Supplied blocks are treated as fixed.** Structure, class names, animation
values, and comments stay exactly as delivered. Only content and import paths
change. Two consequences: the block's `<img>` tags stay as `<img>`, and its
`no-img-element` warnings are accepted. Two later exceptions, both forced:
`href` values became real routes, and internal anchors became `next/link`,
because `no-html-link-for-pages` is a lint error.

**Landing sections live outside the block directory.** `components/landing/`
holds everything below the hero, and `components/landing/landing-page.tsx`
composes the page. The block's own `index.tsx` keeps rendering the hero alone so
`/hero-03` still shows the block as it was delivered.

---

## Log

### Playwright end-to-end suite

Added the browser suite the roadmap has been carrying as the remaining testing
milestone. `@playwright/test` 1.63 is a devDependency, `npm run e2e` runs the
suite, and `playwright.config.ts` starts `next dev` itself unless
`PLAYWRIGHT_BASE_URL` points at an origin that is already up. `PLAYWRIGHT_PORT`
moves the default port. The runner is serial and single-worker on purpose: the
public Base Sepolia RPC is rate-limited, and the wallet tests share one dev
server.

- `e2e/support/mock-wallet.ts` installs `window.ethereum` with
  `page.addInitScript`, before any application script, and answers only the
  account and chain calls a connection needs. AppKit's injected connector
  surfaces it in the wallet modal, and the fixture selects it through AppKit's
  own `data-testid="wallet-selector-injected"`. Reads never travel through the
  mock: wagmi serves them over the Base Sepolia transport, so `npm test`'s
  no-mocked-contract-responses rule still holds. `connectMockWallet` waits for
  the disconnect control, which only renders once an address exists.
- `e2e/public.spec.ts` covers the landing page and the documentation index.
  `e2e/explore.spec.ts` covers the live public POAP page at `/poaps/1` and the
  out-of-range 404 through the `uri()` range check. `e2e/claim.spec.ts` covers
  the signature claim gate, the unsupported-method state and a non-numeric
  404. `e2e/dashboard.spec.ts` connects the injected wallet, asserts the live
  dashboard, and opens Explore in the shell. `e2e/miniapp.spec.ts` asserts the
  manifest content type and body and the four PNG asset routes.
- `vitest.config.ts` now excludes `e2e/**`, so `npm test` stays unit-only.
  `tsconfig.json` still typechecks the suite, and it lints like the rest of the
  repository.

Not run here. Instruction 12 forbids a build or dev server on the owner's
machine, and this suite needs a running application. `npx playwright install
chromium` downloads the browser once, then `npm run e2e` starts the server,
runs the suite and writes the HTML report. Expect the AppKit modal steps to
need adjustment on the first real run; the connector test id and the flow are
based on AppKit 1.8.23's connector list markup, not on a live run.

### Farcaster Mini App

Shipped the Mini App surface from the existing route tree, following the
Farcaster roadmap. No second layout, no route duplication, and no change to the
frozen mobile composition.

- `lib/farcaster/runtime.ts` detects the host from `isInMiniApp` and
  `getCapabilities` only. Farcaster's own publishing guide calls path and query
  markers a best-effort hint and not proof, so they are never trusted. It calls
  `ready()` exactly once after mount and swallows failures, so a broken
  handshake can never block rendering.
- The native connector (`@farcaster/miniapp-wagmi-connector` 2.0.0) is added to
  the shared wagmi config through the AppKit adapter's `connectors` option,
  which the adapter spreads straight into `createConfig`. It is selected only
  from an explicit wallet action inside a confirmed host; AppKit stays the web
  fallback. The roadmap forbids auto-connect, so `reconnectOnMount={false}` was
  restored. This supersedes the older auto-connect wording that used to sit in
  `docs/agent.md` §8.
- Manifest, assets and embeds all derive from one canonical origin with no
  trailing slash, because the account association is domain-bound.
  `/.well-known/farcaster.json` is a cacheable route handler, and
  `next.config.ts` pins JSON content type and cache headers for it and the share
  images so no rewrite can turn it into HTML.
- Manifest assets are sized to the Farcaster contract: icon 1024x1024, splash
  200x200, hero/OG 1200x630, and a 1200x800 3:2 share image. The first pass used
  512 and 1200x800 for every slot and would have failed validation. The field
  limits (name 32, subtitle 30, description 170, tagline 30, ogTitle 30,
  ogDescription 100, up to five tags of 20) are enforced in the builder and
  covered by tests.
- Pages emit both `fc:miniapp` and `fc:frame`. `composeCast` sits behind an
  explicit share button with a copy-link fallback and never fires
  automatically. Back navigation goes through a narrow adapter that stays inert
  when the host does not advertise `back`.
- No notifications, no FID accounts, no server session, per the roadmap.
  Farcaster context is host context only; the connected wallet stays the sole
  contract authorization identity.

Verification: `npx tsc --noEmit` clean, `npx eslint .` 0 errors, 43 unit tests
pass (26 new), production build clean. Runtime checks confirmed the manifest
JSON and content type, PNG content types and dimensions, non-zero `max-age` on
the share images, and `fc:miniapp`/`fc:frame` tags on the landing and event
pages. The signed `accountAssociation` and a real host run remain.

### Legal page framing and footer flow

The legal routes now keep the former header's 4 rem vertical footprint without
rendering a header. A top-left Back to Home link with an arrow occupies that
space, so removing the brand header does not pull the legal content upward.
The shared footer accepts a `sticky` prop: the landing page keeps its existing
sticky presentation, while `/terms` and `/privacy` pass `false` so the footer
remains in normal document flow and scrolls with the legal content.

### Legal routes, mobile controls, and hero media

The landing hero now loads a 960 by 540, video-only H.264 asset at roughly
135 KB instead of the original 1280 by 720, 2.58 MB file. `hero.tsx` uses
`preload="metadata"` and a local poster so the first paint has a still frame
without requiring the full video download. The source asset keeps the same
eight-second loop and visual crop.

- `/terms` and `/privacy` are separate route segments with shared presentation
  in `components/legal/legal-page.tsx`. Their links exist only in
  `footer-meta.tsx`; the primary and public navigation do not expose them.
  The copy explains wallet custody, public blockchain records, submitted
  artwork, technical information, and service availability without implying
  that onchain data can be removed.
- The mobile dashboard header places the existing `ThemeToggle` immediately
  before `WalletChip`, with a card-colored compact button that follows the
  shell theme. Desktop sidebar behavior is unchanged.
- `docs-shell.tsx` no longer places Back to app inside the section navigation.
  It now renders between the article boundary and breadcrumbs on every docs
  page, so mobile and desktop readers encounter the control in the same
  document position.

Static checks: `npx tsc --noEmit` and `npx eslint .` remain the required checks;
the two existing hero `<img>` warnings are unchanged. No build or dev server
was run.

### Dock curve framing and labels corrected

The first animated dock pass used a clipped background rectangle for the curve
and exposed `TabItem.label` only through `aria-label`. That produced fragile
curve rendering in browsers that resolve zero-sized external clip paths
differently, allowed the wide curve to leave the viewport on narrow phones,
and left the new dock without visible labels.

- `components/ui/animated-tab-bar.tsx` now renders the supplied curve as a
  filled SVG path. This removes the external `clipPath` dependency and keeps
  the authored aspect ratio. Its position uses viewport rectangles on both
  sides of the calculation and clamps the SVG box to the menu width, so Home
  and Explore use the same coordinate system and the curve remains framed.
- `app/globals.css` sizes the curve to an 8 rem by 1.75 rem SVG box and the
  dock slots to 3.75 rem. The wider dock retains 60 px touch targets while
  fitting five labelled slots on small screens through normal flex shrinking.
  Labels use the existing inherited foreground tokens and sit below each
  icon. The active lift is 1.25 rem, keeping the icon in the curve without
  colliding with its label.
- The old zero-size SVG helper and `menu-clip-path` identifier are removed,
  eliminating duplicate-identifier and zero-sized-reference failure modes.

Static checks: `npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart
from the two accepted hero `<img>` warnings, unchanged.

### Mobile dock replaced with the animated tab bar

The dock below `lg`, shared with the mini-app view, is no longer the labelled
button row. It is now the animated tab bar pattern: a floating pill whose wave
swell rides the bar's top edge and glides to the active item, an icon that
lifts into the swell and draws itself in stroke by stroke, and a per-item
accent colour. The old dock's external contract is untouched.

- `components/ui/animated-tab-bar.tsx` is the pattern as supplied, plus two
  additions the integration needs: an optional `activeIndex` so the shell's
  `DashboardView` state can drive the highlighted tab (the sidebar can change
  the view while the dock is mounted, and an uncontrolled bar would desync),
  and an optional `label` on `TabItem` that becomes the button's `aria-label`,
  because the new dock is icon-only and the visible text labels are gone. The
  swell positioning math and the `--timeOut` resize guard are unchanged:
  resizes set `--timeOut` to `none`, which invalidates the border's transition
  declaration at computed-value time and makes the reposition snap, and the
  next click removes the property so the glide returns. The ref callback is a
  block body because React 19 treats a returned element from a ref callback as
  an error.
- `app/globals.css` carries the pattern's styles: `@keyframes strok`, the
  zero-size `.svg-container` that keeps the swell's `clipPath` rendered, and
  the `.menu` block. Motion is paint-only (transform, colour,
  stroke-dashoffset), press feedback, teal focus ring, token foregrounds, a
  dark surface with the inset top highlight, and reduced-motion is already
  disabled globally by the existing media block. The draw runs `reverse`, so
  the dashoffset unwinds from 400 (invisible) to the resting 0. Two
  deliberate section 6 deviations: the swell glide is 550 ms and the draw
  600 ms, past the 400 ms interface ceiling, because the travelling wave is
  the pattern's identity and house timings erase it. Both are single values
  in the `.menu__border` transition and the draw rule if the owner wants
  strict compliance. In dark mode the active accent is lightened through
  `color-mix` so saturated colours like `#4343f5` stay readable on the card
  surface.
- `components/navigation/dock-nav.tsx` keeps `activeView` plus `onViewChange`
  and the view semantics: items with a `DOCK_VIEWS` entry switch the in-shell
  view when a handler exists, so the wallet-gated app never remounts, and the
  rest (`/docs`) navigate by router instead of `Link`, since the pattern's
  buttons own the click. The five items keep the sidebar's lucide icons and
  take the pattern's five accents in tab order. The tab bar runs controlled;
  a sidebar-only view like `created` maps to index -1, so no tab lights up,
  matching the old dock's behaviour. Standalone use without a handler falls
  back to pathname matching, as before. The shell's bottom padding still
  clears the new bar (4.5 rem plus the safe-area inset against the existing
  5.5 rem), so `dashboard-shell.tsx` is unchanged.
- `components/demos/animated-tab-bar-demo.tsx` and the
  `/demos/animated-tab-bar` route show the pattern standalone on its pastel
  canvas, matching the showcase-route convention of `/cta-01` and `/hero-03`.
  The demo forces the white bar surface in both themes (the rule sits after
  `.dark .menu` for that reason); the dock follows the app theme instead.

Static checks: `npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart
from the two accepted hero `<img>` warnings, unchanged.

### Explore search and raster artwork uploads

Two Explore-side gaps closed: the dashboard gallery can now be searched, and
the Create studio accepts raster artwork, not just SVG.

**Explore search.** `components/explore/explore-search.tsx` is the search
field: a controlled input with an icon, a drawn clear control, `role="search"`
and an accessible label, kept mounted so typing never remounts the gallery.
`components/dashboard/dashboard-explore-view.tsx` treats a non-empty query as
search mode: `useExploreSearchIndex` in `hooks/use-poap-reads.ts` reads every
registered event once (the same bounded `all-events` query the created and
collection views already share, enabled only while a query exists) and the
view filters it in the browser on name, description, location, external URL
and event number, because the contract exposes no onchain text search. Results
render through the same `ExploreCard` grid with the existing entrance
animation; zero-match and first-search-loading and index-read error states
each have their own card, and pagination returns untouched when the query
clears. The header's live result line counts matches against the registered
total.

**Raster artwork uploads.** The contract still stores only raw SVG, so
`lib/image-artwork.ts` frames an uploaded PNG, JPEG, GIF, WebP or AVIF file
inside a square SVG envelope whose `<image>` element carries the raster as a
data URL. The source is decoded (bitmap first for orientation handling, image
element fallback), center-cropped to a square, and re-encoded at falling
resolutions from 400 px down until the envelope fits the SVG byte ceiling;
alpha is detected on a probe read so transparent artwork stays PNG, opaque
artwork takes whichever of PNG or JPEG is smaller, and anything that never
fits reports why in plain language. `create-poap-view.tsx` gained an Import
image button beside Import SVG, a framed-image state label, and the whole
downstream flow is unchanged: the envelope is ordinary SVG for the byte
counters, the canvas preview, export and the registration review. Studio copy
and the docs' artwork-safety section now state that image uploads register as
the SVG the contract requires.

Static checks: `npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart
from the two accepted hero `<img>` warnings, unchanged.

### Wallet connection and live reads (roadmap phase 2)

The seams are live. `WalletProvider` now wraps Reown AppKit over wagmi while
exposing the same `useWallet` shape, and the placeholder data modules are
deleted: every screen reads the OnchainPOAPs contract on Base Sepolia. The
create funnel gained its second step, the registration choices, so the old
dead-end at "Continue to registration" is gone.

Decisions:

- **One read layer, two consumers.** `lib/poap-contract.ts` holds the typed
  ABI (the vendored JSON cast against a `parseAbi` mirror, so the extracted
  artifact stays the runtime source of truth), the single public client, and
  `readEvents`: `events(id)`, `uri(id)` and `totalSupply(id)` ride one
  Multicall3 aggregate, 20 events per call, out-of-range IDs dropped through
  the `uri()` failure, artwork decoded from the base64 metadata with a
  `TextDecoder` because four onchain events carry non-ASCII names. Server
  components (the public POAP pages, the landing gallery) call the same
  functions the client hooks in `hooks/use-poap-reads.ts` wrap in one shared
  react-query cache, so no screen keeps a private copy of the contract's
  answers.
- **Log-derived counts are enrichment, never a dependency.** The dashboard
  charts and the collection's mint dates read `NewMint` logs through
  `lib/mint-logs.ts` in 10k-block chunks, the widest range the public RPC
  reliably serves (verified against it), four chunks in flight, failed
  chunks contributing nothing. The route-mix donut was redesigned as "Where
  mints land", mints by event, because the mint log names the event and the
  recipient, not the route: the old four-route placeholder mix cannot be
  derived onchain, and inventing it would be a lie. The collection card's
  mint-route label is likewise derived from what the event itself says
  (public, invitation-listed, or from the creator) rather than a per-token
  route the chain does not record.
- **The wallet seam kept its interface.** `connect` opens the AppKit modal,
  wagmi's `useAccount` supplies the address, and disconnect runs through the
  modal and clears the query cache. Request cookies flow from the root
  layout into `WagmiProvider`'s `initialState`, so a server render and the
  first client render agree on the connected account. The AppKit modal
  follows the site theme through `useAppKitTheme` and carries the teal
  accent and the site's radius.
- **The create funnel is two steps.** Step one gained the event date and
  external link inputs, byte counters (the contract counts UTF-8 bytes, not
  characters) and JSON-unsafe character rejection with the reason stated,
  because the contract interpolates metadata fields into JSON without
  escaping. The artwork panel shows raw bytes, the projected base64 size
  onchain, a warning past 100 KB and a refusal past 120 KB. Step two
  presents the public-mint choice, the soulbound choice and the
  invitation-list decision (none, later, or a 32-byte commitment pasted
  now) as plain-language consequences, with the day-30 freeze spelled out
  at the point of decision and a field-by-field review before a prepared
  state that states no transaction is submitted. `lib/registration.ts`
  holds every rule so the form and any future transaction assembly cannot
  disagree.
- **Public pages read server-side.** `/poaps/[id]` and its claim route parse
  the numeric segment, read the event, and 404 on anything the contract
  cannot answer, with a 60 s revalidate, a `loading.tsx` skeleton matching
  the detail layout, and an `error.tsx` that offers a retry. The landing
  page revalidates every 300 s and renders fallback copy if the RPC is
  unreachable at build time.
- **Deleted outright:** `lib/dashboard-data.ts`, `lib/poap-registry.ts`,
  `lib/collection-data.ts` and the six placeholder mosaics in `public/nft/`,
  all fully replaced by live reads. The `PoapEvent` type, the chain
  constants and the deadline helpers live on unchanged in `lib/poap-data.ts`
  and `lib/deadlines.ts`.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings. The read layer was exercised against the
live contract with a throwaway Node script (since deleted): 51 events, 103
mints, the out-of-range drop, the UTF-8 round trip and the 60-call multicall
batch all behave as written.

### Template artwork and palette upgrade

The three canvas presets were rebuilt with far more geometric detail, icons and
stamped text, and each template now carries three color palettes selectable
from swatches on its card. Templates are defined as builder functions that
take a palette and return shapes, so one template renders in any of its
palettes and the loaded artwork is ordinary editable shapes.

- The shape union grew a `polygon` type, optional `fill` on rectangles,
  circles and polygons, and optional `size` and `anchor` on text. The
  serializer, the canvas renderer and the template previews all render the
  extended union through one shared `renderShape` function, and exported text
  is XML-escaped so quotes and angle brackets survive the round trip.
- **Mosaic tile**: a double-line frame, two filled and two framed tiles, two
  inset squares, a filled center diamond, and "POAP" and "2026" stamps with
  accent rules beneath them. Palettes: Tide, Violet dusk, Moss.
- **Orbit seal**: two concentric rings, four compass ticks, a stroked emblem
  with a filled core, a satellite on the inner ring, two four-point sparkles,
  and "TESSERA", "IN ORBIT" and "SINCE 2026" stamps. Palettes: Aurora,
  Nebula, Ember.
- **Signal badge**: a framed badge with a lightning bolt, an "ON AIR" stamp,
  a broadcast mast icon, four ascending bars with the tallest filled, a ruled
  baseline with ticks, and a "MEETUP 2026" caption. Palettes: Pulse, Matrix,
  Ruby.
- Palette swatches are three-stripe gradient dots (accent, base, highlight)
  with `aria-pressed`, focus rings and a teal ring on the active selection.
  Loading a palette also sets the drawing color to that palette's accent, so
  anything drawn afterwards matches.
- Template stamps are placeholder words a creator is expected to replace.
  They remain individual text shapes: select, restyle or delete them like any
  drawn element.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Editable SVG artwork templates

The Create view's canvas now opens with three vector presets above the drawing
surface: a mosaic grid, an orbit mark and a signal-bars badge. Each preset is
stored as the same shape union the drawing tools produce, so selecting one
loads real editable shapes into the canvas rather than a flattened image.

- `loadTemplate` copies the preset shapes into the editor, clears the history,
  clears the imported-artwork state and marks the preset as selected.
- The selected template carries a teal border and `aria-pressed`, and each
  preset button renders a miniature vector preview.
- An `Apply color` control recolors every visible shape using the active color
  picker value, so a creator can restyle a preset without rebuilding it.
- Drawing, deleting, importing or applying color after a template load exits
  the template-selected state, because the artwork is now custom. Undo and
  redo continue to work on template shapes like any other vector.
- Template shapes export through the existing SVG serializer, so the exported
  file is ordinary vector markup with the user's changes applied.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### SVG canvas pointer-event runtime fix

The Create view's SVG canvas could throw `Cannot read properties of null
(reading 'getBoundingClientRect')` while drawing. The coordinate helper was
reading `event.currentTarget` after React had cleared the synthetic event's
target reference.

`components/dashboard/create-poap-view.tsx` now stores the SVG element in a
persistent `canvasRef`. Coordinate conversion reads the ref, pointer capture
uses the ref, and all pointer handlers return safely if the canvas is not
available. Drawing behavior and the generated SVG format are unchanged.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Direct Create route added

`/app/create` now resolves instead of returning 404. It uses the existing
`AppGate` and `DashboardShell` rather than introducing a second creation page:
when the wallet is connected, `AppGate` passes `initialView="create"` and the
shell renders the existing `CreatePoapView` beside the sidebar. When the wallet
is disconnected, the route shows the same full-page wallet prompt as `/app`.

The sidebar and mobile dock continue to switch Create locally, preserving the
`/app` URL and mounted shell state. The direct route exists for links from the
landing page and other entry points, while the dashboard controls remain
in-place controls. `DashboardShell` now accepts an optional `initialView`, and
`app/app/create/page.tsx` supplies the Create view without duplicating any
form or canvas logic.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### In-shell POAP creation studio and SVG canvas

The dashboard now includes Create as a local shell view. Selecting `Create a
POAP` in the sidebar or `Create` in the mobile dock keeps the `/app` URL, wallet
context and dashboard shell mounted, then renders `CreatePoapView` in the main
content area alongside the existing Dashboard and Explore views.

`components/dashboard/create-poap-view.tsx` combines the registration metadata
inputs with a lightweight vector canvas. The canvas provides a freehand brush,
rectangle, circle, line and text tools, configurable color and stroke width,
pointer-based drawing, undo, redo, clear, SVG import and SVG export. Imported
SVG markup is parsed in the browser and removes scripts, `foreignObject` nodes
and inline event attributes before preview or export. Generated artwork uses a
400 by 400 SVG viewBox and stays as vector markup rather than a rasterized
image.

The upload workflow and canvas workflow share the same artwork state boundary:
importing an SVG replaces the drawn preview, drawing replaces imported
artwork, and the Continue button requires both a name and an artwork source.
The form currently captures name, description and location with the contract's
128 and 512 character limits displayed beside the inputs. Public, soulbound,
allowlist and event-date choices remain grouped for the registration workflow
that follows this view. The UI does not submit a transaction.

The existing standalone `/app/create` route remains absent. The local view is
intentional, matching the dashboard Explore behavior and preventing navigation
from resetting shell state. The visual is built from existing cards, buttons,
badges, inputs and dashboard panel tokens, with the existing reduced-motion
rules applying to its entrance and press feedback.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Standalone Explore index removed

The standalone `/poaps` gallery index has been removed because Explore now
belongs inside the dashboard shell. `components/dashboard/dashboard-explore-view.tsx`
is the single gallery entry point from the sidebar and mobile dock, so it keeps
the `/app` URL and dashboard state while rendering in the main content area.

- Removed `app/poaps/page.tsx`, `components/explore/explore-page.tsx` and
  `components/explore/explore-pagination.tsx`.
- Removed the embedded gallery's `Back to dashboard` control because Dashboard
  remains available directly in the sidebar and dock.
- Retargeted landing and supplied block Explore links to `/app` so they do not
  point at the deleted index route.
- Kept `/poaps/[id]` and `/poaps/[id]/claim` because individual POAP cards in
  the embedded gallery still use those public detail and claim destinations.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Dashboard Explore view embedded in the shell

The dashboard's Explore navigation no longer leaves `/app` or mounts the
standalone public Explore route. `components/dashboard/dashboard-shell.tsx`
now owns a local `DashboardView` state and renders either the existing
dashboard content or an embedded Explore gallery inside the current
`SidebarInset`.

- `components/dashboard/sidebar-nav.tsx` treats Dashboard and Explore as
  local view controls. They render accessible buttons, not links, so selecting
  either view does not change the URL, reload the route or reset the wallet
  context.
- `components/dashboard/dashboard-explore-view.tsx` reuses the existing
  `ExploreCard` and `GALLERY_POAPS` data while keeping pagination in local
  state. It includes a Back to dashboard control, preserves the desktop
  sidebar, and uses the existing dashboard entrance animation.
- `components/navigation/dock-nav.tsx` receives the same local view state, so
  Explore behaves consistently below `lg`. Other destinations remain normal
  links and retain their existing route behavior.
- The standalone `/poaps` route remains available for public browsing from
  direct links and public navigation. Only the dashboard's Explore control is
  intentionally embedded.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Explore surface

The public Explore experience now exists at `/poaps`, `/poaps/[id]` and
`/poaps/[id]/claim`. It uses the existing `PoapEvent` contract-shaped data
from `lib/poap-data.ts`, so browsing remains wallet-free and the later chain
layer can replace the source without changing the page-facing model.

- `components/explore/public-header.tsx` provides a compact public header with
  links to the landing page, documentation, dashboard and theme toggle.
- `components/explore/explore-page.tsx` renders the gallery with six events per
  page. Pagination is URL-based through `?page=`, with bounds clamped to the
  available page count and linkable previous/next controls.
- `components/explore/explore-card.tsx` exposes the event ID, artwork, public or
  invite-only status, date, location, collectors, distribution state and
  soulbound or transferable state. Empty date and location fields have explicit
  labels rather than blank space.
- `components/explore/poap-detail-page.tsx` renders the full artwork, event
  metadata, creator, collector count, public mint state, transfer behavior,
  contract link and claim-page link. The SSTORE2 pointer is not rendered as an
  image; the placeholder artwork field stands in for the later `uri()` decode.
- `components/explore/claim-page.tsx` supports `/poaps/[id]/claim?method=allowlist`
  and `?method=signature`, validates the event ID, and uses the existing wallet
  seam to require a connected address. It intentionally does not pretend to
  submit a transaction while the wallet layer is still a local session state.
- `components/explore/mint-action.tsx` gives public events a working connect,
  prepare and confirmation flow without claiming that a chain write occurred.
  Non-public events explain that an allowlist proof or recipient-bound
  signature is required.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Documentation desktop sidebar visibility correction

The mobile disclosure fix initially reused one native `<details>` tree for
both breakpoints. Because a closed `<details>` suppresses all descendants,
desktop responsive display classes could not reveal the sidebar until the
mobile disclosure had been opened.

`components/docs/docs-shell.tsx` now renders two breakpoint-specific
presentations without changing the navigation data or article structure. The
desktop `lg:block` panel is always visible and remains sticky. The mobile
`lg:hidden` panel is the collapsible `<details>` disclosure. Shared link markup
is generated once inside the component and reused by both presentations. The
`Back to app` link remains available in both versions.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Documentation mobile navigation correction

The documentation sidebar previously rendered its complete section list in
normal mobile flow. On narrow screens that list consumed most of the viewport
before the article began, making the documentation content appear hidden.

- `components/docs/docs-shell.tsx` now uses a native `<details>` disclosure for
  the documentation navigation below `lg`. Mobile shows one compact
  `Documentation sections` summary row and expands the list only when the user
  requests it. Desktop keeps the complete sticky sidebar unchanged.
- The disclosure uses the browser's native keyboard and assistive-technology
  behavior, with a visible focus ring and a rotating chevron to communicate
  state. The navigation list remains available to screen readers when opened.
- A persistent `Back to app` link now points to `/app` from every documentation
  page. Users can return to the main application directly after reading an
  article instead of relying on browser history.
- `min-w-0` was added to the docs aside so long labels cannot force the grid
  wider than the viewport. The article grid retains its desktop two-column
  layout and its mobile single-column flow.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Technical documentation section

The documentation surface now exists at `/docs` with seven linked articles
under the overview: getting started, creating a POAP, distribution methods,
deadlines and permissions, contract reference, verification and proof formats,
and application architecture. The content is data-driven in
`components/docs/docs-data.tsx`, so the sidebar, breadcrumbs, metadata and
pagination all derive from one ordered navigation list.

- `components/docs/docs-shell.tsx` provides the persistent section index,
  semantic breadcrumb navigation, article layout and previous/next pagination.
  The sidebar remains sticky on large screens and becomes a normal compact
  navigation block on smaller screens.
- `app/docs/page.tsx` owns the overview route. `app/docs/[...slug]/page.tsx`
  resolves the remaining articles, generates per-page metadata and returns the
  framework's not-found response for unknown paths.
- The articles document the actual Base Sepolia deployment, ERC-1155 event and
  token identity, `registerEvent` inputs, UTF-8 byte limits, JSON-unsafe
  characters, SVG and SSTORE2 behavior, public and allowlist minting,
  recipient-bound signatures, creator airdrops, the day-30 and day-37 windows,
  custom error handling, ownership checks, and the current wallet and data
  seams.
- The allowlist article records the contract's single-hashed raw-address leaf
  scheme and includes the packed encoding shape required by a compatible
  client. The signature article explicitly rules out one shared poster
  signature because the recipient address is part of the digest.
- No MDX dependency was added. The current project has no MDX content pipeline,
  and typed React article data keeps the route self-contained while preserving
  code blocks, tables, hierarchy and project-specific formatting. MDX can be
  introduced later if the documentation volume requires authored files or
  syntax highlighting.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### What a POAP is and How it works visual refinement

The two explanatory landing sections received a visual cleanup without
changing their structure, copy, slot mapping, routes or data flow. The bento
cards in `what-it-is-section.tsx` and the three `FeatureCard` steps in
`how-it-works-section.tsx` now use quieter translucent surfaces, alpha
borders, softer stacked shadows, tighter internal spacing and a restrained
one-pixel hover lift. The previous four-pixel transparent top edge was removed
from these cards because repeated accent rails made every tile feel like the
same generated component.

- The What a POAP is section keeps all six bento slots, but its icon tile and
  large numeric treatments are smaller and more deliberate. Card padding is
  consistent across the tall, standard and wide slots, while the artwork,
  contract facts, holder row and required-field badge remain unchanged.
- The How it works section keeps the ordered three-card flow, section footer
  and existing copy. `FeatureCard` now shares the quieter card material and
  uses a slightly smaller icon with less vertical padding, making the step
  numbers and caveats read as supporting information instead of competing
  badges.
- `BentoGridShowcase` keeps the same responsive grid and six slot wrappers,
  but its spring entrance is now a 240 ms ease-out opacity and 12 px reveal
  with a 70 ms stagger. This matches the site's existing reveal language and
  avoids the elastic, stock-demo feel.
- The existing `Reveal` animation still controls the section headings and How
  it works cards. New hover transitions animate only color, shadow and
  transform, and the global reduced-motion rule continues to remove movement.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Dashboard visual refinement

The dashboard structure and data flow stayed unchanged, but its visual
language was tightened to remove the repeated generated-card feeling. A
shared `dashboard-panel` utility now gives the charts, table and stat cards a
quieter translucent surface, alpha border, restrained stacked shadow and a
subtle one-pixel hover lift. The utility uses the existing theme tokens, so
light and dark mode do not introduce a second palette.

- The dashboard heading now has a small `Creator overview` eyebrow, tighter
  display tracking, a readable measure and a bottom rule that separates page
  context from the data blocks.
- A single 220 ms ease-out entrance animation runs through the existing grid
  children, with a short stagger. Stat cards receive a second, shorter
  internal stagger so the row resolves in sequence rather than appearing as
  four identical panels at once.
- Table rows and approaching-deadline rows now use a low-contrast teal hover
  wash and 180 ms color transition. Sidebar and dock navigation receive the
  same transition timing, while the existing global reduced-motion rule
  disables transforms and compresses transitions for users who request it.
- No component hierarchy, route, data source or interaction behavior changed.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Dashboard home, dock navigation, wallet gate

`/app` exists now: a wallet gate, the sidebar shell at `lg` and up, a fixed
bottom dock below `lg`, and the dashboard home (stats, two charts, the events
table, the deadline watch). Scope held to the plan: create wizard, manage
screens, collection, explore and claim stay out, and their routes stay 404.

Decisions:

- **The supplied dashboard template is a reference, not a vendor source.**
  Its widgets are rebuilt in Tessera terms as single-purpose files under
  `components/dashboard/`, the same modularisation the landing page got. No
  `dashboard-shell-01` demo route exists and no template file is copied
  whole. This supersedes the "supplied blocks stay fixed" rule for this
  template only; its 12-column grid, spacing and widget arrangement remain
  the layout language every dashboard widget follows.
- **recharts 3.8.0, pinned.** The registry `chart` component names that
  exact version, and its peer range accepts React 19. Charts theme through
  the `--chart-*` tokens, where `chart-2` is the teal slot in both themes,
  so the mint activity area carries the site accent without hardcoded
  colours.
- **The registry `sidebar` runs with `collapsible="none"`.** Below `lg` the
  whole sidebar is hidden, not collapsed, because the dock is the
  navigation at that width; collapsing icons would duplicate it. The
  sidebar is `lg:sticky lg:top-0 lg:h-svh` on the shell, which the
  `collapsible="none"` branch allows without editing the registry file: no
  fixed positioning, no sheet, no gap-dance. The mobile topbar plus dock
  live inside `SidebarInset`, and the content column carries
  `pb-[calc(5.5rem+env(safe-area-inset-bottom))]` so the dock never covers
  content on notched phones.
- **The mock wallet is one seam.** `wallet-provider.tsx` holds a single
  placeholder address sourced from `lib/dashboard-data.ts`, in memory,
  session-only, never persisted, nothing signed or broadcast. Every
  component above it consumes `useWallet`, so the real @reown/appkit
  wiring replaces this provider's internals and touches nothing else.
  That wiring also replaces RainbowKit in the `docs/agent.md` §4 stack
  table when the chain-layer task lands; the table is deliberately not
  touched yet.
- **`@iconify/react` skipped.** It was approved, but the rebuilt widgets
  cover their icons with lucide-react, the repo's set, so a second icon
  system would be pure duplication. Add it only if a registry component
  ever requires it.
- **Dock Home is `/app`**, the app-context home, not the landing page.
  Explore, Create, Collection and Docs fill the other four slots, each
  with icon, short label, active state via `usePathname`, focus rings and
  the `press` feedback. The dock is shared with the mini-app view later.
- **Two forced rewrites in registry files**, both lint errors rather than
  choices, continuing the pattern from the theme toggle and the carousel:
  `use-mobile` called setState in an effect and is now a
  useSyncExternalStore subscription with a false server snapshot; and
  `SidebarMenuSkeleton` drew its width with `Math.random` during render,
  which the new `react-hooks/purity` rule rejects, so the width is a fixed
  70%, which also satisfies the skeleton rule in §6 (a skeleton matches
  the final content's dimensions, not a random one).
- **`ArrowButton` grew an optional `onClick`.** With `href` it is the
  delivered pill as a link; with `onClick` the same pill is a real button.
  That is how Open App opens the connect prompt while disconnected and
  links to `/app` once connected, without a second visual.

The gate flow: disconnected, Open App (navbar and mobile dropdown) opens a
Dialog prompt; connecting there lands on `/app`, which shows the same prompt
as a full-page card until a wallet is connected. The prompt is one component
with shared copy constants, explaining wallets and Base Sepolia in plain
language. Disconnecting from the wallet chip returns `/app` to the prompt.

`lib/dashboard-data.ts` is contract-shaped: `PoapEvent` reused from
`lib/poap-data.ts`, a 30-day deterministic mint series, a route mix whose
total equals the collectors stat, and timestamps laid out relative to load
time so deadline arithmetic stays correct while the data is static. Awkward
cases included on purpose: an event past its creator window, one freezing
closed tomorrow, a set allowlist root, an undated event, an empty location.
`deadline-watch.tsx` reuses `components/lifecycle-timeline.tsx` with
milestones derived from those timestamps, the reuse the landing
consolidation earmarked; the day-30 warning states which way the public-mint
flag freezes, because that setting never comes back.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged. The events table artwork uses
the gallery's inline-SVG `<img>` pattern with the per-line disable and
reason.

### Consistency, accessibility and modularity pass

A pass over the composed landing page in the owner's terms: unify drift in
typography and spacing, keep the supplied blocks' visuals intact while fixing
real semantic and keyboard defects, and retire dead code. Decisions:

- **Seven superseded section files deleted.** The cleanup earlier entries
  deferred is done: `facts-strip`, `distribution-section`,
  `soulbound-section`, `lifecycle-section`, `integrations-section`,
  `farcaster-section` and `cta-section` were all still on disk, tracked, and
  imported by nothing after the consolidation passes. `lifecycle-timeline.tsx`
  stays, still earmarked for the dashboard.
- **One arrow pill button owns the page's section actions.** The closing
  CTA's arrow pill was written out three times: in the CTA block, in
  `SectionFooter` (copied "verbatim" because supplied blocks stayed fixed),
  and in the Open App button. `components/landing/arrow-button.tsx` now holds
  that markup once, and all three call sites render it. The CTA block and the
  Open App button changed only their internals; the delivered look is
  unchanged. This reverses the earlier "copied rather than shared" decision
  because the shared component is now the point of the task.
- **FAQ items now use valid disclosure markup.** The delivered block put the
  answer panel, headings and paragraphs inside the toggle `<button>`, which is
  invalid nesting and made the whole answer part of the control's label. Each
  card is now the standard disclosure shape: the question is an `<h3>`
  wrapping the toggle button, and the answer is a labelled `role="region"`
  sibling that opens beneath it. The button carries `aria-expanded` and
  `aria-controls`, and the answer text is selectable again now that it is no
  longer inside a button. The meta chips stepped from `text-[10px]` to
  `text-xs`, the question weight is `font-semibold` like every other card
  title, the plus icon and the ping ring are `aria-hidden`, and the answer's
  open height guard grew to `max-h-96` so long answers are not clipped at
  320 px.
- **Nav and hero controls are labelled.** The hamburger trigger and the close
  button have accessible names (open or close menu), the dropdown backdrop is
  `aria-hidden`, and decorative images no longer announce: the nav wordmark
  link carries `aria-label="Tessera, home"`, and the menu mark, hero mark and
  hero arrow are `aria-hidden` with empty alt. The hero background video is
  `aria-hidden` too. The hamburger and the menu links gained visible focus
  rings, the menu link now reveals its spinning mark on keyboard focus as well
  as hover, and choosing a link closes the menu.
- **A skip link opens the landing page.** The first tab stop jumps to
  `#main`, which the landing page's `<main>` now carries. Standard for a page
  whose first interactive element is a menu button.
- **Type drift pulled back to the site scale.** The CTA headline was
  `text-3xl md:text-5xl font-medium`; every other section headline is
  `text-3xl md:text-4xl font-semibold`, so the CTA now uses the same line.
  Three what-it-is card titles were `text-lg` while their neighbours were
  `text-xl`; the grid now reads one title size across the bento.
- **Footer rhythm and contrast.** The footer band and the meta row stepped
  their horizontal padding at `sm` and `lg` (`sm:px-6 lg:px-8`) while every
  section and the navbar stay at `px-4 xl:px-16`, so the footer columns sat
  outside the content column at intermediate widths. Both now follow the
  shared rhythm. The faint `teal-100/40` definition labels rose to `/50` so
  small text clears contrast on the teal band.

Files touched: the seven deletions above, `arrow-button.tsx` created,
`section-footer.tsx`, the CTA block, `button-01.tsx`, `faq-monocrhome.tsx`,
the hero block's `navbar.tsx`, `navlink.tsx` and `hero.tsx`,
`what-it-is-section.tsx`, `site-footer.tsx`, `footer-meta.tsx`,
`footer-brand.tsx`, `landing-page.tsx`.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings, unchanged.

### Sticky footer corrected for mobile, nav columns horizontal

Correction to the sticky footer entry below. A pinned footer taller than the
viewport hides its own top permanently: the pattern reveals the footer only
over the final stretch of scroll, and at maximum scroll the viewport shows
just the last viewport-height of it. On phones the footer stacks brand, nav,
meta and wordmark to roughly 1000 px against a ~650 px viewport, so the
brand block and the top of the columns could never be scrolled into view.

- **The sticky reveal now runs only at `lg`.** `site-footer.tsx` is
  `relative overflow-hidden bg-teal-950 lg:sticky lg:bottom-0 lg:z-0`. At
  `lg` the two-column footer is about 580 px tall, under every real
  viewport at that width, so the reveal is safe there. Below `lg` the
  footer sits in normal flow after `main`, fully scrollable, and the
  wordmark's absolute anchoring is unaffected because `relative` returns.
  `main` keeps `relative z-10 bg-background` for the `lg` case, where it
  is still the covering layer.
- **The footer nav columns go horizontal on mobile.** `footer-nav.tsx`
  changed from `grid gap-10 sm:grid-cols-3` (one stacked column below
  `sm`, three from `sm`) to `grid grid-cols-3 gap-x-4 sm:gap-x-10`, so
  Explore, Create and Learn always sit side by side. Labels wrap within
  their narrow columns at 320 px, which only costs line height. The
  stacked columns were the largest single block of the mobile footer
  height, about 470 px of it; the row is about 150. Each column's links
  stay a vertical list inside its column, so the grouping still reads.
- The reveal is a large-screen flourish now, which matches how the
  component library itself frames the pattern: their demo assumes a
  footer that fits the viewport. Mobile and tablet get the standard
  scroll-to-the-end footer.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 with the two accepted
`no-img-element` warnings, unchanged.

### Sticky footer pattern applied to the site footer

The footer now uses the Sticky Footer pattern from Fancy Components. That
library ships it as a technique rather than a component, so nothing was
vendored and no dependency was added: the doc is explicit that three Tailwind
classes are the whole mechanism.

- **`site-footer.tsx`** swapped `relative` for `sticky bottom-0 z-0`. The
  footer pins to the bottom of the viewport for the entire scroll and slides
  out from behind the page content over the final stretch, instead of sitting
  in flow until you reach it. `overflow-hidden` and the teal-950 ground are
  unchanged, and the absolutely positioned wordmark still anchors to the
  footer, sticky being a positioned ancestor.
- **`landing-page.tsx`** promoted `main` to the covering layer,
  `relative z-10 bg-background`. The background is required, not cosmetic:
  the muted section bands are `bg-muted/40`, translucent, and without an
  opaque main the pinned footer would show teal through them. Over the body's
  own `bg-background` the layer is visually identical in both themes.
- **Consequence of the pattern:** the footer is always behind `main` in the
  viewport, so its links are clickable only once it is revealed at the end of
  the scroll. Pointer events land on the page content otherwise, which is the
  intended behaviour.
- The pattern is scoped to the landing composition. `/hero-03` and `/cta-01`
  render without the footer and are unaffected.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 with the two accepted
`no-img-element` warnings, unchanged.

### Gallery bento replaced with the stacked card carousel

The bento grid is gone from `#gallery`. It is now `carousel-07` from the shadcn
registry at `components/ui/carousel-07.tsx`: six cards in an overlapping stack,
dragged or swiped through, spring-settled, the centred card carrying the
readable copy. No packages were installed; `motion` 13.1.1 and
`class-variance-authority` 0.7.1 were already pinned.

- **Artwork is six generated SVGs in `public/nft/`, one per event.** Each is a
  2:3 portrait mosaic on that event's own gradient pair from
  `lib/poap-data.ts`, over the same 50 px tesserae grid with teal and slate
  accents as the nav mark, plus a ghost event number, so the stack reads as
  one collection on one palette. They stand in for the base64 SVG `uri()`
  returns; the chain layer swaps the slides array for real reads.
- **The supplied badge file was not copied.** The repo's
  `components/ui/badge.tsx` is a newer registry version carrying the `accent`
  variant and `asChild`, both in use elsewhere, and the supplied one is a
  subset of it. The carousel uses the existing badge with the bento tile
  treatment: `outline` variant, `bg-background/85`, backdrop blur, and the
  `Lock` icon on soulbound slides.
- **Deviations from the delivered carousel, each forced by the rules.** Slide
  content is POAP-specific. `rounded-2xl` became `rounded-xl` and `font-bold`
  became `font-semibold`, the site's card radius and heading weight. The
  italic description weight went to normal. The image hover zoom is dropped:
  the cards are `pointer-events-none` under the drag surface, so that hover
  could never fire, and its 700 ms exceeded the 400 ms motion ceiling anyway.
  The badge's `bg-white/95 text-black` became theme-following
  `bg-background/85`.
- **Two additions.** The drag surface is focusable and arrow keys move the
  stack, so the carousel is keyboard-operable, with a focus ring on the
  surface. Under `prefers-reduced-motion`, drags snap straight to the target
  with `set()` instead of the spring; pointer tracking during a drag stays,
  because it is direct manipulation. `touch-action: pan-y` on the drag surface
  keeps vertical swipes scrolling the page on touch.
- **The bento's per-tile facts (collector count, date, event number) left the
  landing page.** A carousel card has room for title, description and status
  only. The lead still promises those facts, and the See the full gallery
  action leads to `/poaps` for them.
- **One forced rewrite inside the supplied block.** The delivered component
  measured `window.innerWidth` with `setState` inside an effect, and
  `react-hooks/set-state-in-effect` rejects that as an error, the same rule
  that forced the theme-toggle rewrite. Replaced with `useSyncExternalStore`
  over a resize subscription, server snapshot 0 so first paint keeps the
  mobile config. Same behaviour, no effect at all.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### Section footer buttons unified with the closing panel

Two changes after review of the consolidation:

- The how-it-works footer note ("The event number is yours the moment the
  transaction confirms") is removed, and so is the gallery footer note
  ("Artwork on every tile is read out of the contract, not a cache") after a
  later review. `note` is now optional on `SectionFooter`, so both sections
  close with their action alone. The unreferenced section files still on disk
  pass notes only, which still typechecks.
- The footer action button is the closing panel's arrow pill, copied verbatim
  from `cta-01` into `SectionFooter` rather than extracted into a shared
  component, because supplied blocks stay fixed. The how-it-works "Create a
  POAP" and gallery "See the full gallery" buttons now match the CTA button:
  `h-12` rounded-full, the sliding `ArrowUpRight` circle that rotates 45
  degrees on hover, and the padding swap as the circle crosses. The old
  custom footer styling (`h-auto`, `px-5 py-2.5`, `shadow-xs`, teal focus
  ring) is gone; focus styling falls back to the registry Button's own ring.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### Landing page consolidation, eight blocks to five

Replaced four sections with one: Create, Choices, In practice, and Proof are
deleted, and a single `#how-it-works` section shaped Register, Hand out, Prove
sits between WhatItIs and the Gallery. The page below the hero is now
WhatItIs (plain), HowItWorks (muted), Gallery (plain, flipped from muted so
the alternating bands survive), FAQ, CTA, Footer. The reading order recorded
in the `landing-page.tsx` comment: what a POAP is, how one is made and handed
out, what people are holding, and the questions people ask before starting.

- **The new section follows the `create-section.tsx` pattern.** Three
  `FeatureCard`s on the numbered-step grid, each with a body and a small-print
  note under the border. Register: one transaction settles everything the
  badge will ever say, and the open or invitation list, bound or transferable
  choices are made in plain language; the note carries the day-30 freeze of
  the open-to-everyone setting. Hand out: the three routes, run alone or
  together, all check one claim record so no wallet mints twice; the note
  carries the day-37 end of door codes and the no-deadline status of the other
  routes. Prove: details and artwork live in the contract, so a block
  explorer, the app, or your own script give the same answer; the note carries
  the old Proof section's no-database, no-indexer, one-network-URL facts
  nearly verbatim. The Create a POAP footer action survives here, still the
  only create CTA between the hero and the closing panel.
- **The clock and the bound-or-transferable guidance moved to the FAQ.** Two
  new entries bring it to seven: "Which deadlines should I care about?" (day
  30 ends creator controls including batch drops of up to 101 wallets, day 37
  ends door codes, both count from the registration transaction rather than
  the event date) and "Bound to the wallet, or free to move?" (set once at
  registration, never changed afterwards; evidence versus artwork). The new
  answers interpolate the constants from `lib/poap-data.ts`, and the existing
  Permanence answer now interpolates its 30 as well, so every deadline number
  on the page has one source. All three constants stay referenced:
  `CREATOR_TIMELOCK_DAYS` in the section note and two FAQ answers,
  `SIGNATURE_WINDOW_DAYS` in the section note and the deadlines answer,
  `CREATOR_MINT_BATCH_LIMIT` in the deadlines answer.
- **Cut outright:** the event-type recipe cards, the metadata JSON sample, the
  holder-check steps, and the Worth knowing route caveats. The one-chance
  list rule was already stated by the FAQ Permanence answer and is not
  repeated in the new entries. The per-attendee-codes caveat is gone from the
  page entirely.
- **`components/lifecycle-timeline.tsx` is kept**, now unreferenced by the
  landing page, still earmarked for the dashboard.
- **Footer Learn column retargeted.** "How badges get handed out" pointing at
  `#choices` became "How it works" pointing at `#how-it-works`.

Anchors now: `#what-it-is`, `#how-it-works`, `#gallery`, `#faq`, `#start`.
Files deleted: `create-section.tsx`, `choices-section.tsx`,
`use-cases-section.tsx`, `verify-section.tsx`, all previously imported only
by `landing-page.tsx`. File created: `how-it-works-section.tsx`.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### What a POAP is section, supplied bento block wired in

Replaced the hand-built what-it-is section with the supplied bento product
features block at `components/ui/bento-product-features.tsx`, keeping the
section's `id="what-it-is"` and its argument: five facts about a POAP across
six grid cells, with the "no wallet to browse" note folded into the wide bottom
card, so this section no longer ends with a `SectionFooter`.

Content is the old section's facts, condensed to fit the cells. The onchain
storage argument fills the tall left column with the storage parts and contract
facts beneath it, one badge per wallet sits over a row of holders, event number
is token number becomes a dotted 14 cell, the two required fields become a 2
cell, and the portable identifier card closes the grid. No stock copy shipped.

Colour and type use the site language as with the FAQ and CTA blocks: hairline
`border-border/70` cards on `bg-card/60` with the `tile-grout` shadow and the
teal hover top edge from `feature-card.tsx`, text on the `fg-` tokens,
`tabular-nums` on every number, and card titles one step below the section h2.

Three deviations from the delivered file, each forced:

- Import moved from `framer-motion` to `motion/react`, because the project pins
  `motion` and a clean clone would otherwise need a new dependency. The variant
  objects gained `Variants` annotations so `type: "spring"` keeps its literal
  type under `tsc`.
- Grid breakpoints moved from `md` to `lg`. The supplied grid opened three text
  columns at 768 px, where a column narrows to roughly 180 px of measure; the
  repo's own feature-card rule is that three text columns only start at `lg`.
  Below `lg` the section stacks to one column.
- Entrance changed from `animate` on mount to `whileInView` once, so the grid
  animates in on scroll like its neighbours (the FAQ replacement dropped its own
  window-load fade for the same reason). The motion is unguarded for reduced
  motion, the same tolerated exception as the other supplied blocks.

The demo's interactive controls went with its stock content: no Configure
button or toggles survive, because a fake toggle would be a dead control. The
three holder images reuse the gallery's inline SVG artwork as data URLs, so no
network asset is needed, and the per-line `no-img-element` disables carry the
gallery's existing reason. No registry component changed and no dependency was
installed: `card`, `badge`, `motion` and `lucide-react` were already present,
and nothing in the section uses `switch` or `label`.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### Metadata base URL guard

The first Vercel deployment build failed before any page data could be
collected. The platform sets `NEXT_PUBLIC_APP_URL` to an empty string rather
than leaving it absent, so the `??` fallback in `app/layout.tsx` never fired and
`new URL("")` threw `ERR_INVALID_URL` while collecting configuration for
`/_not-found`. The fallback now treats a blank value as unset (`?.trim() ||`
instead of `??`), so `metadataBase` always receives a parseable origin. This
was caught on the deployment host, not locally, because builds are never run
here. `npx tsc --noEmit` and `npx eslint .` still exit clean.

### Footer redesigned and modularised

Redesigned the site footer as a branded wordmark footer, following the layout
reference supplied with the task. The design intent carries over: the content
sits on a deep teal band (`bg-teal-950`), the link columns and a full-width
hairline divider separate the meta row, and an oversized TESSERA wordmark sits
behind the content, cropped at the bottom edge of the band. The wordmark is
decorative: `aria-hidden`, `pointer-events-none`, and a low opacity teal that
cannot compete with the links above it.

The task required the footer's text to survive untouched, and it did. No link,
label, heading, or sentence was added, removed, or reworded. Colours and type
stay in the site's existing language: white and muted mint text on the brand
teal, the same tile mark, and `teal-300` focus rings so keyboard focus reads
against the dark band.

The footer is now a composition of four single-purpose components, matching how
the rest of `components/landing/` is split:

- `footer-brand.tsx` renders the Tessera mark, the tagline, and the contract and
  network details.
- `footer-nav.tsx` renders the Explore, Create, and Learn columns and owns their
  link data.
- `footer-meta.tsx` renders the licence line and the BaseScan, source, and Docs
  pills.
- `footer-wordmark.tsx` renders the oversized background TESSERA text.

`landing-page.tsx` still imports the footer from `site-footer.tsx`, which now
composes the four parts and owns the band, the divider, and the layering.
`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### FAQ block, supplied and wired in

Replaced the hand-built accordion section with the supplied FAQ block at
`components/ui/faq-monocrhome.tsx` (the filename keeps the prompt's spelling),
imported straight into `landing-page.tsx` the same way the CTA block is. The
project already met the block's requirements, and the block needs nothing
beyond React, so no installs.

Structure, classes and animation values stay as delivered, with exceptions,
each forced by this app:

- Content is the same five questions, heading, lead and eyebrow the accordion
  section carried, so the page's argument is unchanged. Each entry gained a
  meta chip (Cost, Artwork, Permanence, Access, Trust).
- The block's own theme system is removed. It toggled `dark` directly and
  persisted a `bento-theme` key, which fights `next-themes`, and its Night/Day
  button duplicated the navbar toggle. All colours are now site tokens or
  `dark:` variants, so the section follows the site theme with no hydration
  mismatch and no second source of truth.
- The colour exception, as with the CTA glow: the monochrome white glows
  became the accent. The card hover glow, the aurora wash behind the section
  and the intro pill's rotating beam are teal (teal-600 in light, teal-400 in
  dark), and cards use `bg-card/60`, `border-border/70` and `tile-grout` like
  every other card on the page.
- The standalone-page shell is gone: no `min-h-screen` surface, and the
  entrance is the shared `Reveal` rather than the block's window-load fade, so
  the section animates in on scroll like its neighbours and honours reduced
  motion. The section keeps `id="faq"`, `scroll-mt-24` and `border-t`, so the
  anchor list and the band rhythm are untouched.
- Heading levels dropped one step (h2 title, h3 questions) because the page
  already has an h1 in the hero.

The intro pill keeps its beam, pulse, meter and tick keyframes and the
pointer-following card glow, injected as delivered.
`components/landing/faq-section.tsx` is deleted; its answers were the source
for the block's content.

Two corrections to earlier entries: the six section files the consolidation
lists as deleted (`facts-strip`, `distribution-section`, `soulbound-section`,
`lifecycle-section`, `integrations-section`, `farcaster-section`) are still on
disk, tracked and unreferenced, so a cleanup pass should decide them together.
And the "every application file is untracked" claim in Current state no longer
holds, as noted above.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### CTA block, supplied and wired in

Replaced the hand-built closing panel with the supplied CTA block at
`components/shadcn-space/blocks/cta-01/cta.tsx`, plus its standalone route
`/cta-01`. The project already met the block's requirements (shadcn structure,
React 19, Tailwind 4, TypeScript 5), so no setup or installs were needed; the
block only uses `motion`, `lucide-react` and the registry `Button`, all
present, and standard Tailwind utilities, so `globals.css` gained nothing.

Block conventions as before: structure, classes and animation values stay as
delivered, with the two usual forced exceptions and one more. Content became
Tessera copy (the old panel's heading and lead, which carry the
required-minimum fact and the chain number from `lib/poap-data.ts`). The
button wraps `next/link` to `/app/create` through `asChild`, matching
`button-01`. The colour exception: the supplied sky-to-amber glow became teal
in both themes (`teal-100` via white in light, `teal-400/10` via black in
dark), because the project's accent is teal and the block was otherwise off
brand. The section keeps `id="start"` so the anchor list is unchanged.

Consequences worth knowing:

- The closing band is no longer a full-bleed teal panel. It is now a bordered
  rounded card on the page background with a teal glow behind it, so the hero
  is the only full-bleed colour block on the page.
- The old panel's fact strip (to create, to collect, to browse) is gone with
  it. The required-minimum fact survives in Create step 01 and the CTA lead;
  browsing without a wallet survives in the FAQ; the "Read the docs first"
  link survives in the navbar, footer and Open by Design.
- `components/landing/cta-section.tsx` is deleted.

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0 apart from the two
accepted hero `<img>` warnings.

### Landing page consolidation, thirteen blocks to eight

Reduced the page below the hero from thirteen blocks to eight and rewrote the
reading order into one argument: what a POAP is, how you make one, the choices
you get, what people have made with it, where it fits, why you can trust it
without trusting us, then the questions people ask before starting. New order:
WhatItIs (plain), Create (muted), Choices (plain), Gallery (muted), UseCases
(plain), Open by Design (muted, keeps `id="verify"`), FAQ (plain), CTA (teal).
The alternating bands survive.

- **Choices merges three sections.** Distribution, Soulbound, and Lifecycle
  became one `#choices` section with three sub-blocks under small uppercase
  sub-eyebrows: who can mint (route cards, `bestFor` dropped since UseCases is
  now the only scenario guidance), bound or transferable (bullet pairs, the
  summary paragraph folded into one lead sentence), and the clock. The section
  lead states the shared claim-record fact once.
- **The timeline moved to `components/lifecycle-timeline.tsx`.** Milestones are
  now a typed prop array, so the dashboard can pass live timestamps later, per
  the build-ordering note that the visual is built once and reused. The static
  data lives in the Choices section. The day-30 freeze warning travels with the
  milestone it belongs to, as an optional `warning` field, and still appears
  exactly once on the page.
- **The facts strip is gone, reversing an earlier decision.** It existed so the
  first thing after the headline is concrete. The correction: every number in
  the strip appeared again within two screens, so the strip repeated the page
  rather than anchoring it. Each fact keeps a home: one badge per wallet in
  WhatItIs, three routes in Choices, the 30 and 37 day windows in the
  timeline, and the 101-wallet batch cap in the day-30 body.
- **WhatItIs keeps two of four small cards.** "Event number is token number"
  lives in the gallery tiles and Create step 04's note; the required-minimum
  fact lives in Create step 01 and the CTA fact strip.
- **Create lost the step-03 freeze note.** The timeline in Choices owns that
  warning, stated once with its warning box.
- **Verify became "Open by Design".** The metadata sample and the holder-check
  card keep their 3 + 2 arrangement. The "No middle layer" card folded into
  the section lead (no database, no indexer, one network URL per clean clone).
  Integrations became a compact tile row under the two cards, and the
  Farcaster section is deleted outright because the integration tile already
  covers connected wallets, minting in the feed, and casting a badge back out.
- **UseCases went from four cards to three.** Meetups and Streams, both "open
  link, transferable", merged into one card for online events and talks, and
  the grid is now `sm:grid-cols-2 lg:grid-cols-3`.
- **FAQ went from ten entries to five, one centered accordion at `max-w-3xl`.**
  Kept: cost (stated nowhere else), artwork size, post-registration changes
  (the permanence objection), wallet needed to browse (lowers the entry
  barrier), and Tessera disappearing (the trust objection). Removed five
  because each restated a section: invitation-list limits (Choices route card
  plus the clock), one code serving a room (Choices route card), batch sends
  (timeline day-30 body), double minting (WhatItIs card plus the Choices
  lead), and the network question (WhatItIs dl, CTA, integration tiles).
- **Footer Learn column retargeted.** Documentation, How badges get handed out
  (`#choices`), Questions (`#faq`). The separate Deadlines link is gone
  because the clock lives inside `#choices`.

Anchors now: `#what-it-is`, `#create`, `#choices`, `#gallery`, `#use-cases`,
`#verify`, `#faq`, `#start`. Files deleted: `facts-strip.tsx`,
`distribution-section.tsx`, `soulbound-section.tsx`,
`lifecycle-section.tsx`, `integrations-section.tsx`,
`farcaster-section.tsx`. Files created: `choices-section.tsx`,
`components/lifecycle-timeline.tsx`. Every constant in `lib/poap-data.ts`
stays referenced. `npx tsc --noEmit` and `npx eslint .` both exit clean apart
from the two accepted hero `<img>` warnings.

### Badge, applied globally

Added `components/shadcn-space/badge/badge-01.tsx` at the path the block prompt
specified, importing `@/components/ui/badge` per `components.json`. The
registry `badge` was already present from the landing page work, so no new
dependency was needed: `class-variance-authority` and `radix-ui` were both
already installed.

Made `Badge` the single source for every pill in the interface, replacing the
hand-rolled spans that had accumulated:

- Section eyebrows in `section-heading.tsx`.
- The mint window pill in `distribution-section.tsx`.
- The Bound overlay on gallery artwork, and the status and location tags beneath
  it.
- Integration tags and event-setup tags.
- The eyebrow on the closing panel.

One deliberate deviation from the registry file: a sixth variant, `accent`,
carrying `border-teal-400/30 bg-teal-400/10 text-teal-700 dark:text-teal-300`.
That combination appeared in three places as inline classes, and the teal pill is
the project's own accent treatment rather than a shadcn default. Everything else
in `components/ui/badge.tsx` is the registry file unchanged.

Dropped the `text-[11px]` overrides that several call sites carried. The
component's own `text-xs` is correct, and the overrides were a magic number
outside the type scale.

### Landing page, everything below the hero

Built the remaining landing page in the hero's language: teal accent, tight bold
display type, the same `max-w-7xl px-4 xl:px-16` container, card surfaces with a
hairline border and a top highlight.

Section order, which is a reading argument rather than a list of features:

1. **Facts strip.** Five numbers straight from the contract, immediately under
   the hero, so the first thing after the headline is concrete.
2. **What a POAP is.** Bento, with the onchain storage argument in the wide cell.
3. **Creating one.** Four numbered steps, each with the constraint that bites.
4. **Handing it out.** The three mint routes as three cards, each stating who can
   use it, its window, what it suits, and its catch.
5. **Bound or transferable.** Two cards, consequences rather than mechanics.
6. **The clock.** Day 0, day 30, day 37 on one track. Built here to be reused by
   the dashboard, per implementation step 1.
7. **Gallery.** Bento of six placeholder POAPs, with See the full gallery
   underneath pointing at `/app/collection`.
8. **In practice.** Four event types with the settings each one wants.
9. **Proof.** A real metadata document and the three steps to check a holder.
10. **Where it works.** Farcaster, wallets, explorers, your own scripts.
11. **In the feed.** Mini App availability.
12. **Questions.** Ten, split across two accordions.
13. **Closing panel.** Solid teal, inverted, the only full-bleed colour block
    besides the hero.
14. **Footer.** Three link columns, contract address, network, licence.

Decisions worth recording:

- **Copy leads with consequences, never mechanism.** "Invitation list", not
  "Merkle root". "Codes at the door", not "signature minting". "Bound to the
  wallet", not "soulbound ERC-1155". Every mechanism claim traces to
  `contracts/src/Poap.sol`: the 30 and 37 day windows, the 101-recipient batch
  cap, one claim per wallet across all routes, the permanent freeze of the public
  flag, and the single allowlist update. The metadata sample in the proof section
  matches the contract's actual key order and its `display_type` on the date.
- **Three foreground weights became tokens.** `--fg-primary`, `--fg-secondary`,
  `--fg-tertiary` in both themes, exposed as `text-fg`, `text-fg-secondary`,
  `text-fg-tertiary`. Sections use those instead of `text-muted-foreground`, so
  there is one place to tune body contrast. The shadcn tokens stay untouched
  because the registry components depend on them.
- **One reveal primitive.** `components/landing/reveal.tsx`, opacity plus a 16 px
  translate, 240 ms, `ease-out`, once, with `useReducedMotion` returning a plain
  `div` so reduced motion gets no transform at all. Values live in
  `lib/motion.ts`. Sections pass `index` for stagger rather than inventing their
  own delays.
- **Placeholder data is contract-shaped.** `lib/poap-data.ts` mirrors
  `events(uint256)` field for field, including `bigint` for the numerics and
  `svgImage` as an SSTORE2 pointer address that is never rendered. Artwork comes
  from a separate `artwork` field standing in for `uri()`. The set covers the
  awkward cases on purpose: empty description, `eventDate` of 0, empty location,
  a 56-byte name that has to wrap, a non-zero allowlist root, and event 0 for
  genesis.
- **`<img>` for gallery artwork, deliberately.** The source is an inline SVG data
  URL, which `next/image` cannot optimize, so `no-img-element` is disabled on
  that one line with the reason in a comment.
- **`next/link` everywhere internal.** ESLint's `no-html-link-for-pages` is an
  error, not a warning, so the nav wordmark, nav links, Open App button, gallery
  tiles, CTA buttons and footer links all use `Link`. The Open App button keeps
  its exact styling through `asChild`.

Also added: a `press` utility for links styled as buttons, since the global
`scale(0.98)` rule only matched real buttons; `scroll-padding-top: 6rem` on
`html` so anchor jumps clear the sticky 80 px header; `text-wrap: balance` on
headings and `pretty` on paragraphs; a `prefers-reduced-motion` block that also
cancels the press transform. `app/opengraph-image.tsx` draws a 1200x800 share
image from the same tokens, and `metadataBase` now reads `NEXT_PUBLIC_APP_URL`
rather than a hardcoded domain that does not exist yet.

Four shadcn registry components pulled in unmodified: `card`, `badge`,
`accordion`, plus the existing `button` and `dropdown-menu`.

`app/page.tsx` now renders `components/landing/landing-page.tsx` instead of the
block's `index.tsx`. The block file went back to hero-only, because
`/hero-03` exists to show the block as delivered and stuffing the whole page into
it would break that. Nav hrefs across the block moved from `#` to their real
routes.

One correction: the first `Reveal` took an `as` prop to render `li` or `section`
elements. `motion[as]` does not type-check against a `HTMLDivElement` ref, and
list semantics are better served by keeping the `li` outside the animated
wrapper. Dropped the prop and made `create-section` and `facts-strip` put the
list element on the outside.

### Favicon, and this file

Added `progress.md`. Pointed the favicon at `public/tessera-mark.svg` through the
`metadata.icons` export in `app/layout.tsx`.

Used `icons.icon` only, not `shortcut` or `apple`. Apple touch icons do not
support SVG, so declaring one would emit a link that iOS silently ignores. A PNG
set is worth generating later for real installability; neither ffmpeg nor
ImageMagick is available on this machine, so it needs another route.

### Open App button and theme toggle

Replaced the two contact links in the nav dropdown, which were a phone number
and an email in the original block and made no sense for a POAP tool.

- `components/ui/button.tsx` from the shadcn registry, unmodified.
- `components/shadcn-space/button/button-01.tsx` at the path the prompt
  specified, label changed to "Open App", everything else intact.
- `components/theme-toggle.tsx` using lucide `Sun` and `Moon`, the same icon set
  as the block's other icons. Shaped to match the hamburger trigger exactly so
  the three controls read as one group.
- `components/theme-provider.tsx` and a rewired `app/layout.tsx`.

Nav is now `flex items-center gap-2 sm:gap-3` holding Open App, the toggle, then
the hamburger. Open App is hidden below `sm`, where it would crowd the wordmark,
and appears inside the dropdown at those widths instead, so it is never
unreachable.

Added `class-variance-authority@0.7.1`, required by the shadcn button, and
`next-themes@0.4.6`.

Two corrections made during this task:

1. `app/layout.tsx` had `className="dark"` hardcoded on `<html>`, which would
   have made the toggle inert. Replaced with `ThemeProvider`.
2. The first toggle used the `mounted` flag pattern from shadcn's own docs.
   ESLint's `react-hooks/set-state-in-effect` rejected it as an error, not a
   warning. Rewritten to use `dark:` variants, which removes the hydration
   placeholder and the layout shift with it. Better regardless.

### Hero section

Scaffolded the application around the supplied hero block, since no codebase
existed. Next 16.3.4, React 19.2.8, Tailwind 4.3.3, TypeScript 5.9.3, npm,
`@/*` aliases, shadcn new-york with the neutral base.

The five block files sit at the exact paths from the prompt. Structure, classes,
animation values, and comments are unchanged. Two necessary differences:

- **Import paths.** The prompt's imports were malformed, for example
  `"'components/shadcn-space/...`. Resolved against `components.json` to
  `@/components/...` and `@/lib/utils`, per implementation step 1.
- **Content.** `SHADCN®SPACE` becomes `TESSERA®POAP`. The tagline becomes "Proof
  you were there, stored entirely onchain", keeping the teal accent span. Nav is
  Home, Explore, Create, Collection, Docs.

Replaced the two shadcnspace-hosted brand SVGs with local `tessera-mark.svg` and
`tessera-wordmark.svg`. Both original URLs return 200, but shipping another
project's logo as our brand would be wrong, and the rotating mark is the block's
signature motion.

Added `app/page.tsx` so `/` renders the hero. The block prompt only specified
`app/hero-03/page.tsx`, so the root route was returning 404.

One correction: the first `eslint.config.mjs` used `FlatCompat` from
`@eslint/eslintrc`, the older Next pattern, and crashed with a circular-JSON
error. `eslint-config-next` 16 ships native flat config at
`eslint-config-next/core-web-vitals`, already including the TypeScript rules.
`@eslint/eslintrc` was removed from `package.json` and the lockfile.

### Em dash and slop rules

Added standing instructions 10 and 11 to `docs/agent.md`, then applied them
retroactively: 24 em dashes cleared from `agent.md` outside the quoted bounty
brief, 25 em dashes plus 12 middot separators from `implementation.md`, 5 from
`README.md`, 2 from `.gitignore`. Phase headings became `## Phase 0: Foundation`.

Verbatim quotes are exempt, meaning the bounty brief in `agent.md` section 2 and
everything under `contracts/`, where changing a character would make the quote
inaccurate.

One correction: the progress table claimed 24 vendored files verified. The real
count is 25. The earlier number predated adding upstream's `.gitignore` to the
checked set.

### Contract reference and documentation

Vendored `contracts/` from upstream commit
`c313c856cd9f26bbc9e61e4ef12cb3e463409708`, file by file, then verified by
recomputing each git blob SHA-1 and comparing against GitHub's tree listing.
25 of 25 byte-identical. That check is repeatable and must always report zero
mismatches.

Extracted `contracts/abi/OnchainPOAPs.json` from the verified Base Sepolia
deployment: 52 entries, 23 functions, 8 events, 20 errors. It is the one file in
that directory not present upstream, and it exists so the frontend can import a
typed ABI without a Solidity toolchain.

Wrote `docs/agent.md`, `docs/implementation.md`, `README.md`, `.gitignore`, and
`LICENSE` (MIT).

Three contract behaviours found by reading the source, each of which would have
caused a silent and expensive failure. All are recorded in `docs/agent.md`
section 3:

1. **Signature mints are recipient-bound.** The digest includes `msg.sender`, so
   one signature on a poster cannot be shared by a crowd. Any QR flow has to be
   per-attendee codes, a signing station, or plain public minting.
2. **Allowlist leaves are single-hashed raw addresses**, not OpenZeppelin's
   `StandardMerkleTree` double-hash. Requires `SimpleMerkleTree` with pre-hashed
   leaves, or proofs get rejected onchain.
3. **Metadata strings are interpolated into JSON with no escaping.** One quote or
   backslash in a name permanently corrupts that token's metadata for every
   consumer, forever.

Live state at the time of checking: `totalEvents()` was 35, and every write
function had already been exercised on Base Sepolia.

---

## Next

Ordering lives in `docs/implementation.md`. Immediately actionable:

- Generate the Farcaster `accountAssociation` for `tesserapoap.vercel.app`, set
  the three `FARCASTER_ACCOUNT_ASSOCIATION_*` variables on Vercel, deploy, and
  validate the manifest and embeds with Farcaster developer tooling.
- Run the Mini App in a real Farcaster host: launch, explicit connect,
  registration, all three mint routes, claim, share, back and disconnect.
- Run the Playwright suite once on a machine with RPC access
  (`npx playwright install chromium` then `npm run e2e`) and fix whatever the
  AppKit modal steps need on the first real run.
- Playwright coverage for Mini App host flows inside a real Farcaster client.
- Hero background video. Still a content decision, still pointing at another
  project's CDN.
