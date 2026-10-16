import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/Layout";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/visit")({
  head: () => meta("Visit — FIKA Cafe, 28 Kensington Ave Toronto", "Find FIKA Cafe at 28 Kensington Ave in Toronto's Kensington Market. Map, directions and visitor info."),
  component: Visit,
});

function Visit() {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PageHero eyebrow="Visit us" title="Find us in Kensington Market." />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:grid-cols-5 md:px-10">
        <div className="space-y-10 md:col-span-2">
          <div>
            <p className="eyebrow text-primary">Address</p>
            <p className="mt-2 font-serif text-3xl">{SITE.address}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={SITE.directions} target="_blank" rel="noreferrer" className="btn bg-primary text-primary-foreground">Get Directions</a>
              <a href={SITE.callUrl} className="btn border border-foreground/30 hover:bg-card">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn border border-emerald-600/50 text-emerald-700 hover:bg-emerald-50">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <Link to="/contact" className="btn border border-foreground/30 hover:bg-card">Contact</Link>
              <button className="btn border border-foreground/30" onClick={() => { navigator.clipboard.writeText(SITE.address); setCopied(true); }}>{copied ? "Copied" : "Copy address"}</button>
            </div>
          </div>
          <div>
            <p className="eyebrow text-primary">Hours</p>
            <p className="mt-2 text-muted-foreground">Hours vary seasonally — please check our Google Maps listing or Instagram for today's hours.</p>
          </div>
          <div>
            <p className="eyebrow text-primary">How to enjoy</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>Dine in — front room, book-lined back room or garden patio</li>
              <li>Take out</li>
              <li>Pour over menu — weekdays only</li>
            </ul>
          </div>
        </div>
        <iframe title="Map to FIKA Cafe" src={SITE.mapEmbed} loading="lazy" className="h-[480px] w-full border-0 md:col-span-3" />
      </section>
    </>
  );
}
