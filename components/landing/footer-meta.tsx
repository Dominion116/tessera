import Link from "next/link";
import { BookOpen, CodeXml, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/lib/poap-data";

const BASESCAN_URL = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;
const REPO_URL = "https://github.com/jvaleskadevs/onchain-poaps";

const PILL_CLASSES =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-teal-50/90 transition-colors duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none";

const FooterMeta = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-24 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-32 lg:px-8 xl:px-16">
      <p className="text-sm text-teal-100/60">
        MIT licensed. Open source, and deployable by anyone.
      </p>
      <ul className="flex flex-wrap items-center gap-3">
        <li>
          <a
            href={BASESCAN_URL}
            target="_blank"
            rel="noreferrer"
            className={PILL_CLASSES}
          >
            Contract on BaseScan
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </li>
        <li>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className={PILL_CLASSES}
          >
            Contract source
            <CodeXml size={13} aria-hidden="true" />
          </a>
        </li>
        <li>
          <Link href="/docs" className={PILL_CLASSES}>
            Docs
            <BookOpen size={13} aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterMeta;
