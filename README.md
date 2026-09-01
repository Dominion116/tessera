# Tessera

An open-source frontend for [Onchain POAPs](https://github.com/jvaleskadevs/onchain-poaps)
— create proof-of-attendance tokens, hand them out at real events, and collect
them. Runs as a website and as a Farcaster Mini App from the same codebase.

A *tessera* was the small token that admitted you to an event in Rome. It is also
the single tile in a mosaic. One token proves you were somewhere; together they
make a picture.

Every POAP lives entirely onchain. The artwork is an SVG stored in contract
bytecode, and the metadata is assembled by the contract on read. No IPFS, no
pinning service, no server that has to stay up for your token to keep working.

## What you can do

**Create a POAP.** Name it, drop in an SVG, and choose how people get it. The
artwork is optimized in your browser before it is stored, so you can see exactly
what it will cost to put onchain.

**Hand it out three ways.** Open it to the public so anyone can claim. Restrict
it to a list of addresses. Or sign individual claims for the people actually in
the room. The interface explains which method suits which kind of event, and each
one's deadline.

**Give a list of addresses, get a working allowlist.** Paste the addresses. The
app builds the cryptographic proofs, sets it up onchain, and gives you claim
links and printable QR codes for each recipient. You never have to learn what a
Merkle tree is.

**Manage what you made.** Open or close public minting, airdrop directly to
attendees, and watch the countdown on the controls that expire.

**Collect.** Your POAPs, their artwork, their metadata, and proof of ownership
you can check onchain yourself.

## Documentation

The app carries a full documentation section covering creation, metadata, SVG
requirements, soulbound tokens, public minting, allowlists and proof generation,
signature minting, QR distribution, creator permissions, every deadline, the
contract's restrictions, and how to verify a minted POAP.

Two things are worth knowing up front, because they are easy to get wrong:

- **Signatures are tied to one wallet.** A signature authorises a specific
  address to mint. One signature on a poster cannot be shared by a crowd. The
  workable approaches are per-attendee codes, a signing station you run at the
  event, or plain public minting — all three are documented, with the tradeoffs.
- **Some choices are permanent.** Public minting can only be toggled for 30 days,
  and whatever it is at that moment is what it stays. An allowlist can only be
  set once. The interface warns you before those doors close.

## Contract

| | |
|---|---|
| Network | Base Sepolia (84532) |
| Address | [`0xC3249356a483fbe17d5355D39105D2eA666d9de6`](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code) |
| Standard | ERC-1155, onchain SVG via SSTORE2 |
| Upstream | [jvaleskadevs/onchain-poaps](https://github.com/jvaleskadevs/onchain-poaps) |

The contract is not part of this project and is not modified by it. A verbatim
copy lives in [`contracts/`](./contracts) for reference — every file is
byte-identical to upstream commit `c313c856`, verified by comparing git blob
hashes. The ABI in [`contracts/abi/OnchainPOAPs.json`](./contracts/abi) was
extracted from the verified deployment.

Base mainnet is not deployed yet. When it is, the address becomes a configuration
value.

### Deadlines

Measured from the moment a POAP is registered.

| Action | Available |
|---|---|
| Public mint | always, while public minting is on |
| Allowlist mint | always, once an allowlist is set |
| Signature mint | first 37 days |
| Creator airdrop | first 30 days |
| Set the allowlist | first 30 days, once only |
| Open or close public minting | first 30 days |

## Running it locally

Requires **Node 22.11+** and npm.

```bash
git clone <your-fork-url>
cd tessera
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

You will need a wallet with Base Sepolia ETH to create or mint anything. Reading
works without one. Testnet ETH comes from any Base Sepolia faucet.

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CHAIN_ID` | no | Defaults to `84532` (Base Sepolia). |
| `NEXT_PUBLIC_POAP_ADDRESS` | no | Contract address. Defaults to the Base Sepolia deployment. |
| `NEXT_PUBLIC_RPC_URL` | recommended | Defaults to the public Base Sepolia endpoint, which is rate-limited. Point it at your own provider for real use. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | no | WalletConnect project ID, for WalletConnect-based wallets. Everything else works without it. |
| `NEXT_PUBLIC_APP_URL` | for deployment | Your canonical URL. Used for share embeds and the Mini App manifest. |

No API keys are needed for the core experience. The app reads everything it needs
straight from the contract, so there is no indexer or backend to run.

### Commands

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # lint
npm run test       # tests
```

## Deploying your own

The app is a standard Next.js project and deploys anywhere Next.js runs; it is
built and tested on Vercel.

1. Fork this repository and import it into your host.
2. Set `NEXT_PUBLIC_APP_URL` to your production URL and `NEXT_PUBLIC_RPC_URL` to
   your own RPC endpoint.
3. Deploy.

To run it as a Farcaster Mini App as well, you additionally need to serve a
manifest at `/.well-known/farcaster.json` containing an account association
signed for your exact domain. Generate that signature with the
[Farcaster manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest).

Pick your domain carefully — a Mini App is identified by its domain permanently,
and `www.example.com` counts as a different app from `example.com`.

## Project structure

```
tessera/
├── docs/          contributor documentation
├── contracts/     vendored contract reference, read-only
└── ...            the Next.js application
```

Built with Next.js, TypeScript, Tailwind, shadcn/ui, wagmi and viem. Dependency
versions are pinned in [`docs/agent.md`](./docs/agent.md), which also documents
the contract's behaviour in detail and the conventions this codebase follows.
Read it before contributing.

## Contributing

Issues and pull requests are welcome. Please read
[`docs/agent.md`](./docs/agent.md) first — it covers the contract's constraints
and the design rules, both of which matter more here than usual. A few in
particular:

- The contract is never modified. Nothing under `contracts/` changes.
- Text that goes into POAP metadata cannot contain `"` or `\`, because the
  contract interpolates it into JSON without escaping. Corrupted metadata is
  permanent.
- Length limits are byte lengths, not character counts.
- Anything that touches allowlist proofs or signature construction needs a test.
  These fail silently and cost users real gas.

## Licence

MIT. See [LICENSE](./LICENSE).

The contract in `contracts/` is MIT licensed by its author, J. Valeska.

## Credits

Contract and protocol by [J. Valeska](https://github.com/jvaleskadevs).
[POAP.xyz](https://poap.xyz) for the original idea. Solady for SSTORE2.
OpenZeppelin for the contract libraries.
