// Form abuse protection & 24-hour ban system for Demo Cafe
import { trackEvent } from "./tracker";

export interface BanStatus {
  isBanned: boolean;
  attempts: number;
  maxAttempts: number;
  banUntil: number | null;
  remainingMs: number;
  reason?: string;
  visitorId: string;
}

const STORAGE_BAN_KEY = "fika_form_ban_until";
const STORAGE_ATTEMPTS_KEY = "fika_form_attempt_count";
const STORAGE_REASON_KEY = "fika_form_ban_reason";
const VISITOR_ID_KEY = "fika_visitor_id";
const EVENT_BAN_UPDATE = "fika_ban_updated";

export const MAX_ATTEMPTS = 3;
export const BAN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = "vst_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-4);
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

/**
 * Check if the current visitor is banned, and how many attempts they have used.
 */
export function checkBanStatus(): BanStatus {
  if (typeof window === "undefined") {
    return {
      isBanned: false,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      banUntil: null,
      remainingMs: 0,
      visitorId: "server",
    };
  }

  const visitorId = getVisitorId();
  const rawBanUntil = localStorage.getItem(STORAGE_BAN_KEY);
  const banReason = localStorage.getItem(STORAGE_REASON_KEY) || undefined;
  const now = Date.now();

  if (rawBanUntil) {
    const banUntil = parseInt(rawBanUntil, 10);
    if (!isNaN(banUntil) && banUntil > now) {
      // Still banned
      return {
        isBanned: true,
        attempts: MAX_ATTEMPTS,
        maxAttempts: MAX_ATTEMPTS,
        banUntil,
        remainingMs: banUntil - now,
        reason: banReason || "Exceeded 3 attempts with unnecessary or invalid details",
        visitorId,
      };
    } else if (banUntil <= now) {
      // Ban expired! Auto-clear
      clearBanData();
    }
  }

  const rawAttempts = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
  const attempts = rawAttempts ? parseInt(rawAttempts, 10) : 0;

  return {
    isBanned: false,
    attempts: isNaN(attempts) ? 0 : attempts,
    maxAttempts: MAX_ATTEMPTS,
    banUntil: null,
    remainingMs: 0,
    visitorId,
  };
}

/**
 * Record an unnecessary/invalid attempt. If attempts reach 3, ban for 24 hours.
 */
export function recordFailedAttempt(reason: string): BanStatus {
  if (typeof window === "undefined") return checkBanStatus();

  const current = checkBanStatus();
  if (current.isBanned) return current;

  const newAttempts = current.attempts + 1;
  const now = Date.now();

  if (newAttempts >= MAX_ATTEMPTS) {
    // TRIGGER 24-HOUR BAN
    const banUntil = now + BAN_DURATION_MS;
    localStorage.setItem(STORAGE_BAN_KEY, banUntil.toString());
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, MAX_ATTEMPTS.toString());
    localStorage.setItem(STORAGE_REASON_KEY, reason);

    // Track security ban event for Admin Panel
    trackEvent(
      "form_submission",
      `SECURITY ALERT: Visitor banned for 24h (${newAttempts}/${MAX_ATTEMPTS} strikes)`,
      window.location.pathname,
      {
        banned: true,
        reason,
        banUntil: new Date(banUntil).toISOString(),
        durationHours: 24,
      }
    );

    notifyBanUpdate();

    return {
      isBanned: true,
      attempts: MAX_ATTEMPTS,
      maxAttempts: MAX_ATTEMPTS,
      banUntil,
      remainingMs: BAN_DURATION_MS,
      reason,
      visitorId: current.visitorId,
    };
  }

  localStorage.setItem(STORAGE_ATTEMPTS_KEY, newAttempts.toString());
  notifyBanUpdate();

  return {
    isBanned: false,
    attempts: newAttempts,
    maxAttempts: MAX_ATTEMPTS,
    banUntil: null,
    remainingMs: 0,
    reason,
    visitorId: current.visitorId,
  };
}

