import { createFileRoute } from "@tanstack/react-router";
import { MENU, SITE } from "@/lib/site";
import { PageHero } from "@/components/Layout";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/menu")({
  head: () => meta("Menu — FIKA Cafe Toronto", "Cardamom lattes, matcha, pour over, sandwiches and house-made Swedish pastries like kanelbulle and semla."),
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <PageHero eyebrow="Café menu" title="Coffee, matcha & pastries made in house.">
        Seasonal items come and go. For the latest, see the <a href={SITE.officialMenu} target="_blank" rel="noreferrer" className="underline">live menu</a>.
      </PageHero>
      <nav className="sticky top-[69px] z-30 border-y bg-background/95 backdrop-blur" aria-label="Menu categories">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 md:px-10">
          {MENU.map((c) => <a key={c.id} href={`#${c.id}`} className="eyebrow shrink-0 text-muted-foreground hover:text-foreground">{c.title}</a>)}
        </div>
      </nav>
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-10">
        {MENU.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-40 border-b py-12 md:grid md:grid-cols-3 md:gap-10">
            <div><h2 className="text-4xl">{c.title}</h2>{c.note && <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>}</div>
            <ul className="mt-6 divide-y md:col-span-2 md:mt-0">
              {c.items.map((i) => (
                <li key={i.name} className="flex justify-between gap-4 py-4">
                  <span className="text-lg">{i.name}</span>
                  {i.note && <span className="eyebrow self-center text-primary">{i.note}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
