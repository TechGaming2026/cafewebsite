import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Coffee,
  BookOpen,
  Camera,
  Mail,
  ShoppingBag,
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { trackCallClick, trackWhatsAppClick, trackContactClick, trackOrderClick } from "@/lib/tracker";

const NAV = [
  { to: "/menu", label: "Menu", icon: Coffee, desc: "Signature coffees & fresh baked pastries" },
  { to: "/story", label: "Our Story", icon: BookOpen, desc: "Swedish fika tradition since 2013" },
  { to: "/gallery", label: "Gallery", icon: Camera, desc: "Back patio, book wall & cozy corners" },
  { to: "/visit", label: "Visit", icon: MapPin, desc: "Hours & Kensington Market directions" },
  { to: "/contact", label: "Contact", icon: Mail, desc: "Send an inquiry or special request" },
  { to: "/shop", label: "Shop", icon: ShoppingBag, desc: "Coffee beans, retail & gift cards", badge: "Online" },
  { to: "/faq", label: "FAQ", icon: HelpCircle, desc: "Seating, takeout & coffee details" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3" aria-label="FIKA Cafe home">
          <img
            src={SITE.logo}
            alt="FIKA Cafe Dala horse logo"
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-2xl font-medium tracking-tight">Fika</span>
        </Link>

        {/* Center: Interactive Navigation Pill Dock with Warm Light Brown Styling */}
        <nav
          className="hidden items-center rounded-full border border-[#d9ccba] bg-[#ede5d8]/90 p-1 shadow-[0_2px_10px_rgba(75,50,30,0.06)] backdrop-blur-md lg:flex gap-0.5 xl:gap-1"
          aria-label="Main navigation"
        >
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className="group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#634f3e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faf6f0] hover:text-[#2d1c10] hover:shadow-[0_2px_8px_rgba(70,45,25,0.08)] active:translate-y-0"
                activeProps={{
                  className:
                    "!bg-[#3d2b1f] !text-[#fbf9f5] !shadow-[0_2px_8px_rgba(61,43,31,0.25)] font-semibold !translate-y-0",
                }}
                onClick={() => {
                  if (n.to === "/shop") trackOrderClick("Nav Shop Link", n.to);
                  if (n.to === "/contact") trackContactClick("Nav Contact Link");
                }}
              >
                <Icon className="h-3.5 w-3.5 text-[#7c6652] group-hover:text-[#2d1c10] group-[.active]:!text-[#fbf9f5] transition-transform duration-200 group-hover:scale-110" />
                <span>{n.label}</span>
                {n.badge && (
                  <span className="hidden xl:inline-block rounded-full bg-[#dfd2be] text-[#4d3826] border border-[#cbbeaa]/60 px-1.5 py-0.2 text-[9px] font-bold tracking-normal group-[.active]:bg-white/20 group-[.active]:text-white group-[.active]:border-white/30">
                    {n.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons with Harmonious Light Brown & Coffee Tones */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={SITE.callUrl}
            onClick={() => trackCallClick("Header Call")}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#d9ccba] bg-[#ede5d8]/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#574433] shadow-[0_2px_8px_rgba(75,50,30,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#faf6f0] hover:text-[#2d1c10] hover:border-[#cbbeaa] hover:shadow-[0_4px_12px_rgba(75,50,30,0.1)]"
            title={`Call ${SITE.phone}`}
          >
            <Phone className="h-3.5 w-3.5 text-[#7c6652] transition-transform group-hover:scale-110 group-hover:text-[#2d1c10]" />
            <span>Call</span>
          </a>

          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick("Header WhatsApp")}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#c1d9c3] bg-[#e7eee6]/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#204e30] shadow-[0_2px_8px_rgba(30,75,45,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#edf5ec] hover:border-[#a8cca9] hover:shadow-[0_4px_12px_rgba(30,75,45,0.1)]"
            title={`WhatsApp ${SITE.phone}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <MessageCircle className="h-3.5 w-3.5 text-[#2e6d44] transition-transform group-hover:scale-110" />
            <span>WhatsApp</span>
          </a>

          <Link
            to="/visit"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3d2b1f] hover:bg-[#2b1e15] border border-[#3d2b1f] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#fbf9f5] shadow-[0_2px_8px_rgba(61,43,31,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(61,43,31,0.25)]"
          >
            <span>Visit</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9ccba] bg-[#ede5d8]/90 lg:hidden text-[#4d3826] hover:bg-[#faf6f0] transition-colors shadow-2xs"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Enhanced Mobile Drawer */}
      {open && (
        <nav className="border-t border-[#d9ccba]/80 bg-background/98 backdrop-blur-md px-5 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          <p className="eyebrow text-[#8a735e] mb-3 px-1">Navigation</p>
          <div className="space-y-1.5">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => {
                    setOpen(false);
                    if (n.to === "/shop") trackOrderClick("Mobile Drawer Shop Link", n.to);
                    if (n.to === "/contact") trackContactClick("Mobile Drawer Contact Link");
                  }}
                  className="group flex items-center justify-between rounded-md border border-[#d9ccba]/70 bg-[#ede5d8]/50 p-3 transition-all duration-200 hover:bg-[#faf6f0] hover:border-[#b8a690] active:bg-[#ede5d8]"
                  activeProps={{
                    className: "!border-[#3d2b1f] !bg-[#3d2b1f]/10 font-semibold",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ded2c0]/70 text-[#4d3826] transition-transform group-hover:scale-110">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-serif text-lg leading-tight text-[#2d1c10]">{n.label}</p>
                      <p className="text-[11px] text-[#7c6652]">{n.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.badge && (
                      <span className="rounded-full bg-[#dfd2be] text-[#4d3826] border border-[#cbbeaa]/60 px-2 py-0.5 text-[10px] font-semibold">
                        {n.badge}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[#8a735e] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Contact & Action Buttons in Drawer */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={SITE.callUrl}
              onClick={() => {
                trackCallClick("Mobile Drawer Call");
                setOpen(false);
              }}
              className="btn justify-center rounded-md border border-[#d9ccba] bg-[#ede5d8]/70 py-3 text-xs text-[#4d3826] hover:bg-[#faf6f0]"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackWhatsAppClick("Mobile Drawer WhatsApp");
                setOpen(false);
              }}
              className="btn justify-center rounded-md border border-[#c1d9c3] bg-[#e7eee6]/90 text-[#204e30] py-3 text-xs hover:bg-[#edf5ec]"
            >
              <MessageCircle className="h-4 w-4 text-[#2e6d44]" /> WhatsApp
            </a>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to="/contact"
              onClick={() => {
                trackContactClick("Mobile Drawer Contact Button");
                setOpen(false);
              }}
              className="btn justify-center rounded-md border border-[#d9ccba] bg-[#ede5d8]/70 py-3 text-xs text-[#4d3826] hover:bg-[#faf6f0]"
            >
              <Mail className="h-4 w-4" /> Contact Form
            </Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackContactClick("Mobile Drawer Instagram");
                setOpen(false);
              }}
              className="btn justify-center rounded-md border border-pink-500/30 bg-pink-500/10 text-pink-800 dark:text-pink-300 py-3 text-xs"
            >
              Instagram
            </a>
          </div>

          <Link
            to="/visit"
            onClick={() => setOpen(false)}
            className="btn mt-3 w-full justify-center rounded-md bg-[#3d2b1f] hover:bg-[#2b1e15] py-3.5 text-xs text-[#fbf9f5] shadow-sm"
          >
            <MapPin className="h-4 w-4" /> Visit FIKA Kensington
          </Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-ink-foreground lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl">Make time for fika.</p>
          <p className="mt-4 max-w-sm text-ink-foreground/70">A cozy Swedish-inspired café in Kensington Market since 2013.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow text-sage">Find us</p>
          <p>{SITE.address}</p>
          <a
            href={SITE.callUrl}
            onClick={() => trackCallClick("Footer Call")}
            className="block underline-offset-4 hover:underline"
          >
            Call: {SITE.phone}
          </a>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick("Footer WhatsApp")}
            className="block underline-offset-4 hover:underline"
          >
            WhatsApp: {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="block underline-offset-4 hover:underline">{SITE.email}</a>
          <p className="text-ink-foreground/60">Hours: please check Google Maps for current hours.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="eyebrow text-sage">Explore</p>
          <Link to="/menu" className="hover:underline">Menu</Link>
          <Link to="/visit" className="hover:underline">Visit</Link>
          <Link to="/contact" onClick={() => trackContactClick("Footer Contact Link")} className="hover:underline">Contact Form</Link>
          <a href={SITE.callUrl} onClick={() => trackCallClick("Footer Call Link")} className="hover:underline">Call Us</a>
          <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackWhatsAppClick("Footer WhatsApp Link")} className="hover:underline">WhatsApp Chat</a>
          <a href={SITE.shop} target="_blank" rel="noreferrer" onClick={() => trackOrderClick("Footer Online Shop", SITE.shop)} className="hover:underline">Online shop</a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" onClick={() => trackContactClick("Footer Instagram")} className="hover:underline">Instagram</a>
        </div>
      </div>
      <p className="border-t border-ink-foreground/10 px-5 py-6 text-center text-xs text-ink-foreground/50">© {new Date().getFullYear()} FIKA Cafe · Toronto</p>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background/95 backdrop-blur lg:hidden text-center">
      <a
        href={SITE.callUrl}
        onClick={() => trackCallClick("Mobile Bar Call")}
        className="flex flex-col items-center justify-center gap-1 border-r py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-card"
      >
        <Phone className="h-4 w-4 text-primary" />
        <span>Call</span>
      </a>
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsAppClick("Mobile Bar WhatsApp")}
        className="flex flex-col items-center justify-center gap-1 border-r py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 hover:bg-card"
      >
        <MessageCircle className="h-4 w-4 text-emerald-600" />
        <span>WhatsApp</span>
      </a>
      <Link to="/menu" className="flex flex-col items-center justify-center gap-1 border-r py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-card">
        <Menu className="h-4 w-4" />
        <span>Menu</span>
      </Link>
      <a
        href={SITE.directions}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackContactClick("Mobile Bar Directions")}
        className="flex flex-col items-center justify-center gap-1 bg-primary py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90"
      >
        <MapPin className="h-4 w-4" />
        <span>Directions</span>
      </a>
    </div>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-10 md:pt-24">
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] md:text-7xl">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </section>
  );
}
