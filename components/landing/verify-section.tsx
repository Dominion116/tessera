import { Braces, Cpu, ShieldCheck } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";

const METADATA_SAMPLE = `{
  "name": "Base Sepolia Builders Night",
  "description": "Twelve teams shipped a contract...",
  "image": "data:image/svg+xml;base64,PHN2Zy...",
  "attributes": [
    { "trait_type": "Event", "value": "Base Sepolia Builders Night" },
    { "trait_type": "Location", "value": "Lisbon" },
    { "trait_type": "Date", "display_type": "date", "value": "1770854400" },
    { "trait_type": "EventId", "value": "41" },
    { "trait_type": "Creator", "value": "0x1f4b...7a6b" },
    { "trait_type": "Soulbound", "value": "true" }
  ],
  "external_url": "https://base.org"
}`;

const CHECK_STEPS = [
  "Ask the contract whether that wallet holds the event number.",
  "Read the mint transaction and the block it landed in.",
  "Compare against the event details, which cannot have changed since registration.",
];

const VerifySection = () => {
  return (
    <Section id="verify" muted>
      <SectionHeading
        eyebrow="Proof"
        title="Anyone can check a badge without taking your word for it"
        lead="The details below come straight out of the contract. Nothing is stored here, so the same answer arrives whether you ask Tessera, a block explorer, or your own script."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal index={0} className="h-full min-w-0 lg:col-span-2">
          <FeatureCard
            icon={Braces}
            title="What a badge says about itself"
            className="min-w-0"
          >
            <p className="text-base leading-7 text-fg-secondary">
              One contract call returns this document, artwork included. No gateway,
              no pinning service, no account.
            </p>
            <pre className="min-w-0 overflow-x-auto rounded-lg border border-border/70 bg-background/70 p-4 text-sm leading-6">
              <code className="font-mono">{METADATA_SAMPLE}</code>
            </pre>
          </FeatureCard>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal index={1} className="flex-1">
            <FeatureCard icon={ShieldCheck} title="Checking a holder">
              <ol className="flex flex-col gap-3 text-base leading-7 text-fg-secondary">
                {CHECK_STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </FeatureCard>
          </Reveal>
          <Reveal index={2} className="flex-1">
            <FeatureCard icon={Cpu} title="No middle layer">
              <p className="text-base leading-7 text-fg-secondary">
                Tessera runs no database and no indexer. Reads are batched into a
                single call per page, which is also why a clean clone of this app
                needs one network URL and nothing else.
              </p>
            </FeatureCard>
          </Reveal>
        </div>
      </div>

      <SectionFooter note="A holder can prove their mint from a block explorer alone, with Tessera closed" />
    </Section>
  );
};

export default VerifySection;
