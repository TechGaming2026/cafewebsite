// Lightweight, privacy-respecting client-side tracking engine for Demo Cafe Admin Panel

export type EventType =
  | "page_view"
  | "order_click"
  | "whatsapp_click"
  | "contact_click"
  | "call_click"
  | "form_submission";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  label: string;
  page: string;
  timestamp: number;
  dateFormatted: string;
  visitorId: string;
  sessionId: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface FormSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  timestamp: number;
  dateFormatted: string;
  page: string;
  status: "new" | "contacted" | "resolved";
  device: "Desktop" | "Mobile" | "Tablet";
}

const EVENTS_KEY = "fika_analytics_events_v2";
const SUBMISSIONS_KEY = "fika_form_submissions_v2";
const VISITOR_ID_KEY = "fika_visitor_id";
const SESSION_ID_KEY = "fika_session_id";

function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = "vst_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-4);
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sid) {
    sid = "ses_" + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem(SESSION_ID_KEY, sid);
  }
  return sid;
}

function getDeviceType(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowserName(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Browser";
}

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      const seeded = generateSeedData();
      localStorage.setItem(EVENTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading analytics events:", e);
    return [];
  }
}

export function getSubmissions(): FormSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      const seeded = generateSeedSubmissions();
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading form submissions:", e);
    return [];
  }
}

export function trackEvent(
  type: EventType,
  label: string,
  pageOverride?: string,
  metadata?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;

  const page = pageOverride || window.location.pathname;
  if (page.startsWith("/admin")) return; // Don't track admin panel views

  const now = new Date();
  const newEvent: AnalyticsEvent = {
    id: "evt_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    type,
    label,
    page,
    timestamp: now.getTime(),
    dateFormatted: now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    device: getDeviceType(),
    browser: getBrowserName(),
    metadata,
  };

  try {
    const current = getEvents();
    // Cap at 1000 events to prevent localStorage overflow
    const updated = [newEvent, ...current].slice(0, 1000);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fika_analytics_update", { detail: newEvent }));
  } catch (e) {
    console.error("Failed to persist analytics event:", e);
  }
}

export function trackPageView(page: string): void {
  if (page.startsWith("/admin")) return;
  trackEvent("page_view", `Viewed ${page === "/" ? "Home" : page.replace("/", "")}`, page);
}

export function trackOrderClick(label: string, url?: string, sourcePage?: string): void {
  trackEvent("order_click", label, sourcePage, url ? { targetUrl: url } : undefined);
}

export function trackWhatsAppClick(label: string, sourcePage?: string): void {
  trackEvent("whatsapp_click", label, sourcePage);
}

export function trackContactClick(label: string, sourcePage?: string): void {
  trackEvent("contact_click", label, sourcePage);
}

export function trackCallClick(label: string, sourcePage?: string): void {
  trackEvent("call_click", label, sourcePage);
}

export function saveFormSubmission(data: { name: string; phone: string; email: string; message: string }): void {
  if (typeof window === "undefined") return;

  const now = new Date();
  const submission: FormSubmission = {
    id: "sub_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    timestamp: now.getTime(),
    dateFormatted: now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    page: window.location.pathname,
    status: "new",
    device: getDeviceType(),
  };

  try {
    const current = getSubmissions();
    const updated = [submission, ...current];
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));

    // Also record event
    trackEvent("form_submission", `Contact Form from ${data.name}`, window.location.pathname, {
      name: data.name,
      email: data.email,
      phone: data.phone,
    });

    window.dispatchEvent(new CustomEvent("fika_submissions_update", { detail: submission }));
  } catch (e) {
    console.error("Failed to save submission:", e);
  }
}

export function updateSubmissionStatus(id: string, status: "new" | "contacted" | "resolved"): void {
  try {
    const current = getSubmissions();
    const updated = current.map((s) => (s.id === id ? { ...s, status } : s));
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fika_submissions_update"));
  } catch (e) {
    console.error("Failed to update submission status:", e);
  }
}

export function deleteSubmission(id: string): void {
  try {
    const current = getSubmissions();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fika_submissions_update"));
  } catch (e) {
    console.error("Failed to delete submission:", e);
  }
}

export function clearAnalyticsData(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify([]));
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("fika_analytics_update"));
  window.dispatchEvent(new CustomEvent("fika_submissions_update"));
}

function generateSeedData(): AnalyticsEvent[] {
  const baseTime = Date.now();
  const sampleEvents: Array<{ type: EventType; label: string; page: string; minutesAgo: number; device: "Desktop" | "Mobile" | "Tablet" }> = [
    { type: "page_view", label: "Viewed Home", page: "/", minutesAgo: 3, device: "Mobile" },
    { type: "whatsapp_click", label: "Hero WhatsApp Button", page: "/", minutesAgo: 8, device: "Mobile" },
    { type: "order_click", label: "Nav Shop Link", page: "/menu", minutesAgo: 15, device: "Desktop" },
    { type: "contact_click", label: "Header Contact Button", page: "/", minutesAgo: 22, device: "Desktop" },
    { type: "page_view", label: "Viewed Menu", page: "/menu", minutesAgo: 34, device: "Mobile" },
    { type: "whatsapp_click", label: "Contact Page WhatsApp", page: "/contact", minutesAgo: 48, device: "Mobile" },
    { type: "order_click", label: "Online Shop Link", page: "/shop", minutesAgo: 65, device: "Tablet" },
    { type: "call_click", label: "Header Call Button", page: "/visit", minutesAgo: 95, device: "Mobile" },
    { type: "page_view", label: "Viewed Visit", page: "/visit", minutesAgo: 110, device: "Desktop" },
    { type: "contact_click", label: "Visit Section Contact", page: "/visit", minutesAgo: 130, device: "Mobile" },
    { type: "page_view", label: "Viewed Contact", page: "/contact", minutesAgo: 145, device: "Desktop" },
    { type: "order_click", label: "Gift Card Order", page: "/shop", minutesAgo: 180, device: "Desktop" },
  ];

  return sampleEvents.map((item, idx) => {
    const timestamp = baseTime - item.minutesAgo * 60 * 1000;
    const date = new Date(timestamp);
    return {
      id: `seed_evt_${idx}`,
      type: item.type,
      label: item.label,
      page: item.page,
      timestamp,
      dateFormatted: date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      visitorId: `vst_seed_${(idx % 4) + 1}`,
      sessionId: `ses_seed_${(idx % 3) + 1}`,
      device: item.device,
      browser: item.device === "Mobile" ? "Safari" : "Chrome",
    };
  });
}

function generateSeedSubmissions(): FormSubmission[] {
  const baseTime = Date.now();
  return [
    {
      id: "seed_sub_1",
      name: "Astrid Lindgren",
      phone: "+91 98765 43210",
      email: "astrid.lindgren@example.com",
      message: "Hi Fika team! We are planning a small private gathering for 12 people next Saturday morning. Do you take reservations for the back room or patio?",
      timestamp: baseTime - 45 * 60 * 1000,
      dateFormatted: new Date(baseTime - 45 * 60 * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      page: "/contact",
      status: "new",
      device: "Desktop",
    },
    {
      id: "seed_sub_2",
      name: "Marcus Vance",
      phone: "+1 (416) 555-0182",
      email: "marcus.vance@coffeeclub.ca",
      message: "Interested in ordering 5kg of whole beans roasted by Lycka Coffee Roasters for our office in Kensington. Please let us know corporate pricing.",
      timestamp: baseTime - 120 * 60 * 1000,
      dateFormatted: new Date(baseTime - 120 * 60 * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      page: "/contact",
      status: "contacted",
      device: "Mobile",
    },
  ];
}
