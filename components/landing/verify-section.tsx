import { Braces, Cpu, ShieldCheck } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const VerifySection = () => {
  return (
    <Section id="verify" muted>
      <SectionHeading
        eyebrow="Proof"
        title="Anyone can check a badge without taking your word for it."
        lead="The details below come straight out of the contract. Nothing is stored here, so the same answer arrives whether you ask Tessera, a block explorer, or your own script."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="min-w-0 lg:col-span-3" index={0}>
          <Card className="h-full min-w-0 gap-4 border-border/70 bg-card/60 tile-grout">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                <Braces size={18} aria-hidden="true" />
              </span>
              <CardTitle className="pt-4 text-lg font-semibold">
                What a badge says about itself
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-6 text-fg-secondary">
                One contract call returns this document, artwork included. No
                gateway, no pinning service, no account.
              </p>
              <pre className="min-w-0 overflow-x-auto rounded-lg border border-border/70 bg-background/70 p-4 text-xs leading-5">
                <code className="font-mono">{METADATA_SAMPLE}</code>
              </pre>
            </CardContent>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Reveal index={1}>
            <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                  <ShieldCheck size={18} aria-hidden="true" />
                </span>
                <CardTitle className="pt-4 text-lg font-semibold">
                  Checking a holder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="flex flex-col gap-3 text-sm leading-6 text-fg-secondary">
                  <li className="flex gap-3">
                    <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                      1
                    </span>
                    Ask the contract whether that wallet holds the event number.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                      2
                    </span>
                    Read the mint transaction and the block it landed in.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                      3
                    </span>
                    Compare against the event details, which cannot have changed since
                    registration.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal index={2}>
            <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                  <Cpu size={18} aria-hidden="true" />
                </span>
                <CardTitle className="pt-4 text-lg font-semibold">
                  No middle layer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-fg-secondary">
                  Tessera runs no database and no indexer. Reads are batched into a
                  single call per page, which is also why a clean clone of this app
                  needs one network URL and nothing else.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
};

export default VerifySection;

