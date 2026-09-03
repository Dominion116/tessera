import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

type Faq = {
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    q: "What does it cost to create a badge?",
    a: "Only the network fee for the registration transaction. Tessera takes nothing, and there is no fee to mint beyond gas. Writing the artwork onchain is the expensive part of that transaction, which is why the size of your SVG matters.",
  },
  {
    q: "How large can the artwork be?",
    a: "Aim below roughly 100 KB of SVG. Files are optimized in your browser before registration and the projected onchain size is shown while you work, so you find out before you pay rather than after.",
  },
  {
    q: "Can I change the details after registering?",
    a: "The name, description, date, location, link and artwork are permanent. Two things stay adjustable for the first 30 days: whether the badge is open to everyone, and attaching an invitation list if you registered without one.",
  },
  {
    q: "Why is my invitation list limited to one change?",
    a: `You can attach a list once, within ${CREATOR_TIMELOCK_DAYS} days, and only if you registered without one. Registering with a list already attached uses up that single change, so if you expect the guest list to move, register without it and attach it later.`,
  },
  {
    q: "Can one code at the door serve a whole room?",
    a: `No, and that is deliberate. Each approval is tied to one wallet, so a photographed code is worthless to anyone else. Print per-attendee codes, or run a station that approves wallets as people arrive. Approvals stop working ${SIGNATURE_WINDOW_DAYS} days after registration.`,
  },
  {
    q: "Can I send badges out myself instead of asking people to mint?",
    a: `Yes, in batches of up to ${CREATOR_MINT_BATCH_LIMIT} wallets, for the first ${CREATOR_TIMELOCK_DAYS} days. Anyone in the batch who already holds the badge is skipped rather than causing the whole batch to fail, and you get a result for each address.`,
  },
  {
    q: "What happens if someone mints twice?",
    a: "They cannot. One record of who has claimed is shared by all three routes, so a wallet that minted through a link cannot mint again through a list or a door code.",
  },
  {
    q: "Do I need a wallet just to look around?",
    a: "No. Browsing badges, reading event pages and checking someone's mint all work without connecting. A wallet is needed only to mint or to create.",
  },
  {
    q: "Which network is this on?",
    a: "Base. Badges live in a single public contract there, and the same contract backs both the website and the Farcaster app, so a badge minted in one is visible in the other immediately.",
  },
  {
    q: "What if Tessera disappears?",
    a: "Your badges do not depend on it. The artwork and the details are in the contract, the code is MIT licensed and public, and anyone can run their own copy of this interface with nothing but a network URL.",
  },
];

const FaqSection = () => {
  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="Questions"
        title="The things creators ask before their first badge."
        lead="Answers to what actually trips people up: what is permanent, what is not, and which deadlines matter."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-xl border border-border/70 bg-card/60 px-5 tile-grout"
          >
            {FAQS.slice(0, 5).map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-fg-secondary">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <Reveal index={1}>
          <Accordion
            type="single"
            collapsible
            className="rounded-xl border border-border/70 bg-card/60 px-5 tile-grout"
          >
            {FAQS.slice(5).map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-fg-secondary">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
};

export default FaqSection;
