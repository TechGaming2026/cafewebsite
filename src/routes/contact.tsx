import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, MapPin, Instagram, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/Layout";
import { ContactForm } from "@/components/ContactForm";
import { meta } from "@/lib/meta";
import { trackCallClick, trackWhatsAppClick, trackContactClick } from "@/lib/tracker";

export const Route = createFileRoute("/contact")({
  head: () =>
    meta(
      "Contact Us — FIKA Cafe Toronto",
      "Get in touch with FIKA Cafe in Kensington Market. Send an inquiry, contact us via WhatsApp, call directly, or visit our cozy Swedish café."
    ),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's make time for a conversation."
      >
        Whether you're planning a private event, inquiring about coffee beans, catering, or just want to say hello — we're here to help.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Quick Channels & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-6">
              <div>
                <p className="eyebrow text-primary">Direct Channels</p>
                <h3 className="mt-2 font-serif text-2xl text-foreground">Reach out directly</h3>
              </div>

              <div className="space-y-4 text-sm">
                {/* Phone Call */}
                <a
                  href={SITE.callUrl}
                  onClick={() => trackCallClick("Contact Page Phone Call", "/contact")}
                  className="flex items-center gap-3.5 p-3 rounded-sm border border-border/80 bg-background hover:bg-card transition-colors group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone Call</p>
                    <p className="text-xs text-muted-foreground">{SITE.phone}</p>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick("Contact Page WhatsApp Chat", "/contact")}
                  className="flex items-center gap-3.5 p-3 rounded-sm border border-emerald-600/30 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 transition-colors group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-300">WhatsApp Chat</p>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">Instant chat & inquiry</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SITE.email}`}
                  onClick={() => trackContactClick("Contact Page Email", "/contact")}
                  className="flex items-center gap-3.5 p-3 rounded-sm border border-border/80 bg-background hover:bg-card transition-colors group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">{SITE.email}</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackContactClick("Contact Page Instagram", "/contact")}
                  className="flex items-center gap-3.5 p-3 rounded-sm border border-border/80 bg-background hover:bg-card transition-colors group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Instagram</p>
                    <p className="text-xs text-muted-foreground">@fikakensington</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Location & Map Preview */}
            <div className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-4 text-sm">
              <p className="eyebrow text-primary">In Kensington Market</p>
              <div className="flex items-start gap-2.5 text-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="leading-snug">{SITE.address}</p>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs leading-snug">
                  Open 7 days a week. Seasonal hours apply — please check Google Maps or Instagram for today's hours.
                </p>
              </div>

              <iframe
                title="FIKA Cafe Map"
                src={SITE.mapEmbed}
                loading="lazy"
                className="h-44 w-full rounded-sm border border-border/70 mt-3"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
