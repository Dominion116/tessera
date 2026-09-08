import type { ReactNode } from "react";
import { CHAIN_ID, CONTRACT_ADDRESS, CREATOR_MINT_BATCH_LIMIT, CREATOR_TIMELOCK_DAYS, SIGNATURE_WINDOW_DAYS } from "@/lib/poap-data";

export type DocSection = {
  title: string;
  content: ReactNode;
};

export type DocPage = {
  slug: string;
  section: string;
  title: string;
  description: string;
  sections: DocSection[];
};

export const DOCS_NAV = [
  { slug: "", label: "Overview" },
  { slug: "getting-started", label: "Getting started" },
  { slug: "creating", label: "Creating a POAP" },
  { slug: "distribution", label: "Distribution methods" },
  { slug: "deadlines", label: "Deadlines and permissions" },
  { slug: "contract", label: "Contract reference" },
  { slug: "verification", label: "Verification" },
  { slug: "architecture", label: "Application architecture" },
] as const;

const Code = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-lg border border-border/70 bg-background/70 p-4 font-mono text-xs leading-6 text-fg-secondary">
    <code>{children}</code>
  </pre>
);

const InlineCode = ({ children }: { children: string }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
    {children}
  </code>
);

const docs: DocPage[] = [
  {
    slug: "",
    section: "Start here",
    title: "Onchain POAPs with Tessera",
    description:
      "A technical guide to creating, distributing, collecting and verifying proof-of-attendance tokens backed by the OnchainPOAPs contract on Base Sepolia.",
    sections: [
      {
        title: "What Tessera does",
        content: (
          <>
            <p>
              Tessera is a Next.js App Router frontend for onchain proof-of-attendance tokens. A creator registers an event with an SVG image and metadata, chooses how attendees may mint, and then shares the resulting event through a public link, an address list or recipient-specific signatures. The contract stores the artwork and assembles the metadata on read, so the token does not depend on IPFS, a pinning service or a Tessera server.
            </p>
            <p>
              The public site can be read without a wallet. Creator controls and collection views sit behind the dashboard gate because those actions identify a wallet and, once chain wiring is enabled, may submit transactions.
            </p>
          </>
        ),
      },
      {
        title: "Reading this documentation",
        content: (
          <>
            <p>
              Start with the getting-started article if you are evaluating the product or running the frontend locally. Use Creating a POAP for registration inputs, Distribution methods for attendee flows, and Deadlines and permissions before changing a live event. Contract reference and Verification contain the exact data formats required by developers integrating directly with the contract.
            </p>
            <p>
              The sidebar is the primary section index. Each article also exposes a breadcrumb and previous or next navigation at the bottom, so the sequence can be followed without returning to this page.
            </p>
          </>
        ),
      },
      {
        title: "Network and contract",
        content: (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-background/50 p-4"><p className="text-xs text-fg-tertiary">Network</p><p className="mt-1 font-medium">Base Sepolia</p><p className="mt-1 font-mono text-xs text-fg-secondary">Chain {CHAIN_ID}</p></div>
            <div className="rounded-lg border border-border/70 bg-background/50 p-4"><p className="text-xs text-fg-tertiary">Standard</p><p className="mt-1 font-medium">ERC-1155</p><p className="mt-1 text-xs text-fg-secondary">Event ID equals token ID</p></div>
            <div className="rounded-lg border border-border/70 bg-background/50 p-4"><p className="text-xs text-fg-tertiary">Address</p><p className="mt-1 break-all font-mono text-xs text-fg-secondary">{CONTRACT_ADDRESS}</p></div>
          </div>
        ),
      },
    ],
  },
  {
    slug: "getting-started",
    section: "Start here",
    title: "Getting started",
    description: "Run the frontend, understand the available routes, and identify which parts currently use contract-shaped placeholder data.",
    sections: [
      {
        title: "Local setup",
        content: (
          <>
            <p>The repository requires Node 22.11 or newer and npm. Install the pinned dependencies, create the local environment file, and run the standard Next.js development command from the repository root.</p>
            <Code>{`git clone <your-fork-url>\ncd tessera\nnpm install\ncp .env.example .env.local\nnpm run dev`}</Code>
            <p>The application opens at <InlineCode>http://localhost:3000</InlineCode>. The landing page and readable placeholder surfaces do not require API keys. Base Sepolia RPC configuration becomes relevant when live contract reads and writes are enabled.</p>
          </>
        ),
      },
      {
        title: "Environment variables",
        content: (
          <p>
            <InlineCode>NEXT_PUBLIC_APP_URL</InlineCode> defines the canonical origin used by metadata and future Mini App embeds. <InlineCode>NEXT_PUBLIC_RPC_URL</InlineCode> overrides the public Base Sepolia endpoint for chain access. <InlineCode>NEXT_PUBLIC_CHAIN_ID</InlineCode> and <InlineCode>NEXT_PUBLIC_POAP_ADDRESS</InlineCode> default to the values in the contract reference. <InlineCode>NEXT_PUBLIC_WC_PROJECT_ID</InlineCode> is reserved for WalletConnect-based connection flows and is not required by the readable experience.
          </p>
        ),
      },
      {
        title: "Routes and data status",
        content: (
          <>
            <p>The landing page is available at <InlineCode>/</InlineCode>, the dashboard gate at <InlineCode>/app</InlineCode>, and the standalone supplied block demonstrations remain available at <InlineCode>/hero-03</InlineCode>, <InlineCode>/cta-01</InlineCode> and <InlineCode>/feature-02</InlineCode>. The dashboard currently renders a session-only mock wallet and contract-shaped data from <InlineCode>lib/dashboard-data.ts</InlineCode>. Its component interfaces are deliberately shaped for later replacement by Base Sepolia reads.</p>
            <p>The navigation already uses the final destinations for Explore, collection, creator management and documentation. A route should not be treated as a contract capability until its page and chain source are implemented together.</p>
          </>
        ),
      },
      {
        title: "Static checks",
        content: (
          <p>Use <InlineCode>npm run typecheck</InlineCode> for TypeScript import and type validation and <InlineCode>npm run lint</InlineCode> for the repository lint rules. Local builds and preview servers are intentionally not part of the contributor verification loop described in the repository operating manual.</p>
        ),
      },
    ],
  },
  {
    slug: "creating",
    section: "Creator workflows",
    title: "Creating a POAP",
    description: "Registration inputs, onchain artwork constraints, metadata safety rules, and the irreversible decisions made at registration.",
    sections: [
      {
        title: "Registration inputs",
        content: (
          <p>The contract function is <InlineCode>registerEvent(name, description, eventDate, location, allowlistRoot, svgImage, externalUrl, flags)</InlineCode>. The name is required and may contain at most 128 UTF-8 bytes. The description may contain 512 bytes, while location and external URL may each contain 128 bytes. The event date is a Unix timestamp and may be zero. An empty location or date is valid and should be represented explicitly in the interface rather than invented.</p>
        ),
      },
      {
        title: "Artwork and metadata safety",
        content: (
          <>
            <p>The artwork must be a non-empty raw SVG. Tessera should optimize it in the browser, show the original and optimized byte counts, and warn as the projected storage size approaches the practical limit near 100 KB. Base64 encoding increases the stored representation by roughly one third, and SSTORE2 writes the result into contract bytecode.</p>
            <p>The contract interpolates name, description, location and external URL directly into JSON without escaping. Reject quotation marks, backslashes, control characters and newlines before a transaction is prepared. Count bytes with <InlineCode>TextEncoder</InlineCode>, not JavaScript string length, because accented characters and emoji consume more than one byte.</p>
          </>
        ),
      },
      {
        title: "Flags and permanence",
        content: (
          <>
            <p>The two-bit <InlineCode>flags</InlineCode> value controls soulbound and public behavior. Value 0 means transferable and private, 1 means soulbound and private, 2 means transferable and public, and 3 means soulbound and public. The public state can be toggled only during the first {CREATOR_TIMELOCK_DAYS} days after registration, and the state at the boundary remains permanent. Soulbound status is fixed at registration and prevents transfers while still allowing minting and burning.</p>
            <p>An allowlist root supplied during registration cannot be replaced. Registering with a zero root preserves the one-time opportunity to set a root during the creator window. This choice belongs beside the registration control, not in an advanced settings page where its consequence could be missed.</p>
          </>
        ),
      },
    ],
  },
  {
    slug: "distribution",
    section: "Creator workflows",
    title: "Distribution methods",
    description: "Choose the minting route that matches the event, and understand eligibility before presenting an attendee with a mint action.",
    sections: [
      {
        title: "Public mint",
        content: <p><strong>Public mint</strong> is the simplest route for an open event. When <InlineCode>isPublic</InlineCode> is true, any wallet can call <InlineCode>mint(eventId)</InlineCode>. Public minting has no end date, but its on or off state can only be changed during the first {CREATOR_TIMELOCK_DAYS} days. A creator who leaves it off at the freeze cannot open it later.</p>,
      },
      {
        title: "Allowlist mint",
        content: <p><strong>Allowlist mint</strong> restricts eligibility to addresses represented by the event&apos;s non-zero root. The attendee submits <InlineCode>allowlistMint(eventId, merkleProof)</InlineCode>. The root can be set once during the creator window if it was zero at registration, and the resulting route has no time limit. The creator-facing interface should describe this as an invitation list; the proof construction belongs behind an advanced explanation.</p>,
      },
      {
        title: "Signature mint",
        content: <p><strong>Signature mint</strong> uses <InlineCode>mintWithSignature(eventId, signature)</InlineCode> during the first {SIGNATURE_WINDOW_DAYS} days. The signed digest includes the event ID, chain ID and recipient address, so a signature is valid for one wallet only. A shared QR code containing one signature cannot authorize a crowd. Practical options are pre-signed per-recipient claim links, a creator-operated signing service that signs for the connected attendee, or public minting when individual authorization is unnecessary.</p>,
      },
      {
        title: "Creator airdrop",
        content: <p><strong>Creator airdrop</strong> calls <InlineCode>creatorMint(eventId, recipients)</InlineCode> during the first {CREATOR_TIMELOCK_DAYS} days and is limited to {CREATOR_MINT_BATCH_LIMIT} recipients per call. Already-claimed recipients are skipped rather than causing the entire transaction to revert, so the interface must report per-address outcomes after the receipt instead of claiming that every address was minted.</p>,
      },
      {
        title: "One claim across every route",
        content: <p>All four routes share the contract&apos;s <InlineCode>hasClaimed</InlineCode> record. Check it before showing a mint action. A wallet that used a public, allowlist, signature or creator route cannot claim the same event through another route.</p>,
      },
    ],
  },
  {
    slug: "deadlines",
    section: "Protocol rules",
    title: "Deadlines and permissions",
    description: "Every timing rule is measured from registration, not from the event date shown to attendees.",
    sections: [
      {
        title: "Deadline matrix",
        content: (
          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full text-left text-sm"><thead className="border-b border-border/70 text-xs text-fg-tertiary"><tr><th className="px-4 py-3 font-medium">Action</th><th className="px-4 py-3 font-medium">Window</th><th className="px-4 py-3 font-medium">Condition</th></tr></thead><tbody className="divide-y divide-border/60"><tr><td className="px-4 py-3">Public mint</td><td className="px-4 py-3">Unlimited</td><td className="px-4 py-3">Public state is on</td></tr><tr><td className="px-4 py-3">Allowlist mint</td><td className="px-4 py-3">Unlimited</td><td className="px-4 py-3">Non-zero root and valid proof</td></tr><tr><td className="px-4 py-3">Signature mint</td><td className="px-4 py-3">{SIGNATURE_WINDOW_DAYS} days</td><td className="px-4 py-3">Signature recovers to recipient and creator</td></tr><tr><td className="px-4 py-3">Creator controls</td><td className="px-4 py-3">{CREATOR_TIMELOCK_DAYS} days</td><td className="px-4 py-3">Creator only</td></tr></tbody></table>
          </div>
        ),
      },
      {
        title: "Boundary behavior",
        content: <p>The creator timelock uses the contract&apos;s timestamp comparison, making the exact boundary inclusive. The control expires only once <InlineCode>{`createdAt + ${CREATOR_TIMELOCK_DAYS} days + extraTime`}</InlineCode> is earlier than the current block timestamp. Signature minting uses an extra seven-day allowance, producing a {SIGNATURE_WINDOW_DAYS}-day window. Frontend countdowns should derive from <InlineCode>createdAt</InlineCode> and should explain the action that will stop, rather than presenting a bare number.</p>,
      },
      {
        title: "Permission errors",
        content: <p>Map <InlineCode>POAP__OnlyCreator</InlineCode> to a sentence that the connected wallet is not the event creator. Map <InlineCode>POAP__TimeLockExpired</InlineCode> to the specific control that has closed. Map <InlineCode>POAP__AlreadyClaimed</InlineCode> to an ownership message. A disabled control must state its reason beside the control; an error should also identify the next valid route when one exists.</p>,
      },
    ],
  },
  {
    slug: "contract",
    section: "Protocol rules",
    title: "Contract reference",
    description: "The data model and function surface required to integrate Tessera with the verified OnchainPOAPs deployment.",
    sections: [
      {
        title: "Event identity",
        content: <p>The contract is an ERC-1155 where event ID and token ID are the same value. IDs are sequential, beginning with the genesis event at zero. <InlineCode>totalEvents()</InlineCode> returns the highest valid ID, so a reader must validate an ID before calling <InlineCode>uri(id)</InlineCode>. An unminted but registered event still has readable metadata; an ID above the total reverts.</p>,
      },
      {
        title: "Read surface",
        content: <Code>{`events(id)\n  name, description, eventDate, location\n  allowlistRoot, svgImage, creator, createdAt\n  externalUrl, isSoulbound, isPublic\n\nhasClaimed(id, account)\ntotalEvents()\ntotalSupply(id)\ntotalSupply()\nbalanceOf(account, id)\nbalanceOfBatch(accounts, ids)\nuri(id)\ngetMultichainEventId(id)`}</Code>,
      },
      {
        title: "Write surface",
        content: <Code>{`registerEvent(name, description, eventDate, location,\n              allowlistRoot, svgImage, externalUrl, flags)\nmint(eventId)\nallowlistMint(eventId, merkleProof)\nmintWithSignature(eventId, signature)\ncreatorMint(eventId, recipients)\nupdateAllowlistRoot(eventId, newRoot)\nupdateEventPublic(eventId, isPublic)`}</Code>,
      },
      {
        title: "Artwork pointer warning",
        content: <p>The <InlineCode>svgImage</InlineCode> field returned by <InlineCode>events(id)</InlineCode> is an SSTORE2 pointer address. It is not an image URL and must never be passed to an image element. The embedded SVG is reached through the base64 JSON returned by <InlineCode>uri(id)</InlineCode>.</p>,
      },
      {
        title: "Deployment",
        content: <p>The configured reference deployment is {CONTRACT_ADDRESS} on Base Sepolia, chain {CHAIN_ID}. The ABI is vendored at <InlineCode>contracts/abi/OnchainPOAPs.json</InlineCode>. The Solidity sources under <InlineCode>contracts/</InlineCode> are a read-only upstream reference and must not be modified by frontend work.</p>,
      },
    ],
  },
  {
    slug: "verification",
    section: "Protocol rules",
    title: "Verification and proof formats",
    description: "Verify artwork, metadata, ownership and eligibility using the same inputs the contract evaluates.",
    sections: [
      {
        title: "Allowlist leaf construction",
        content: <p>The allowlist leaf is a single hash of the raw address encoding: <InlineCode>keccak256(abi.encodePacked(msg.sender))</InlineCode>. This is not OpenZeppelin&apos;s StandardMerkleTree double-hash format. A compatible client must construct pre-hashed leaves, sort sibling pairs as the contract&apos;s MerkleProof verifier expects, and test the generated root and proof against the contract scheme before presenting a transaction.</p>,
      },
      {
        title: "Reference implementation shape",
        content: <Code>{`const leaf = keccak256(encodePacked(["address"], [recipient]))\nconst proof = tree.getProof(leaf)\nconst root = tree.root\n\n// The recipient submits the proof from the same address.\nwriteContract({\n  functionName: "allowlistMint",\n  args: [eventId, proof],\n})`}</Code>,
      },
      {
        title: "Signature digest",
        content: <p>Signature authorization covers the event ID, chain ID and recipient address. The contract applies the Ethereum signed-message prefix and recovers the creator address. A verifier must use the same integer widths and packed encoding as the contract. Because the recipient is part of the digest, copying a signature between wallets must fail and should be explained as an expected security property.</p>,
      },
      {
        title: "Ownership verification",
        content: <p>To verify a collected POAP, read <InlineCode>balanceOf(account, eventId)</InlineCode> or the corresponding batch result and require a positive balance. Pair that result with <InlineCode>totalSupply(eventId)</InlineCode>, the event metadata from <InlineCode>uri(eventId)</InlineCode>, and a block explorer transaction link. For a soulbound token, omit transfer controls entirely because transfer attempts revert with <InlineCode>POAP__SoulboundNotTransferable</InlineCode>.</p>,
      },
    ],
  },
  {
    slug: "architecture",
    section: "Implementation",
    title: "Application architecture",
    description: "How the current Next.js frontend separates presentation, placeholder data, wallet state and future chain integration.",
    sections: [
      {
        title: "Route composition",
        content: <p>The App Router owns route entry points. The landing composition lives under <InlineCode>components/landing</InlineCode>. The dashboard entry at <InlineCode>app/app/page.tsx</InlineCode> renders <InlineCode>AppGate</InlineCode>, which chooses the full-page connection prompt or the dashboard shell. The shell owns responsive navigation, while <InlineCode>DashboardPage</InlineCode> composes the unchanged 12-column dashboard structure.</p>,
      },
      {
        title: "Wallet seam",
        content: <p><InlineCode>components/wallet/wallet-provider.tsx</InlineCode> exposes <InlineCode>address</InlineCode>, <InlineCode>connect()</InlineCode> and <InlineCode>disconnect()</InlineCode> through React context. The current implementation stores one placeholder address in memory and does not sign or broadcast. The provider is mounted inside the theme provider in <InlineCode>app/layout.tsx</InlineCode>, so replacing its internals with the planned wallet client does not require dashboard components to know which connector is active.</p>,
      },
      {
        title: "Data seam",
        content: <p><InlineCode>lib/poap-data.ts</InlineCode> models contract event responses, including bigint timestamps and the distinction between an SSTORE2 pointer and rendered artwork. <InlineCode>lib/dashboard-data.ts</InlineCode> reuses that type for creator events, mint series and route mix data. Future chain hooks should replace these sources while preserving component-facing fields and the edge cases already represented in the UI.</p>,
      },
      {
        title: "Visual and motion system",
        content: <p>Tailwind v4 theme variables define the foreground hierarchy, card surfaces, chart colors and sidebar tokens in <InlineCode>app/globals.css</InlineCode>. Shared landing reveals and dashboard entrance effects animate opacity and small transforms only. Press feedback, focus-visible rings and the global reduced-motion rule are part of the interaction contract. New pages should use existing tokens and primitives instead of creating a second card, spacing or motion vocabulary.</p>,
      },
      {
        title: "Chain integration boundary",
        content: <p>Live integration belongs below the presentation layer. It must import the vendored ABI, target Base Sepolia, batch list reads through Multicall3, decode the base64 metadata returned by <InlineCode>uri()</InlineCode>, and map every custom error to a human sentence. Core reads must not depend on an indexer or API key, and log-derived features must chunk public RPC block ranges because wide log requests can be rejected.</p>,
      },
    ],
  },
];

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((page) => page.slug === slug);
}

export function getDocIndex(slug: string): number {
  return DOCS_NAV.findIndex((item) => item.slug === slug);
}
