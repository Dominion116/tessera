# Farcaster Miniapp

Tessera runs as a Farcaster Miniapp and as a standalone website from the same
route tree. There is no second layout, no FID account system and no automatic
wallet connection.

## Architecture

- `lib/farcaster/config.ts` — canonical origin, asset paths, required chains and
  capabilities. Every URL is derived from one origin with no trailing slash.
- `lib/farcaster/runtime.ts` — host detection, one-shot `ready()`, back
  navigation and wallet-transport selection. Pure and unit-tested; no-ops on the
  standalone website.
- `lib/farcaster/manifest.ts` — builds `/.well-known/farcaster.json`.
- `lib/farcaster/embeds.ts` — builds the `fc:miniapp` and `fc:frame` payloads.
- `components/farcaster/farcaster-provider.tsx` — mounts host context near the
  root providers. It never opens a wallet and never changes the route.
- `components/farcaster/share-cast-button.tsx` — an explicit share action with a
  copy-link fallback.
- `components/wallet/wallet-provider.tsx` — selects the native Farcaster
  connector only from an explicit action inside a confirmed host; AppKit remains
  the fallback.

## Invariants

- Wallet-only authorization. Farcaster context never grants creator or mint
  permissions.
- No reconnect on mount, no modal or native wallet request during page load.
- No notification permission, no Sign in with Farcaster, no server session.
- The existing mobile surface is frozen: no dock, menu, spacing or CTA changes.
- Contract writes keep the `chainId` pin to Base Sepolia (`84532`).

## Routes and assets

| Path | Purpose |
| --- | --- |
| `/.well-known/farcaster.json` | Manifest (JSON, cacheable) |
| `/miniapp-assets/icon` | 512×512 PNG icon |
| `/miniapp-assets/splash` | 1200×800 PNG splash |
| `/miniapp-assets/hero` | 1200×800 PNG hero / OG |
| `/poaps/[id]/opengraph-image` | Event share card (PNG, 3:2) |
| `/poaps/[id]/claim/opengraph-image` | Claim share card (PNG, 3:2) |

## Environment

Production (Vercel):

```
NEXT_PUBLIC_APP_URL=https://tesserapoap.vercel.app
NEXT_PUBLIC_RPC_URL=<reliable Base Sepolia RPC>
NEXT_PUBLIC_WC_PROJECT_ID=<Reown project id>
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_POAP_ADDRESS=0xC3249356a483fbe17d5355D39105D2eA666d9de6
FARCASTER_ACCOUNT_ASSOCIATION_HEADER=<public>
FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD=<public>
FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE=<public>
```

The account association is domain-bound. Do not switch between apex and `www`,
and do not use a preview URL as the permanent identity.

## Release order

1. Deploy the normal application build to a Vercel preview.
2. Verify routes, PNG routes, cache headers and that there are no hydration
   errors.
3. Promote or deploy to `tesserapoap.vercel.app`.
4. Generate the account association for that exact origin.
5. Set the association variables, publish the manifest and redeploy.
6. Verify `/.well-known/farcaster.json` from an external request.
7. Validate the Miniapp in Farcaster discovery/preview tooling.
8. Validate embed metadata with the embed debugger.
9. Test explicit wallet actions and real Base Sepolia transactions in a client.

## Rollback

Roll back the Vercel deployment if manifest, splash, wallet or transaction
behavior breaks. Do not change the domain during rollback: the account
association is bound to it. Association values live in Vercel environment
variables and can be reverted independently of the code.
