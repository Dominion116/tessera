# Landing page consolidation, v2

Revised after reading the repo rules and every section file. The hero block is
untouched. Content is reduced inside the surviving sections, and layouts may be
redesigned as long as they stay in the hero's visual language. Goal: 13 blocks
below the hero become 8, every surviving fact is presented exactly once, and the
icon-card-grid monotony between Gallery and FAQ is broken up.

## Rules that bind this change

From `docs/agent.md`, `docs/implementation.md`, `docs/progress.md`:

- The supplied hero block is fixed. No changes to `hero.tsx`, `navbar.tsx`,
  `navlink.tsx`, `button-01.tsx`, or `app/hero-03/` (user instruction plus
  agent.md instruction 4). The `/hero-03` route stays as delivered.
- No em dashes and no slop in anything shipped (instructions 10 and 11). Write
  the shortest version a competent reader finds complete. Copy leads with
  consequences, never mechanism.
- Validation is static only: `npx tsc --noEmit` and `npx eslint .`. Never run a
  build or dev server (instruction 12).
- `docs/progress.md` is updated at the end of the task, newest first in the Log,
  recording decisions and reasons, including corrections to earlier decisions
  (instruction 13).
- The lifecycle timeline visual is shared with the dashboard later
  (`implementation.md`: introduced on the landing page, reused in the
  dashboard, built once). It is extracted to a shared component, not
  demolished.
- Everything stays in the hero's language: `Section`, `SectionHeading`, `Card`,
  `Badge`, `Reveal`, teal accents, `tile-grout` surfaces, `tabular-nums` on
  numbers, alternating `muted` bands, `select-all` on the contract address.
  Both themes and 320 px width must survive.
- Placeholder data in `lib/poap-data.ts` stays the single source for every
  number. Do not delete or inline any constant.

## Target outline

| Current block (13) | New block (8) | Decision |
|---|---|---|
| FactsStrip | gone | every fact has a home below, see task 3 |
| WhatItIs (1 large + 4 small cards) | WhatItIs (1 large + 2 small) | trim, see task 4 |
| Create (4 steps) | Create (4 steps, shorter copy) | trim, task 5 |
| Distribution (3 route cards, 7 fields each) | Choices (merged section) | merge, task 2 |
| Soulbound (2 option cards) | Choices sub-block | merge, task 2 |
| Lifecycle (timeline card) | Choices sub-block, timeline extracted | merge, tasks 1 and 2 |
| Gallery | unchanged | visual proof, distinct bento layout |
| UseCases (4 cards) | UseCases (3 cards) | trim, task 7 |
| Verify (3 cards) | Open by Design (2 cards + integration row) | merge, task 6 |
| Integrations (4 cards) | Open by Design integration row | merge, task 6 |
| Farcaster (3 point cards) | gone | fully covered by the Farcaster integration card, task 6 |
| FAQ (10, two accordions) | FAQ (5, one accordion) | trim, task 8 |
| CTA band | unchanged | single closing CTA, already correct |

New order and muted bands (alternation preserved):
WhatItIs (plain), Create (muted), Choices (plain), Gallery (muted), UseCases
(plain), Open by Design (muted, keeps `id="verify"`), FAQ (plain), CTA (teal).

New reading argument for the `landing-page.tsx` doc comment: what a POAP is, how
you make one, the choices you get, what people have made with it, where it
fits, why you can trust it without trusting us, then the questions people ask
before starting.

## Tasks (ordered)

### 1. Extract the lifecycle timeline

Create `components/lifecycle-timeline.tsx` holding the existing Card, track,
and milestone list from `lifecycle-section.tsx:53-94`. Changes:

- Milestones become props (a typed array of `{ day, label, title, body, at }`)
  so the dashboard can later pass live timestamps. The static MILESTONES data
  from `lifecycle-section.tsx:20-42` moves to the Choices section as its data
  source.
- Keep the decorative track, the `tabular-nums` day labels, and the teal day-30
  freeze warning box (lines 82-88). The warning stays exactly once on the page.
- Trim each milestone body to at most two sentences. Day 30 keeps the batch cap
  mention (it is the sole remaining home of `CREATOR_MINT_BATCH_LIMIT`).
- No `Reveal` inside the component; the parent wraps it.

### 2. Build the merged Choices section

Create `components/landing/choices-section.tsx`, `id="choices"`, plain band.
Sub-blocks get small sub-eyebrows (uppercase tertiary labels, as used in the
Soulbound card lists), not full `SectionHeading`s.

