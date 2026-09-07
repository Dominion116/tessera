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
hero plus eight blocks down to the footer, all in the hero's visual language,
after a consolidation pass that reduced thirteen blocks below the hero to
eight. No chain code exists yet.

Superseded, see the FAQ block log entry: application files are committed now
(`c33b38e`, `5cf5135` and `75176d0` landed after the documentation commit
`5649145`), and the working tree was clean apart from `.gitignore` before the
FAQ block task.

### What runs

`/` renders the full landing page. `/hero-03` still renders the hero on its own,
and `/cta-01` renders the CTA block on its own, at the paths the block prompts
specified. There is no other route. Light and dark themes both work and the
toggle switches them.

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
components/landing/{section,section-heading,reveal,wordmark}.tsx   primitives
components/landing/what-it-is-section.tsx       bento, onchain storage argument
components/landing/create-section.tsx           four registration steps
components/landing/choices-section.tsx          mint routes, bound or
                                               transferable, the clock
components/lifecycle-timeline.tsx               day 0, day 30, day 37 track,
                                               milestones as props
components/landing/gallery-section.tsx          bento gallery, See the full gallery
components/landing/use-cases-section.tsx        three event setups
components/landing/verify-section.tsx           metadata sample, holder check,
                                               integration tiles
components/ui/faq-monocrhome.tsx               supplied FAQ block, five questions
                                              with meta chips, teal accent on
                                              site tokens
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
components/theme-provider.tsx
components/theme-toggle.tsx
lib/utils.ts                  cn
lib/motion.ts                 shared easing, duration, distance, stagger
lib/format.ts                 UTC date, thousands, short address, SVG data URL
lib/poap-data.ts              placeholder events shaped like `events(uint256)`
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
- Every internal link points at a route that does not exist yet: `/app`,
  `/app/create`, `/app/collection`, `/app/created`, `/poaps`, `/docs`. They 404
  until those phases land. The hrefs are correct for the surface in
  `docs/agent.md` §7, so nothing needs rewiring later.
- Gallery tiles are placeholder events from `lib/poap-data.ts`, not chain reads.
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
- Dashboard surface, once the dashboard block arrives. The lifecycle timeline in
  `components/lifecycle-timeline.tsx` is the one to reuse there; it takes
  milestones as props, so it accepts live timestamps.
- Chain layer, which retires `lib/poap-data.ts` in favour of real
  `totalEvents()` and `events(id)` reads through Multicall3. The placeholder
  types already match, so the gallery should only need its data source swapped.
- Hero background video. Still a content decision, still pointing at another
  project's CDN.
