import { GraduationCap, Mic, Radio } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CASES = [
  {
    icon: <Mic size={18} aria-hidden="true" />,
    title: "Conferences",
    setup: "Codes at the door, bound to the wallet",
    body: "Attendees mint as they collect their lanyard. Because the badge cannot be transferred, holding it later still means they were there.",
  },
  {
    icon: <GraduationCap size={18} aria-hidden="true" />,
    title: "Courses and cohorts",
    setup: "Invitation list, bound to the wallet",
    body: "The roster is the list. Add it after registration so people who join in week two are not locked out of their certificate.",
  },
  {
    icon: <Radio size={18} aria-hidden="true" />,
    title: "Online events and talks",
    setup: "Open link, transferable",
    body: "Post the link in the group chat or under the stream, and everyone mints their own. Regulars end up with a run of badges from the same series.",
  },
];

const UseCasesSection = () => {
  return (
    <Section id="use-cases">
      <SectionHeading
        eyebrow="In practice"
        title="What people set up, and why."
        lead="Most events land on one of three setups, and the reasoning behind each is the part worth copying."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((item, i) => (
          <Reveal key={item.title} index={i} className="h-full">
            <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                    {item.icon}
                  </span>
                  <Badge variant="outline">{item.setup}</Badge>
                </div>
                <CardTitle className="pt-4 text-lg font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-fg-secondary">{item.body}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default UseCasesSection;