- **Sub-block A, "Who can mint"**: the three route cards from
  `distribution-section.tsx:19-50`, reduced. Drop the `bestFor` field entirely
  (UseCases carries scenario guidance). Keep `icon`, `title`, `who`, trimmed
  `body` (one or two sentences), the `window` badge, and `watchFor`. The Codes
  card keeps the honest "one code cannot serve a crowd" caveat and the
  `SIGNATURE_WINDOW_DAYS` window badge.
- **Sub-block B, "Bound or transferable"**: the two option cards from
  `soulbound-section.tsx:16-37`, reduced. Drop the standalone summary
  paragraph; keep the side-by-side "What you get" / "What you give up" bullet
  pairs (two bullets each) and fold each `choose` line into one sentence under
  the bullets. The setting is made once at registration, which the lead states.
- **Sub-block C, "The clock"**: the extracted `LifecycleTimeline` with the
  static data, full width, wrapped in a single `Reveal`.
- Section lead states the shared claim-record fact once: all routes share one
  record of who has claimed, so nobody mints twice.

Delete `distribution-section.tsx`, `soulbound-section.tsx`,
`lifecycle-section.tsx` after their content is migrated.

### 3. Delete FactsStrip

Delete `components/landing/facts-strip.tsx` and its import and render in
`landing-page.tsx`. Every fact already has a home:

- "1 badge per wallet": WhatItIs small card (kept in task 4).
- "3 ways to hand it out": Choices sub-block A.
- "30 days of creator control" and "37 days of door codes": Choices sub-block C.
- "101 wallets per batch": Choices sub-block C, day-30 body.

This reverses an earlier decision recorded in `docs/progress.md` (the strip
existed so the first thing after the headline is concrete). Log the correction
in progress.md with this reasoning: every number in the strip appears again
within two screens, so the strip repeated the page rather than anchoring it.

### 4. Trim WhatItIs

Edit `what-it-is-section.tsx`:

- Keep the large onchain-storage card, its three-cell grid, and the
  contract/network/ERC-1155 dl unchanged. It stays the single on-page source of
  the contract address.
