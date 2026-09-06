import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    q: "Do I need a wallet just to look around?",
    a: "No. Browsing badges, reading event pages and checking someone's mint all work without connecting. A wallet is needed only to mint or to create.",
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
        align="center"
        eyebrow="Questions"
        title="The things creators ask before their first badge."
        lead="Answers to what actually trips people up: what it costs, what is permanent, and what happens if this app goes away."
      />

      <Reveal className="mx-auto w-full max-w-3xl">
        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-border/70 bg-card/60 px-5 tile-grout"
        >
          {FAQS.map((faq) => (
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
    </Section>
  );
};

export default FaqSection;
