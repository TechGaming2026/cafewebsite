import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/Layout";
import { ContactForm } from "@/components/ContactForm";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/faq")({
  head: () => meta("FAQ & Contact — FIKA Cafe", "Questions about FIKA Cafe, retail policy, jobs and how to get in touch."),
  component: Faq,
});

const QA = [
  { q: "Who owns Fika Cafe?", a: "Fika is owned by Yadi Arifin — pastry chef, 2017 Toronto AeroPress Champion and 2018 Canadian Barista Championship competitor." },
  { q: "Are your pastries made in house?", a: "Yes. All of our pastries are made in house, from scratch." },
  { q: "When is the pour-over menu available?", a: "Our curated pour-over menu is available on weekdays only." },
  { q: "Not happy with your drink or food?", a: "Let our team know right away so we can make it right." },
  { q: "Can I return retail items?", a: "As a small independent business we can't accept refunds or exchanges on retail items such as mugs, t-shirts or coffee beans." },
  { q: "Are you hiring?", a: `We're looking for experienced part-time baristas (minimum one year at a specialty café, interest in baking). Send your resume to ${SITE.email}. Please don't send inquiries by Instagram DM.` },
  { q: "Do you offer café consulting?", a: "Yes — contact us for a free 15-minute consultation about opening a café, choosing equipment and more." },
];

function Faq() {
  return (
    <>
      <PageHero eyebrow="FAQ & contact" title="Good to know." />
      <section className="mx-auto max-w-4xl px-5 pb-16 md:px-10">
        {QA.map((x) => (
          <details key={x.q} className="group border-b py-6">
            <summary className="flex cursor-pointer list-none justify-between font-serif text-2xl">{x.q}<span className="text-primary transition group-open:rotate-45">+</span></summary>
            <p className="mt-4 text-muted-foreground">{x.a}</p>
          </details>
        ))}
      </section>
      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-10 space-y-10">
        <ContactForm />

        <div className="bg-card p-8 md:p-10 rounded-sm border border-border">
          <p className="eyebrow text-primary">Direct contact</p>
          <a href={`mailto:${SITE.email}`} className="mt-3 block font-serif text-3xl md:text-4xl hover:underline">{SITE.email}</a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="mt-2 block text-muted-foreground hover:underline">Instagram · @fikakensington</a>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.callUrl} className="btn border border-foreground/30 hover:bg-background">
              <Phone className="h-4 w-4" /> Call ({SITE.phone})
            </a>
            <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn bg-emerald-600 text-white hover:bg-emerald-700">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn bg-primary text-primary-foreground hover:opacity-90">
              Contact on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