- Reduce small cards from four to two: keep "One badge per wallet" and
  "Checkable from outside this app". Drop "Event number is token number"
  (gallery tiles show `#N`, Create step 04's note keeps the event-number fact)
  and "Name and picture, then whatever else you have" (Create step 01 body and
  the CTA fact strip both state the required minimum).
- The right-hand stack (`md:col-span-2`) now holds the two surviving small
  cards, which fits the existing grid without structural change.

### 5. Trim Create

Edit `create-section.tsx`, keeping the four steps:

- Step 01: keep the 128-byte and required-field facts, trim the note to one
  sentence (quotes and backslashes are rejected because they corrupt the badge
  permanently).
- Step 02: keep the ~100 KB guidance and browser-side optimization, one
  sentence body, one sentence note.
- Step 03: keep the plain-language choices sentence. Remove the 30-day freeze
  note (the timeline in Choices owns it, stated once with its warning box).
- Step 04: shorten the body to one sentence pointing forward (the badge exists
  when the transaction confirms; how it reaches wallets is the next decision).
  Keep the event-number note.

### 6. Merge Verify + Integrations + Farcaster into "Open by Design"

Edit `verify-section.tsx` in place, keep `id="verify"`, muted band:

- Keep the metadata JSON sample card and the "Checking a holder" 3-step card in
  their current `lg:grid-cols-5` arrangement (3 + 2).
- Delete the "No middle layer" card. Fold its unique facts into the section
  lead, which already says nothing is stored here: add that the app runs no
  database and no indexer, and a clean clone needs one network URL.
- Below the two cards, add a compact integration row: the four items from
  `integrations-section.tsx:15-40` as small tiles (icon, `Badge` tag, title,
  one-line body), `sm:grid-cols-2 lg:grid-cols-4`. Lighter than full Cards, so
  the section reads as a proof section with a footer of surfaces, not another
  card grid.
- Farcaster: the integration card body (lines 19-20) already covers
  already-connected wallets, minting in the feed, and casting a fresh badge
  back out. No content moves over. Delete `farcaster-section.tsx` and
  `integrations-section.tsx`.

### 7. Trim UseCases

Edit `use-cases-section.tsx`: merge the two "Open link, transferable" cases
(Meetups and Streams) into one card for online events and talks. Three cards:
Conferences (codes, bound), Courses and cohorts (invitation list, bound),
Online events (open link, transferable). Change the grid to
`sm:grid-cols-2 lg:grid-cols-3`. Keep each body to the existing two-sentence
reasoning, since this section is now the only scenario guidance (the route
cards lost `bestFor`). Adjust the lead so it no longer promises four
combinations.

### 8. Trim FAQ

Edit `faq-section.tsx`: ten entries become five in a single `Accordion`,
one column, `max-w-3xl`, centered heading. Keep:

1. "What does it cost to create a badge?" (cost is stated nowhere else)
2. "How large can the artwork be?" (practical constraint)
3. "Can I change the details after registering?" (permanence objection)
4. "Do I need a wallet just to look around?" (lowers the barrier to entry)
5. "What if Tessera disappears?" (the trust objection, MIT and self-hosting)

Remove the other five. Each restates a section: invitation-list limits
(Choices route card caveat plus the clock), door codes serving a room (Choices
route card caveat), batch sends (timeline day-30 body), double minting
(WhatItIs card plus the Choices lead), and the network question (WhatItIs dl,
CTA, and the integration row). Remove the now-unused `lib/poap-data` imports.

### 9. Recompose the page and retarget anchors

Edit `components/landing/landing-page.tsx`:

- New render order: `WhatItIsSection`, `CreateSection`, `ChoicesSection`,
  `GallerySection`, `UseCasesSection`, `VerifySection`, `FaqSection`,
  `CtaSection`. Update imports, delete the six dead ones, and rewrite the doc
  comment to the new reading argument.
- Renumber `Reveal` indexes where lists shrank (WhatItIs, UseCases, FAQ).

Edit `site-footer.tsx` Learn column: `Documentation` (`/docs`), `How badges get
handed out` (`#choices`), `Questions` (`#faq`). Drop the separate Deadlines
link, since the clock lives inside `#choices`. The two `#distribution` and
`#lifecycle` hrefs (lines 27-28) go away with it.

Anchors after the change: `#what-it-is`, `#create`, `#choices`, `#gallery`,
`#use-cases`, `#verify`, `#faq`, `#start`. Nothing else in the repo references
the removed anchors (`#distribution`, `#soulbound`, `#lifecycle`,
`#integrations`, `#farcaster`); verify with a grep before finishing.

### 10. Update docs/progress.md

Before reporting done (instruction 13):

- Update the Current state, What runs, and Files sections to the new section
  list and file set.
- Add a Log entry, newest first, recording: the consolidation and its reading
  argument; the facts strip removal reversing the earlier decision, with the
  reason; the timeline extraction to `components/lifecycle-timeline.tsx`, which
  supersedes the note in the Next section pointing at
  `components/landing/lifecycle-section.tsx` (update that note too); the
  Farcaster section folding into the integration row; the FAQ halving with the
  keep/removed reasoning.
- Keep the entry free of em dashes and phase language.

## File operations summary

- Create: `components/landing/choices-section.tsx`,
  `components/lifecycle-timeline.tsx`
- Edit: `what-it-is-section.tsx`, `create-section.tsx`, `verify-section.tsx`,
  `use-cases-section.tsx`, `faq-section.tsx`, `site-footer.tsx`,
  `landing-page.tsx`, `docs/progress.md`
- Delete: `facts-strip.tsx`, `distribution-section.tsx`,
  `soulbound-section.tsx`, `lifecycle-section.tsx`,
  `integrations-section.tsx`, `farcaster-section.tsx`
- Untouched: the entire hero-03 block, `app/hero-03/`, `gallery-section.tsx`,
  `cta-section.tsx`, `lib/poap-data.ts` (all constants stay, they all remain
  referenced: CONTRACT_ADDRESS and CHAIN_ID in WhatItIs, CTA, and footer;
  CREATOR_TIMELOCK_DAYS, SIGNATURE_WINDOW_DAYS, and CREATOR_MINT_BATCH_LIMIT in
  Choices), `lib/` helpers, `components/ui/`, `app/layout.tsx`,
  `app/opengraph-image.tsx`

## Validation (static only, per instruction 12)

1. `npx tsc --noEmit` exits 0.
2. `npx eslint .` exits 0. Only the two pre-existing `no-img-element` warnings
   from the supplied hero block are acceptable; no new warnings, and the
   gallery's existing eslint-disable comment for its data-URL img stays.
3. Grep the repo for `facts-strip`, `distribution-section`,
   `soulbound-section`, `lifecycle-section`, `integrations-section`,
   `farcaster-section`, `#distribution`, `#lifecycle`: no remaining references
   outside `docs/progress.md` history entries.
4. Grep edited files for the em dash character: none in shipped copy.
5. `docs/progress.md` updated per task 10.

## Out of scope

- Any change to the hero block, navbar, or `/hero-03` route.
- Replacing the hero background video or the placeholder gallery data.
- Real contract reads, the dashboard, the docs site, or the Farcaster Mini App.
- Wholesale copy rewriting beyond the trims specified above.
- Committing anything; the working tree stays uncommitted unless the owner asks.
