export interface SiteStatus {
  isOpen: boolean; // true = website is live/open, false = website is closed
  closedMessage: string;
  reopenTime: string;
  updatedAt: string;
  updatedBy: string;
}

const STORAGE_KEY = "fika_site_status";
const EVENT_NAME = "fika_site_status_changed";

export const DEFAULT_SITE_STATUS: SiteStatus = {
  isOpen: true,
  closedMessage:
    "FIKA Cafe is currently closed. We look forward to welcoming you back during our regular operating hours!",
  reopenTime: "Tomorrow at 8:00 AM",
  updatedAt: new Date().toISOString(),
  updatedBy: "Admin",
};

export function getSiteStatus(): SiteStatus {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_STATUS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_STATUS;
    const parsed = JSON.parse(raw);
    return {
      isOpen: typeof parsed.isOpen === "boolean" ? parsed.isOpen : true,
      closedMessage: parsed.closedMessage || DEFAULT_SITE_STATUS.closedMessage,
      reopenTime: parsed.reopenTime || DEFAULT_SITE_STATUS.reopenTime,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      updatedBy: parsed.updatedBy || "Admin",
    };
  } catch (e) {
    console.error("Error reading site status:", e);
    return DEFAULT_SITE_STATUS;
  }
}

export function setSiteStatus(updates: Partial<SiteStatus>): SiteStatus {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SITE_STATUS, ...updates };
  }

  try {
    const current = getSiteStatus();
    const updated: SiteStatus = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Notify same window
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: updated })
    );

    return updated;
  } catch (e) {
    console.error("Error saving site status:", e);
    return { ...DEFAULT_SITE_STATUS, ...updates };
  }
}

export function toggleSiteStatus(): SiteStatus {
  const current = getSiteStatus();
  return setSiteStatus({ isOpen: !current.isOpen });
}

export function subscribeSiteStatus(
  callback: (status: SiteStatus) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<SiteStatus>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getSiteStatus());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getSiteStatus());
    }
  };

  window.addEventListener(EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
  };
}
