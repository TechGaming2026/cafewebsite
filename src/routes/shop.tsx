import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/Layout";
import { meta } from "@/lib/meta";
import { trackOrderClick } from "@/lib/tracker";

export const Route = createFileRoute("/shop")({
  head: () => meta("Shop — FIKA Cafe", "Coffee beans, ceramic mugs, merchandise and gift cards from FIKA Cafe's official online shop."),
  component: Shop,
});

function Shop() {
  const cards = [
    { t: "Online shop", d: "Coffee beans, ceramic mugs, t-shirts and more — on our official store.", href: SITE.shop, cta: "Shop online" },
    { t: "Gift cards", d: "Give someone a fika break.", href: SITE.giftCard, cta: "Get a gift card" },
  ];
  return (
    <>
      <PageHero eyebrow="Shop" title="Take a little fika home.">
        Retail products are sold through our official store. Café drinks and pastries are ordered in person at the counter.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-px bg-border px-5 pb-24 md:grid-cols-2 md:px-10">
        {cards.map((c) => (
          <div key={c.t} className="bg-card p-10">
            <h2 className="text-4xl">{c.t}</h2>
            <p className="mt-3 text-muted-foreground">{c.d}</p>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackOrderClick(c.t, c.href, "/shop")}
              className="btn mt-8 bg-primary text-primary-foreground"
            >
              {c.cta}
            </a>
          </div>
        ))}
      </section>
    </>
  );
}
