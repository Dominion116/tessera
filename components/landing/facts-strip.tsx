import Reveal from "@/components/landing/reveal";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

const FACTS = [
  {
    value: "1",
    unit: "badge per wallet",
    body: "Shared across every way of minting, so nobody claims twice.",
  },
  {
    value: "3",
    unit: "ways to hand it out",
    body: "An open link, an invitation list, or codes at the door.",
  },
  {
    value: String(CREATOR_TIMELOCK_DAYS),
    unit: "days of creator control",
    body: "After that your settings are frozen for good.",
  },
  {
    value: String(SIGNATURE_WINDOW_DAYS),
    unit: "days of door codes",
    body: "The window for approving wallets at the venue.",
  },
  {
    value: String(CREATOR_MINT_BATCH_LIMIT),
    unit: "wallets per batch",
    body: "The most you can send badges to in one transaction.",
  },
];

/**
 * Contract facts, sitting directly under the hero so the first thing after the
 * headline is a concrete number rather than another claim.
 */
const FactsStrip = () => {
  return (
    <section
      aria-label="How Tessera works, in numbers"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 xl:px-16">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.unit} index={i} className="flex flex-col gap-1">
              <dt className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tabular-nums text-teal-600 sm:text-4xl dark:text-teal-300">
                  {fact.value}
                </span>
                <span className="text-sm font-medium">{fact.unit}</span>
              </dt>
              <dd className="text-xs leading-5 text-fg-tertiary">{fact.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FactsStrip;
