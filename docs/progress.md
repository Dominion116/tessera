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

The contract reference is vendored and verified. The application is scaffolded
and the hero section is live, with a working theme toggle and an Open App
button. No chain code exists yet.

Nothing has been committed since the documentation commit `5649145`. Every
application file listed below is untracked.

### What runs

`/` and `/hero-03` both render the hero. There is no other route. Light and dark
themes both work and the toggle switches them.

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
app/layout.tsx                ThemeProvider, metadata, favicon
app/page.tsx                  root, renders the hero
app/hero-03/page.tsx          block path from the supplied prompt
app/globals.css               Tailwind v4 theme, shadcn neutral tokens
components/shadcn-space/blocks/hero-03/{index,hero,navbar,navlink}.tsx
components/shadcn-space/button/button-01.tsx    Open App button
components/ui/{button,dropdown-menu}.tsx        shadcn registry, unmodified
components/theme-provider.tsx
components/theme-toggle.tsx
lib/utils.ts                  cn
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
- The Open App button does not navigate anywhere. There is no dashboard yet.
- Nav links are all `href="#"`.
- No landing page sections beyond the hero.
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
`no-img-element` warnings are accepted.

---

## Log

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

- Landing page sections below the hero, in the hero's visual language.
- Documentation section. No blocking inputs, can run in parallel.
- Dashboard surface, once the dashboard block arrives.
