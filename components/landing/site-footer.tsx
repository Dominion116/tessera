import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Wordmark from "@/components/landing/wordmark";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { shortAddress } from "@/lib/format";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "All POAPs", href: "/poaps" },
      { label: "My collection", href: "/app/collection" },
      { label: "Dashboard", href: "/app" },
    ],
  },
  {
    heading: "Create",
    links: [
      { label: "Register an event", href: "/app/create" },
      { label: "POAPs I created", href: "/app/created" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Handing out badges", href: "#distribution" },
      { label: "Deadlines", href: "#lifecycle" },
      { label: "Questions", href: "#faq" },
    ],
  },
];

const BASESCAN_URL = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;
const REPO_URL = "https://github.com/jvaleskadevs/onchain-poaps";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-4">
            <Wordmark className="text-foreground" />
            <p className="max-w-sm text-sm leading-6 text-fg-secondary">
              Proof you were there, stored entirely onchain. Create a POAP, hand it
              out at your event, keep it forever.
            </p>
            <dl className="flex flex-col gap-1 pt-2 text-xs">
              <div className="flex gap-2">
                <dt className="text-fg-tertiary">Contract</dt>
                <dd className="font-mono tabular-nums select-all">
                  {shortAddress(CONTRACT_ADDRESS)}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-fg-tertiary">Network</dt>
                <dd className="tabular-nums">Base, chain {CHAIN_ID}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <p className="text-xs font-medium tracking-wide text-fg-tertiary uppercase">
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-fg-secondary transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-tertiary">
            MIT licensed. Open source, and deployable by anyone.
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            <li>
              <a
                href={BASESCAN_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-fg-secondary transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                Contract on BaseScan
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-fg-secondary transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                Contract source
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/docs"
                className="text-xs text-fg-secondary transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                Docs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

