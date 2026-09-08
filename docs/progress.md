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
to eight, then eight to five. The app surface now exists at `/app`: a wallet
gate, the sidebar shell at `lg` and up, the dock below `lg`, and the dashboard
home (stats, two charts, events table, deadline watch). No chain code exists
yet; the wallet layer is a mock behind one seam.

Superseded, see the FAQ block log entry: application files are committed now
(`c33b38e`, `5cf5135` and `75176d0` landed after the documentation commit
`5649145`), and the working tree was clean apart from `.gitignore` before the
FAQ block task.

### What runs

`/` renders the full landing page. `/hero-03` still renders the hero on its own,
and `/cta-01` renders the CTA block on its own, at the paths the block prompts
specified. `/app` renders the wallet gate until a wallet is connected, then the
dashboard shell with the dashboard home. Light and dark themes both work and the
toggle switches them. The dashboard's Open App entry points (navbar and mobile
dropdown) open the connect prompt when disconnected and link to `/app` when
connected.

### Verification standard

`npx tsc --noEmit` exits 0 and `npx eslint .` exits 0. Builds and dev servers are
never run locally, per `docs/agent.md` instruction 12. The two remaining lint
warnings are `no-img-element` on the `<img>` tags the supplied hero block itself
specifies, left in place because converting them would alter the block.

### Files

```
docs/agent.md                 rules, bounty text, contract reference
docs/implementation.md        build ordering
docs/progress.md              this file
contracts/                    vendored upstream snapshot, read only
app/layout.tsx                ThemeProvider, metadata, favicon, OG and Twitter tags
app/page.tsx                  root, renders the landing page
app/opengraph-image.tsx       1200x800 share image, drawn from the theme tokens
app/hero-03/page.tsx          block path from the supplied prompt, hero only
app/globals.css               Tailwind v4 theme, shadcn neutral tokens, base layer
components/shadcn-space/blocks/hero-03/{index,hero,navbar,navlink}.tsx
components/shadcn-space/button/button-01.tsx    Open App button, links to /app
components/shadcn-space/badge/badge-01.tsx      Badge usage at the block path
components/landing/landing-page.tsx             navbar, section order, footer
components/landing/{section,section-heading,section-footer,feature-card,
                                                reveal,wordmark,arrow-button}.tsx,
                                                the shared section primitives
components/landing/what-it-is-section.tsx       supplied bento grid, five facts
                                                and the browse note
components/landing/how-it-works-section.tsx     register, hand out, prove
components/lifecycle-timeline.tsx               day 0, day 30, day 37 track,
                                                milestones as props, kept for
                                                the dashboard
components/landing/gallery-section.tsx          carousel gallery, See the full gallery
components/ui/carousel-07.tsx                   stacked card carousel from the
                                                shadcn registry, holding the
                                                gallery's placeholder POAPs
components/ui/faq-monocrhome.tsx               supplied FAQ block, seven questions
                                                with meta chips, teal accent on
                                                site tokens
components/ui/bento-product-features.tsx      supplied bento grid layout, six slots
components/shadcn-space/blocks/cta-01/cta.tsx   closing CTA block, teal glow
app/cta-01/page.tsx                             block path, CTA only
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
components/wallet/wallet-provider.tsx  mock wallet context, the swap seam
components/wallet/connect-prompt.tsx   one prompt, modal and full-page
components/wallet/wallet-chip.tsx      short address plus disconnect
components/shadcn-space/button/button-01.tsx   Open App, now client and gated
components/dashboard/dashboard-shell.tsx sidebar shell at lg, topbar below
components/dashboard/sidebar-nav.tsx    dashboard nav, exact match on /app
components/navigation/dock-nav.tsx      fixed bottom dock below lg, shared
components/dashboard/app-gate.tsx       /app switch: prompt or shell
components/dashboard/dashboard-page.tsx the template grid composition
components/dashboard/stat-cards.tsx     four numbers, teal icon chips
components/dashboard/mint-activity-chart.tsx  area chart, mints per day
components/dashboard/method-mix-chart.tsx     donut, mints by route
components/dashboard/events-table.tsx   your events with artwork thumbs
components/dashboard/deadline-watch.tsx timeline plus approaching deadlines
lib/dashboard-data.ts        placeholder dashboard reads, contract-shaped
app/app/page.tsx             the dashboard route
app/layout.tsx               ThemeProvider, WalletProvider, metadata
components/theme-provider.tsx
components/theme-toggle.tsx
lib/utils.ts                  cn
lib/motion.ts                 shared easing, duration, distance, stagger
lib/format.ts                 UTC date, thousands, short address, SVG data URL
lib/poap-data.ts              placeholder events shaped like `events(uint256)`
public/tessera-mark.svg       four-tile mosaic, favicon and spinning nav mark
public/tessera-wordmark.svg   nav logo
public/nft/                   six generated 2:3 mosaic SVGs, carousel artwork
package.json, package-lock.json, tsconfig.json, components.json
next.config.ts, postcss.config.mjs, eslint.config.mjs
.env.example, .gitignore, LICENSE, README.md
```

### Known gaps

- The hero background video still points at `images.shadcnspace.com`. It needs
  real footage or a different treatment before this ships. Content decision.
- In light mode the dropdown panel goes light while the nav still sits over dark
  video. Not yet reconciled.
- Every internal link points at a route that does not exist yet: `/app/create`,
  `/app/collection`, `/app/created`, `/poaps`, `/docs`. They 404 until those
  surfaces are built. The hrefs are correct for the surface in
  `docs/agent.md` §7, so nothing needs rewiring later. `/app` now exists;
  its sidebar and dock link to the still-missing routes with final hrefs.
- The wallet gate is a mock: one placeholder address, session-only memory,
  nothing signed. Real @reown/appkit wiring replaces
  `components/wallet/wallet-provider.tsx` internals in the chain-layer task.
- Dashboard numbers, series and events come from `lib/dashboard-data.ts`,
  not chain reads. Timestamps are relative to load time so the deadline
  arithmetic reads correctly while the data is static.
- Gallery slides are placeholder events with generated SVG artwork in
  `public/nft/`, not chain reads. `lib/poap-data.ts` still feeds
  WhatItIs.
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

**wagmi stays on 2.x.** Not 3.x. RainbowKit 2.2.11 peer-requires `wagmi ^2.9.0`
and `@farcaster/miniapp-wagmi-connector` 2.0.0 peer-requires
`@wagmi/core ^2.14.1`. wagmi 3 breaks both.

**No indexer, no API keys.** All reads come from the contract through
Multicall3, which is deployed at the canonical address on Base Sepolia. This is
what makes the app deployable by a stranger with only an RPC URL.

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

- Documentation section. No blocking inputs, can run in parallel.
- Chain layer, which retires `lib/poap-data.ts` and
  `lib/dashboard-data.ts` in favour of real `totalEvents()` and `events(id)`
  reads through Multicall3, and replaces the mock wallet provider's
  internals with @reown/appkit. The placeholder types already match, so the
  gallery and the dashboard should only need their data sources swapped.
- Hero background video. Still a content decision, still pointing at another
  project's CDN.
