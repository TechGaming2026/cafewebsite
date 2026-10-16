import { Link } from "@tanstack/react-router";
import { Clock, Phone, MessageCircle, Instagram, MapPin, Coffee, Lock } from "lucide-react";
import { SITE } from "@/lib/site";
import type { SiteStatus } from "@/lib/siteStatus";
import { trackCallClick, trackWhatsAppClick } from "@/lib/tracker";

interface WebsiteClosedViewProps {
  status: SiteStatus;
}

export function WebsiteClosedView({ status }: WebsiteClosedViewProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-5 py-10 md:px-10">
      {/* Top Branding */}
      <header className="mx-auto w-full max-w-4xl flex items-center justify-between border-b border-border/60 pb-6">
        <div className="flex items-center gap-3">
          <img src={SITE.logo} alt="FIKA Cafe Logo" className="h-10 w-auto" />
          <span className="font-serif text-2xl tracking-tight text-foreground">FIKA Cafe</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Currently Closed</span>
        </div>
      </header>

      {/* Main Notice Hero */}
      <main className="mx-auto w-full max-w-2xl py-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Coffee className="h-8 w-8" />
        </div>

        <p className="eyebrow text-primary">Notice to Our Guests</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-foreground font-normal tracking-tight">
          We are currently closed
        </h1>

        <div className="mt-6 rounded-lg border border-border/80 bg-card p-6 shadow-sm text-center">
          <p className="text-base text-foreground/90 leading-relaxed font-sans">
            {status.closedMessage ||
              "FIKA Cafe is temporarily closed. We look forward to welcoming you back during our regular operating hours!"}
          </p>

          {status.reopenTime && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Expected Reopening: <strong className="text-foreground">{status.reopenTime}</strong></span>
            </div>
          )}
        </div>

        {/* Regular Operating Hours Box */}
        <div className="mt-8 rounded-lg border border-border/60 bg-muted/40 p-5 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> Standard Hours of Operation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-2 sm:border-b-0 sm:pb-0">
              <span className="text-muted-foreground">Monday – Friday</span>
              <span className="font-medium text-foreground">8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturday – Sunday</span>
              <span className="font-medium text-foreground">9:00 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Inquiries */}
        <div className="mt-8 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Urgent Inquiries & Direct Contact
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("Closed Notice WhatsApp")}
              className="btn border border-emerald-600/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400 text-sm py-2 px-4 rounded-md"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>

            <a
              href={SITE.callUrl}
              onClick={() => trackCallClick("Closed Notice Call")}
              className="btn border border-foreground/20 hover:bg-card text-sm py-2 px-4 rounded-md"
            >
              <Phone className="h-4 w-4" /> Call {SITE.phone}
            </a>

            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn border border-pink-500/30 text-pink-700 hover:bg-pink-50 dark:text-pink-400 text-sm py-2 px-4 rounded-md"
            >
              <Instagram className="h-4 w-4" /> @fikakensington
            </a>

            <a
              href={SITE.directions}
              target="_blank"
              rel="noreferrer"
              className="btn border border-foreground/20 hover:bg-card text-sm py-2 px-4 rounded-md"
            >
              <MapPin className="h-4 w-4" /> View Location
            </a>
          </div>
        </div>
      </main>

      {/* Footer with subtle admin access */}
      <footer className="mx-auto w-full max-w-4xl border-t border-border/60 pt-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">FIKA Cafe</p>
          <p className="text-[11px] text-muted-foreground">28 Kensington Ave, Toronto, ON M5T 2J9</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>Swedish-inspired specialty coffee</span>
          <span>·</span>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            title="Cafe Manager / Admin Login"
          >
            <Lock className="h-3 w-3" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