/**
 * Reset strikes upon a legitimate, successful submission.
 */
export function resetAttemptsOnSuccess(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  notifyBanUpdate();
}

/**
 * Manually unban (used by admin or tests).
 */
export function resetBan(): void {
  if (typeof window === "undefined") return;
  clearBanData();
  notifyBanUpdate();
}

function clearBanData(): void {
  localStorage.removeItem(STORAGE_BAN_KEY);
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  localStorage.removeItem(STORAGE_REASON_KEY);
}

function notifyBanUpdate(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_BAN_UPDATE, { detail: checkBanStatus() }));
}

export function subscribeBanStatus(callback: (status: BanStatus) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback(checkBanStatus());
  window.addEventListener(EVENT_BAN_UPDATE, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_BAN_UPDATE, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Format remaining milliseconds into human-readable countdown string.
 */
export function formatRemainingTime(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

/**
 * Checks for unnecessary, fake, or spam details in form fields.
 */
export function detectUnnecessaryDetails(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
  honeypot?: string;
}): { isUnnecessary: boolean; reason?: string } {
  // 1. Honeypot check (hidden bot field)
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { isUnnecessary: true, reason: "Automated submission detected (honeypot trap filled)." };
  }

  const name = data.name.trim();
  const phone = data.phone.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  // 2. Name validation: repeated characters or gibberish
  if (/(.)\1{4,}/.test(name)) {
    return { isUnnecessary: true, reason: "Name contains repetitive gibberish characters." };
  }
  const dummyNames = ["asdf", "test", "fake", "none", "admin", "user", "nobody", "qwerty", "aaaa"];
  if (dummyNames.includes(name.toLowerCase())) {
    return { isUnnecessary: true, reason: `"${name}" appears to be a dummy or test name.` };
  }

  // 3. Phone validation: repeated digits or dummy numbers
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) {
    return { isUnnecessary: true, reason: "Phone number is too short or invalid." };
  }
  if (/^(\d)\1+$/.test(digits)) {
    return { isUnnecessary: true, reason: "Phone number cannot consist of repetitive identical digits (e.g., 0000000000)." };
  }
  const dummyPhones = ["1234567890", "0123456789", "9876543210", "1111111111", "0000000000", "1234567"];
  if (dummyPhones.includes(digits)) {
    return { isUnnecessary: true, reason: "Phone number appears to be a dummy sequence." };
  }

  // 4. Email validation: dummy domains or obvious fakes
  const dummyEmails = [
    "test@test.com",
    "asdf@asdf.com",
    "fake@fake.com",
    "none@none.com",
    "admin@admin.com",
    "a@a.com",
    "1@1.com",
    "abc@abc.com",
  ];
  if (dummyEmails.includes(email.toLowerCase())) {
    return { isUnnecessary: true, reason: `Email address "${email}" is a known placeholder.` };
  }
  if (/(.)\1{4,}@/.test(email)) {
    return { isUnnecessary: true, reason: "Email address contains repetitive characters." };
  }

  // 5. Message validation: gibberish, spam links, or repeated meaningless text
  if (/(.)\1{5,}/.test(message)) {
    return { isUnnecessary: true, reason: "Message contains repetitive spam characters." };
  }
  const spamKeywords = ["crypto", "bitcoin", "casino", "viagra", "seo ranking", "telegram @", "whatsapp +", "earn $$$", "free money"];
  for (const kw of spamKeywords) {
    if (message.toLowerCase().includes(kw)) {
      return { isUnnecessary: true, reason: `Message contains prohibited marketing or spam phrase: "${kw}".` };
    }
  }

  // Check for repeated words: e.g. "test test test test"
  const words = message.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length >= 4) {
    const firstWord = words[0];
    const allSame = words.every((w) => w === firstWord);
    if (allSame) {
      return { isUnnecessary: true, reason: "Message contains repeated identical words." };
    }
  }

  return { isUnnecessary: false };
}
