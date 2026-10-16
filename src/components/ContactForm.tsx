import { useState, useEffect, type FormEvent } from "react";
import {
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Loader2,
  MessageCircle,
  ShieldAlert,
  Clock,
  Instagram,
  Lock,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { saveFormSubmission, trackCallClick, trackWhatsAppClick } from "@/lib/tracker";
import {
  checkBanStatus,
  recordFailedAttempt,
  resetAttemptsOnSuccess,
  formatRemainingTime,
  detectUnnecessaryDetails,
  subscribeBanStatus,
  MAX_ATTEMPTS,
  type BanStatus,
} from "@/lib/formProtection";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  general?: string;
}

export function ContactForm({ className = "" }: { className?: string }) {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Honeypot field for trapping automated spam bots
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [lastSubmitted, setLastSubmitted] = useState<FormState | null>(null);

  // 24-hour Ban & Attempt Protection State
  const [banStatus, setBanStatus] = useState<BanStatus>(checkBanStatus());
  const [remainingTimeText, setRemainingTimeText] = useState("");

  // Keep countdown updated every second when banned
  useEffect(() => {
    setBanStatus(checkBanStatus());

    const unsub = subscribeBanStatus((newStatus) => {
      setBanStatus(newStatus);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!banStatus.isBanned || !banStatus.banUntil) return;

    const updateCountdown = () => {
      const remainingMs = (banStatus.banUntil || 0) - Date.now();
      if (remainingMs <= 0) {
        setBanStatus(checkBanStatus());
        setRemainingTimeText("0s");
      } else {
        setRemainingTimeText(formatRemainingTime(remainingMs));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [banStatus.isBanned, banStatus.banUntil]);

  const validate = (): { isValid: boolean; reason?: string } => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const cleanPhone = formData.phone.replace(/[^\d+]/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (cleanPhone.length < 7) {
      newErrors.phone = "Please enter a valid phone number (minimum 7 digits).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please write a message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      const firstError = Object.values(newErrors)[0];
      return { isValid: false, reason: firstError };
    }

    return { isValid: true };
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        delete next.general;
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 1. Check if already banned
    const currentBan = checkBanStatus();
    if (currentBan.isBanned) {
      setBanStatus(currentBan);
      return;
    }

    // 2. Perform field validation
    const validation = validate();
    if (!validation.isValid) {
      // Record unnecessary / invalid attempt strike
      const updated = recordFailedAttempt(validation.reason || "Incomplete required fields.");
      setBanStatus(updated);
      return;
    }

    // 3. Deep check for unnecessary details / spam patterns
    const spamCheck = detectUnnecessaryDetails({
      ...formData,
      honeypot,
    });

    if (spamCheck.isUnnecessary) {
      // Record strike for unnecessary/spam details
      const reason = spamCheck.reason || "Unnecessary or gibberish details detected.";
      const updated = recordFailedAttempt(reason);
      setBanStatus(updated);
      setErrors((prev) => ({
        ...prev,
        general: reason,
      }));
      return;
    }

    // 4. Valid genuine submission!
    setStatus("submitting");

    // Persist submission for admin panel
    saveFormSubmission(formData);

    // Reset attempt strikes since user successfully submitted genuine details
    resetAttemptsOnSuccess();

    setTimeout(() => {
      setLastSubmitted({ ...formData });
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });
      setErrors({});
    }, 750);
  };

  const handleReset = () => {
    setStatus("idle");
    setLastSubmitted(null);
  };

  // -------------------------------------------------------------
  // VIEW 1: 24-HOUR BAN LOCKOUT SCREEN
  // -------------------------------------------------------------
  if (banStatus.isBanned) {
    return (
      <div
        className={`rounded-sm border border-destructive/40 bg-card p-6 md:p-10 shadow-md text-center animate-fade-in ${className}`}
        aria-live="assertive"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-6 ring-4 ring-destructive/10">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/15 text-destructive text-xs font-semibold mb-3 border border-destructive/30">
          <Lock className="h-3.5 w-3.5" /> 24-Hour Security Restriction Active
        </div>

        <h3 className="font-serif text-2xl md:text-3xl text-foreground font-normal">
          Form Submission Suspended
        </h3>

        <div className="mt-4 max-w-md mx-auto space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You have reached the maximum <strong>{MAX_ATTEMPTS} attempts</strong> with unnecessary or invalid details.
            To protect our café from spam and automated abuse, form submissions from your device are restricted for 24 hours.
          </p>

          {banStatus.reason && (
            <div className="p-2.5 rounded-sm bg-destructive/10 text-destructive text-xs border border-destructive/20 text-left">
              <strong>Strike Reason:</strong> {banStatus.reason}
            </div>
          )}

          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2.5 text-xs font-medium text-foreground border border-border">
            <Clock className="h-4 w-4 text-destructive animate-pulse" />
            <span>
              Restriction expires in: <strong className="font-mono text-sm text-destructive">{remainingTimeText || "24h 00m 00s"}</strong>
            </span>
          </div>
        </div>

        {/* Alternative Genuine Contact Options */}
        <div className="mt-8 pt-6 border-t border-border/80 text-left">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-center mb-4">
            Need urgent assistance? Contact us directly:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE.callUrl}
              onClick={() => trackCallClick("Banned Lockout Call")}
              className="btn border border-[#d9ccba] bg-[#ede5d8]/90 text-[#4d3826] hover:bg-[#faf6f0] text-xs py-2 px-4 rounded-full shadow-2xs"
            >
              <Phone className="h-3.5 w-3.5" /> Call {SITE.phone}
            </a>

            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick("Banned Lockout WhatsApp")}
              className="btn border border-[#c1d9c3] bg-[#e7eee6]/90 text-[#204e30] hover:bg-[#edf5ec] text-xs py-2 px-4 rounded-full shadow-2xs"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Chat
            </a>

            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn border border-pink-500/30 bg-pink-500/10 text-pink-800 dark:text-pink-300 hover:bg-pink-500/20 text-xs py-2 px-4 rounded-full"
            >
              <Instagram className="h-3.5 w-3.5" /> @fikakensington
            </a>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: SUCCESS SCREEN
  // -------------------------------------------------------------
  if (status === "success" && lastSubmitted) {
    return (
      <div className={`rounded-sm border border-border bg-card p-8 md:p-12 text-center animate-fade-in ${className}`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="eyebrow text-primary">Message Sent</p>
        <h3 className="mt-3 font-serif text-3xl md:text-4xl text-foreground">Tack så mycket!</h3>
        <p className="mt-4 max-w-md mx-auto text-muted-foreground leading-relaxed">
          Thank you, <strong className="text-foreground">{lastSubmitted.name}</strong>. We have received your inquiry
          and will get back to you shortly at <span className="text-foreground underline">{lastSubmitted.email}</span> or via phone at <span className="text-foreground">{lastSubmitted.phone}</span>.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="btn border border-foreground/30 hover:bg-background"
          >
            Send Another Message
          </button>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick("Contact Success WhatsApp")}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: ACTIVE CONTACT FORM WITH ATTEMPT STRIKE WARNINGS
  // -------------------------------------------------------------
  const attemptsUsed = banStatus.attempts;
  const attemptsRemaining = MAX_ATTEMPTS - attemptsUsed;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-sm border border-border bg-card p-6 md:p-10 shadow-sm ${className}`}
      aria-label="Contact form"
    >
      {/* Bot Honeypot field (hidden from genuine users) */}
      <input
        type="text"
        name="company_hp"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="border-b pb-5 mb-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="eyebrow text-primary">Get in touch</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/60">
            <ShieldAlert className="h-3 w-3 text-primary" /> Max {MAX_ATTEMPTS} attempts allowed
          </span>
        </div>
        <h3 className="mt-2 font-serif text-3xl md:text-4xl">Send us a message</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about catering, events, retail coffee beans, or visiting? Fill in your genuine details below.
        </p>
      </div>

      {/* Strike Warning Banner if user previously submitted unnecessary or invalid details */}
      {attemptsUsed > 0 && (
        <div
          className={`mb-6 p-4 rounded-sm border text-xs flex items-start gap-3 animate-in fade-in ${
            attemptsUsed >= 2
              ? "bg-destructive/10 border-destructive/40 text-destructive"
              : "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
          }`}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wider text-[11px]">
              {attemptsUsed >= 2 ? "Final Warning: 1 Attempt Remaining" : `Notice: Attempt ${attemptsUsed} of ${MAX_ATTEMPTS} Used`}
            </p>
            <p className="leading-relaxed">
              {attemptsUsed >= 2
                ? `You have used 2 of 3 allowed attempts. If unnecessary or invalid details are submitted once more, form submissions will be locked for 24 hours.`
                : `Please ensure all details are genuine. Users submitting unnecessary or fake details will be suspended for 24 hours after 3 attempts.`}
            </p>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errors.general && (
        <div className="mb-6 p-3.5 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="contact-name" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Name <span className="text-destructive">*</span>
            </span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name (e.g. Astrid Lindgren)"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full rounded-sm border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.name ? "border-destructive ring-1 ring-destructive" : "border-border"
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
            </p>
          )}
        </div>

        {/* Two Columns: Phone and Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Phone Field */}
          <div>
            <label htmlFor="contact-phone" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" /> Phone <span className="text-destructive">*</span>
              </span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91XXXXXXXXXX or local #"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full rounded-sm border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.phone ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
            />
            {errors.phone && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="contact-email" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email <span className="text-destructive">*</span>
              </span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full rounded-sm border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "border-destructive ring-1 ring-destructive" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            <label htmlFor="contact-message" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" /> Message <span className="text-destructive">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground font-normal lowercase">
              {formData.message.length}/1000
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            maxLength={1000}
            placeholder="Tell us about your inquiry, event, catering needs, or coffee orders..."
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className={`w-full resize-y rounded-sm border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.message ? "border-destructive ring-1 ring-destructive" : "border-border"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.message}
            </p>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 justify-center shadow-sm"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Message
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground">
            {attemptsUsed > 0 ? (
              <span className="text-amber-800 dark:text-amber-300 font-medium">
                {attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} left before 24h ban
              </span>
            ) : (
              <>
                Or call us directly at{" "}
                <a href={SITE.callUrl} className="underline text-foreground hover:text-primary">
                  {SITE.phone}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </form>
  );
}
