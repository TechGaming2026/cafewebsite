import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Phone, MessageCircle } from "lucide-react";
import hero from "@/assets/hero.jpg";
import buns from "@/assets/buns.jpg";
import garden from "@/assets/garden.jpg";
import latte from "@/assets/latte.jpg";
import { PRESS, SITE } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { meta } from "@/lib/meta";
import { trackCallClick, trackWhatsAppClick, trackContactClick } from "@/lib/tracker";

export const Route = createFileRoute("/")({
  head: () => meta("FIKA Cafe — Swedish-inspired coffee in Kensington Market, Toronto", "Specialty coffee, house-made Swedish pastries and a cozy book-lined café with a garden patio at 28 Kensington Ave, Toronto."),
  component: Home,
});

const SIGNATURES = [
  { name: "Kardemumma Latte", desc: "Our cardamom latte — hot or iced.", img: latte },
  { name: "Kanelbulle", desc: "Swedish cinnamon bun, made in house.", img: buns },
  { name: "Fika for two", desc: "Coffee and a bun in the book room.", img: hero },
];

function Home() {
  return (
    <>
      <section className="relative">
        <img src={hero} alt="Cardamom latte and cinnamon bun in a book-lined café" width={1600} height={1008} className="h-[78vh] min-h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-14 text-ink-foreground md:px-10 md:pb-20">
          <p className="eyebrow">Kensington Market · Toronto · Since 2013</p>
          <h1 className="mt-4 text-6xl leading-[0.95] md:text-8xl">Make time<br />for <em>fika.</em></h1>
          <p className="mt-6 max-w-lg text-lg text-ink-foreground/85">Specialty coffee, Swedish-inspired pastries and a little pause in the heart of Kensington Market.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="btn bg-background text-foreground hover:bg-card">Explore the Menu</Link>
            <a
              href={SITE.callUrl}
              onClick={() => trackCallClick("Hero Call Button", "/")}
              className="btn border border-ink-foreground/60 hover:bg-ink-foreground/10"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("Hero WhatsApp Button", "/")}
              className="btn border border-emerald-400 text-emerald-300 hover:bg-emerald-950/40"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link
              to="/contact"
              onClick={() => trackContactClick("Hero Contact Button", "/")}
              className="btn border border-ink-foreground/60 hover:bg-ink-foreground/10"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:px-10">
        <p className="eyebrow text-primary md:col-span-3">Have more fika breaks</p>
        <div className="md:col-span-8">
          <h2 className="text-4xl leading-tight md:text-5xl">Fika — Swedish for “to go out for coffee.” A coffee break, usually with a cinnamon bun, shared with friends.</h2>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">A rarity for an indie café: every one of our pastries is made in house, from scratch. We're a multi-roaster specialty coffee shop, now also roasting our own beans under our sister brand Lycka Coffee Roasters.</p>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow text-primary">Signatures</p><h2 className="mt-3 text-5xl">From our counter</h2></div>
            <Link to="/menu" className="eyebrow inline-flex items-center gap-1 border-b border-foreground pb-1">Full menu <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {SIGNATURES.map((s, i) => (
              <article key={s.name} className={i === 1 ? "md:mt-16" : ""}>
                <img src={s.img} alt={s.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <h3 className="mt-5 text-2xl">{s.name}</h3>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-10">
          <img src={garden} alt="Leafy backyard patio" loading="lazy" className="aspect-[5/4] w-full object-cover" />
          <div>
            <p className="eyebrow text-sage">The atmosphere</p>
            <h2 className="mt-4 text-5xl leading-tight">A little escape in Kensington Market.</h2>
            <p className="mt-6 text-lg text-ink-foreground/75">A century-old home filled with light and Scandinavian decor. A cozy back room with an entire wall of old books. And a backyard patio, secluded from the bustle of the city — perfect for a cold drink and a good read.</p>
            <Link to="/gallery" className="btn mt-8 border border-ink-foreground/40 hover:bg-ink-foreground/10">See the gallery</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10">
        <p className="eyebrow text-primary">In the press</p>
        <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
          {PRESS.map((p) => (
            <a key={p.outlet} href={p.url} target="_blank" rel="noreferrer" className="group bg-background p-8 hover:bg-card">
              <p className="font-serif text-2xl leading-snug">“{p.quote}”</p>
              <p className="eyebrow mt-6 inline-flex items-center gap-1 text-muted-foreground">{p.outlet} <ArrowUpRight className="h-3 w-3" /></p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-2 md:px-10">
          <div>
            <p className="eyebrow text-primary">Visit Fika</p>
            <h2 className="mt-4 text-5xl">Come for a pause.</h2>
            <p className="mt-6 flex items-start gap-2 text-lg"><MapPin className="mt-1 h-5 w-5 text-primary" />{SITE.address}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SITE.directions}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackContactClick("Visit Section Directions", "/")}
                className="btn bg-primary text-primary-foreground hover:opacity-90"
              >
                Get Directions
              </a>
              <a
                href={SITE.callUrl}
                onClick={() => trackCallClick("Visit Section Call", "/")}
                className="btn border border-foreground/30 hover:bg-background"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppClick("Visit Section WhatsApp", "/")}
                className="btn border border-emerald-600/50 text-emerald-700 hover:bg-emerald-50"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <Link
                to="/contact"
                onClick={() => trackContactClick("Visit Section Contact", "/")}
                className="btn border border-foreground/30 hover:bg-background"
              >
                Contact
              </Link>
            </div>
          </div>
          <iframe title="Map to FIKA Cafe" src={SITE.mapEmbed} loading="lazy" className="h-80 w-full border-0 md:h-full" />
        </div>
      </section>

      <section className="border-t py-24 bg-background">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
