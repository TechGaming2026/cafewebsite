import { createFileRoute } from "@tanstack/react-router";
import latte from "@/assets/latte.jpg";
import buns from "@/assets/buns.jpg";
import { PageHero } from "@/components/Layout";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/story")({
  head: () => meta("Our Story — FIKA Cafe", "The story of FIKA Cafe: the Swedish fika tradition, house-made pastries and a passion for specialty coffee in Kensington Market."),
  component: Story,
});

function Story() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Breaking away from the ordinary, since 2013." />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:grid-cols-2 md:px-10">
        <img src={latte} alt="Latte beside an open book" className="aspect-[4/5] w-full object-cover" />
        <div className="space-y-6 self-center text-lg text-muted-foreground">
          <h2 className="text-4xl text-foreground">What is fika?</h2>
          <p>Originally a Swedish verb meaning “to go out for coffee,” fika is also a noun: a coffee break. In Sweden it's standard to invite friends to fika every few hours during the work day — usually with a small snack like a cinnamon bun.</p>
          <p>Our logo is the Dala horse, a symbol of Sweden.</p>
        </div>
      </section>
      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-10">
          <div className="space-y-6 self-center text-lg text-muted-foreground">
            <p className="eyebrow text-primary">The founder</p>
            <h2 className="text-4xl text-foreground">Yadi Arifin</h2>
            <p>With a background in pastry and a passion for everything coffee, Yadi frequently travels to Sweden and Denmark to visit bakeries, cafés and coffee festivals, bringing ideas home to Fika.</p>
            <p>He is the 2017 Toronto AeroPress Champion and competed at the 2018 Canadian Barista Championship. Pour over is one of his favourite ways to brew — hence our curated weekday pour-over menu.</p>
          </div>
          <img src={buns} alt="House-made cinnamon buns" loading="lazy" className="aspect-[4/5] w-full object-cover" />
        </div>
      </section>
    </>
  );
}
