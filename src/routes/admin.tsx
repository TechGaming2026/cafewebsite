import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Users,
  MessageCircle,
  Phone,
  ShoppingBag,
  Mail,
  Calendar,
  Clock,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Key,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Power,
  Store,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import {
  getEvents,
  getSubmissions,
  clearAnalyticsData,
  updateSubmissionStatus,
  deleteSubmission,
  type AnalyticsEvent,
  type FormSubmission,
  type EventType,
} from "@/lib/tracker";
import {
  isAuthenticated,
  loginAdmin,
  logoutAdmin,
  getAdminCredentials,
  setAdminCredentials,
} from "@/lib/adminAuth";
import {
  getSiteStatus,
  setSiteStatus,
  toggleSiteStatus,
  subscribeSiteStatus,
  type SiteStatus,
} from "@/lib/siteStatus";
import { resetBan } from "@/lib/formProtection";
import { SITE } from "@/lib/site";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/admin")({
  head: () => meta("Admin Portal — FIKA Cafe", "Restricted administration dashboard."),
  component: AdminPage,
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Login form state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<"activity" | "submissions" | "pages" | "settings">("activity");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Settings state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Website Open / Close state
  const [siteStatus, setSiteStatusState] = useState<SiteStatus>(getSiteStatus());
  const [closureNoticeText, setClosureNoticeText] = useState("");
  const [reopenTimeText, setReopenTimeText] = useState("");
  const [statusFeedback, setStatusFeedback] = useState("");

  useEffect(() => {
    setMounted(true);
    const isAuth = isAuthenticated();
    setAuthed(isAuth);
    if (isAuth) {
      loadData();
    }
    const currentStatus = getSiteStatus();
    setSiteStatusState(currentStatus);
    setClosureNoticeText(currentStatus.closedMessage);
    setReopenTimeText(currentStatus.reopenTime);

    // Subscribe to site status updates
    const unsubStatus = subscribeSiteStatus((newStatus) => {
      setSiteStatusState(newStatus);
      setClosureNoticeText(newStatus.closedMessage);
      setReopenTimeText(newStatus.reopenTime);
    });

    return unsubStatus;
  }, []);

  const loadData = () => {
    setEvents(getEvents());
    setSubmissions(getSubmissions());
  };

  const handleToggleSiteStatus = () => {
    const updated = toggleSiteStatus();
    setSiteStatusState(updated);
    setStatusFeedback(
      updated.isOpen
        ? "Website is now LIVE & OPEN to public visitors!"
        : "Website is now TEMPORARILY CLOSED. Visitors see the closure notice."
    );
    setTimeout(() => setStatusFeedback(""), 4500);
  };

  const handleSaveStatusNotice = (e: FormEvent) => {
    e.preventDefault();
    const updated = setSiteStatus({
      closedMessage: closureNoticeText.trim() || undefined,
      reopenTime: reopenTimeText.trim() || undefined,
    });
    setSiteStatusState(updated);
    setStatusFeedback("Closure announcement details updated successfully!");
    setTimeout(() => setStatusFeedback(""), 4500);
  };

  // Form ban management state
  const [banNotice, setBanNotice] = useState("");

  const handleResetFormBans = () => {
    resetBan();
    setBanNotice("Visitor form bans and attempt strikes have been cleared successfully!");
    setTimeout(() => setBanNotice(""), 4500);
  };

  // Listen to live events if user has admin tab open while interacting
  useEffect(() => {
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("fika_analytics_update", handleUpdate);
    window.addEventListener("fika_submissions_update", handleUpdate);
    return () => {
      window.removeEventListener("fika_analytics_update", handleUpdate);
      window.removeEventListener("fika_submissions_update", handleUpdate);
    };
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = loginAdmin(loginUser, loginPass);
    if (res.success) {
      setAuthed(true);
      loadData();
    } else {
      setLoginError(res.error || "Authentication failed");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthed(false);
    setLoginUser("");
    setLoginPass("");
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all tracked analytics and inquiries? This cannot be undone.")) {
      clearAnalyticsData();
      loadData();
    }
  };

  const handleExportData = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: stats,
      submissions,
      events,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fika_cafe_analytics_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveCredentials = (e: FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (!newUsername.trim()) {
      setSettingsError("Username cannot be empty.");
      return;
    }
    if (newPassword.length < 8) {
      setSettingsError("Password must be at least 8 characters.");
      return;
    }

    const success = setAdminCredentials(newUsername, newPassword);
    if (success) {
      setSettingsSuccess("Credentials updated successfully! Use these next time you log in.");
      setNewPassword("");
    } else {
      setSettingsError("Failed to update credentials.");
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const pageViews = events.filter((e) => e.type === "page_view").length;
    const whatsappClicks = events.filter((e) => e.type === "whatsapp_click").length;
    const contactClicks = events.filter((e) => e.type === "contact_click").length;
    const orderClicks = events.filter((e) => e.type === "order_click").length;
    const callClicks = events.filter((e) => e.type === "call_click").length;
    const uniqueVisitors = new Set(events.map((e) => e.visitorId)).size;
    const newSubmissionsCount = submissions.filter((s) => s.status === "new").length;

    return {
      pageViews,
      whatsappClicks,
      contactClicks,
      orderClicks,
      callClicks,
      uniqueVisitors,
      totalSubmissions: submissions.length,
      newSubmissionsCount,
    };
  }, [events, submissions]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        e.label.toLowerCase().includes(q) ||
        e.page.toLowerCase().includes(q) ||
        e.visitorId.toLowerCase().includes(q) ||
        e.device.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [events, typeFilter, searchQuery]);

  // Page breakdown
  const pageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events
      .filter((e) => e.type === "page_view")
      .forEach((e) => {
        counts[e.page] = (counts[e.page] || 0) + 1;
      });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [events]);

  // Device breakdown
  const deviceStats = useMemo(() => {
    const counts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    events.forEach((e) => {
      counts[e.device] = (counts[e.device] || 0) + 1;
    });
    const total = events.length || 1;
    return {
      Desktop: Math.round((counts.Desktop / total) * 100),
      Mobile: Math.round((counts.Mobile / total) * 100),
      Tablet: Math.round((counts.Tablet / total) * 100),
      raw: counts,
    };
  }, [events]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // -----------------------------
  // LOGIN SCREEN
  // -----------------------------
  if (!authed) {
    const defaultCreds = getAdminCredentials();
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-ink/5">
        <div className="w-full max-w-md bg-card border border-border shadow-xl rounded-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <p className="eyebrow text-primary">Restricted Access</p>
            <h1 className="mt-2 font-serif text-3xl text-foreground">FIKA Admin Portal</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in to view visitor analytics, order clicks, WhatsApp tracking, and customer inquiries.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 flex items-center gap-2 p-3 text-xs rounded-sm bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. admin_fika_2026"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter strong password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full rounded-sm border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn bg-primary text-primary-foreground hover:opacity-90 justify-center py-3 mt-2"
            >
              <ShieldCheck className="h-4 w-4" /> Authenticate & Access
            </button>
          </form>

          {/* Secure Default Credentials Info Box */}
          <div className="mt-8 border-t pt-5 text-xs text-muted-foreground bg-background/60 p-4 rounded-sm border">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-primary" /> Configured Admin Credentials:
            </p>
            <div className="mt-2 space-y-1 font-mono text-[11px] bg-card p-2 rounded border">
              <p>Username: <strong className="text-foreground">{defaultCreds.username}</strong></p>
              <p>Password: <strong className="text-foreground">{defaultCreds.password}</strong></p>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Tip: You can customize your username and password anytime in Admin Settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -----------------------------
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur px-5 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif text-lg font-bold">
              F
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-medium tracking-tight">FIKA Admin Portal</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                  Live Analytics
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Dedicated management & tracking panel · 28 Kensington Ave
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Quick Website Status Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSiteStatus}
              title={
                siteStatus.isOpen
                  ? "Click to temporarily close website for visitors"
                  : "Click to reopen website to public visitors"
              }
              className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-sm border transition-all ${
                siteStatus.isOpen
                  ? "border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100"
                  : "border-rose-600/50 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 ring-2 ring-rose-500/30"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  siteStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className="font-semibold">
                {siteStatus.isOpen ? "Site: OPEN" : "Site: CLOSED"}
              </span>
              <span className="text-[10px] hidden md:inline opacity-75">
                {siteStatus.isOpen ? "(Click to Close)" : "(Click to Open)"}
              </span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Public Website</span> <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={handleExportData}
              title="Export all tracked data to JSON"
              className="inline-flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-sm hover:bg-background transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleClearData}
              title="Reset analytics and form records"
              className="inline-flex items-center gap-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-sm transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn border border-foreground/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive text-xs py-1.5 px-3"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-8 md:px-10">
        {/* Status Feedback Toast */}
        {statusFeedback && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{statusFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback("")}
              className="text-[11px] underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Website Open / Close Operations Banner */}
        <div
          className={`mb-8 rounded-sm border p-5 shadow-sm transition-all ${
            siteStatus.isOpen
              ? "border-border bg-card"
              : "border-rose-600/40 bg-rose-50/40 dark:bg-rose-950/20"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${
                  siteStatus.isOpen
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    Website Status:
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      siteStatus.isOpen
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        siteStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`}
                    />
                    {siteStatus.isOpen ? "LIVE & OPEN TO VISITORS" : "TEMPORARILY CLOSED (OFFLINE)"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {siteStatus.isOpen
                    ? "Visitors can freely browse the full café website, menu, visit guide, and submit contact inquiries."
                    : "Public visitors currently see a Swedish-inspired closure notice with your custom announcement and direct contact options. Admin access remains open."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  Last updated: {new Date(siteStatus.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSiteStatus}
                className={`btn py-2 px-4 text-xs font-semibold shadow-sm transition-all ${
                  siteStatus.isOpen
                    ? "border border-rose-600/40 bg-rose-600 text-white hover:bg-rose-700 hover:border-rose-700"
                    : "border border-emerald-600/40 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700"
                }`}
              >
                <Power className="h-4 w-4" />
                {siteStatus.isOpen ? "Close Website Now" : "Reopen Website to Public"}
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn border border-border hover:bg-background text-xs py-2 px-3"
              >
                <span>{siteStatus.isOpen ? "Visit Live Site" : "Preview Closed Screen"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Notice Customization Collapsible */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <details className="group">
              <summary className="cursor-pointer list-none text-xs font-medium text-primary hover:underline flex items-center gap-1.5 select-none">
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                <span>Customize Closure Notice Message & Reopen Time</span>
              </summary>

              <form
                onSubmit={handleSaveStatusNotice}
                className="mt-4 grid gap-4 sm:grid-cols-2 bg-background/50 p-4 rounded-sm border border-border"
              >
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Visitor Closure Announcement
                  </label>
                  <textarea
                    rows={2}
                    value={closureNoticeText}
                    onChange={(e) => setClosureNoticeText(e.target.value)}
                    placeholder="e.g. FIKA Cafe is temporarily closed today for private catering and roasting. See you tomorrow!"
                    className="w-full rounded-sm border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    This message is displayed prominently to all visitors whenever the website is closed.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Expected Reopening Note
                  </label>
                  <input
                    type="text"
                    value={reopenTimeText}
                    onChange={(e) => setReopenTimeText(e.target.value)}
                    placeholder="e.g. Tomorrow at 8:00 AM"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex items-end justify-start sm:justify-end gap-2">
                  <button
                    type="submit"
                    className="btn bg-primary text-primary-foreground hover:opacity-90 text-xs py-2 px-4 font-semibold"
                  >
                    Save Notice Details
                  </button>
                </div>
              </form>
            </details>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Page Views */}
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="eyebrow">Website Views</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold">{stats.pageViews}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across <strong className="text-foreground">{stats.uniqueVisitors}</strong> unique visitor sessions
            </p>
          </div>

          {/* WhatsApp Clicks */}
          <div className="rounded-sm border border-emerald-600/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-sm">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
              <span className="eyebrow">WhatsApp Clicks</span>
              <MessageCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-emerald-950 dark:text-emerald-100">
              {stats.whatsappClicks}
            </p>
            <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
              High-intent chat inquiries
            </p>
          </div>

          {/* Contact Button Clicks */}
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="eyebrow">Contact Clicks</span>
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold">{stats.contactClicks}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Header, hero & visit contact buttons
            </p>
          </div>

          {/* Order & Shop Clicks */}
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="eyebrow">Order Clicks</span>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold">{stats.orderClicks}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Online shop, gift cards & retail
            </p>
          </div>

          {/* Inquiries / Form Submissions */}
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="eyebrow">Form Messages</span>
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="font-serif text-3xl font-semibold">{stats.totalSubmissions}</p>
              {stats.newSubmissionsCount > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  {stats.newSubmissionsCount} new
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct customer contact submissions
            </p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mt-8 border-b border-border flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "activity"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-4 w-4" /> Live Tracking Feed ({filteredEvents.length})
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors relative ${
              activeTab === "submissions"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4" /> Contact Inquiries ({submissions.length})
            {stats.newSubmissionsCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "pages"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-4 w-4" /> Views & Devices
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "settings"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" /> Security Settings
          </button>
        </div>

        {/* TAB 1: LIVE TRACKING FEED */}
        {activeTab === "activity" && (
          <div className="mt-6 space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-sm border border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Type:
                </span>
                {(
                  [
                    { id: "all", label: "All Events" },
                    { id: "page_view", label: "Page Views" },
                    { id: "whatsapp_click", label: "WhatsApp" },
                    { id: "contact_click", label: "Contact" },
                    { id: "order_click", label: "Orders/Shop" },
                    { id: "call_click", label: "Calls" },
                    { id: "form_submission", label: "Forms" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTypeFilter(tab.id)}
                    className={`text-xs px-2.5 py-1 rounded-sm transition-colors ${
                      typeFilter === tab.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search events, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-sm border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Events Table */}
            <div className="rounded-sm border border-border bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Action / Button Label</th>
                      <th className="py-3 px-4">Page Location</th>
                      <th className="py-3 px-4">Device / Browser</th>
                      <th className="py-3 px-4">Visitor Session</th>
                      <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          No events recorded matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <BadgeForEventType type={evt.type} />
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground">
                            {evt.label}
                            {evt.metadata?.targetUrl && (
                              <span className="block text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                                {String(evt.metadata.targetUrl)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {evt.page}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <DeviceIcon device={evt.device} />
                              <span>{evt.device}</span>
                              <span className="text-[10px] text-muted-foreground/70">({evt.browser})</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            <span title={evt.visitorId}>{evt.visitorId.slice(0, 10)}...</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground text-right whitespace-nowrap">
                            {evt.dateFormatted}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT INQUIRIES */}
        {activeTab === "submissions" && (
          <div className="mt-6 space-y-4">
            {/* Anti-Spam & 3-Attempt Ban Protection Card */}
            <div className="rounded-sm border border-border bg-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-base font-medium text-foreground">
                      Form Protection & Anti-Spam System
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Active · 3-Attempt Limit / 24h Ban
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Visitors submitting unnecessary or repetitive dummy details are restricted for 24 hours after 3 attempts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFormBans}
                  className="btn border border-border hover:bg-background text-xs py-1.5 px-3 whitespace-nowrap"
                  title="Clear any active visitor form bans and reset attempt strikes"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Form Bans</span>
                </button>
              </div>
            </div>

            {banNotice && (
              <div className="p-3 text-xs rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{banNotice}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-foreground">Customer Inquiries</h2>
                <p className="text-xs text-muted-foreground">
                  Messages submitted through the contact form with quick action shortcuts.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Total: <strong className="text-foreground">{submissions.length}</strong>
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-sm border border-border bg-card p-12 text-center text-muted-foreground">
                <Mail className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="font-medium text-foreground">No form inquiries received yet.</p>
                <p className="text-xs mt-1">Submissions from /contact and the home contact form will show up here.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`rounded-sm border bg-card p-6 space-y-4 shadow-sm transition-all ${
                      sub.status === "new"
                        ? "border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b pb-3">
                      <div>
                        <h3 className="font-serif text-xl font-medium text-foreground">{sub.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {sub.dateFormatted} · from {sub.page}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={sub.status}
                          onChange={(e) =>
                            updateSubmissionStatus(sub.id, e.target.value as "new" | "contacted" | "resolved")
                          }
                          className="text-xs rounded-sm border border-border bg-background px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => deleteSubmission(sub.id)}
                          title="Delete inquiry"
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Phone</span>
                        <a href={`tel:${sub.phone}`} className="font-medium text-foreground hover:underline">
                          {sub.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Email</span>
                        <a href={`mailto:${sub.email}`} className="font-medium text-foreground hover:underline truncate block">
                          {sub.email}
                        </a>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="bg-background/80 p-3.5 rounded-sm border border-border text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {sub.message}
                    </div>

                    {/* Quick Respond Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t text-xs">
                      <a
                        href={`https://wa.me/${sub.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                          `Hello ${sub.name}, thank you for contacting FIKA Cafe! Regarding your inquiry: `
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Customer
                      </a>
                      <a
                        href={`tel:${sub.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-background hover:bg-muted text-foreground transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> Direct Call
                      </a>
                      <a
                        href={`mailto:${sub.email}?subject=${encodeURIComponent("FIKA Cafe — Inquiry Follow-up")}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-background hover:bg-muted text-foreground transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAGES & DEVICE BREAKDOWN */}
        {activeTab === "pages" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Most Visited Pages */}
            <div className="rounded-sm border border-border bg-card p-6 space-y-4 shadow-sm">
              <div className="border-b pb-3">
                <p className="eyebrow text-primary">Content Popularity</p>
                <h3 className="mt-1 font-serif text-2xl text-foreground">Views by Page</h3>
              </div>

              <div className="space-y-3">
                {pageStats.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No page views recorded yet.</p>
                ) : (
                  pageStats.map(([page, count]) => {
                    const percentage = Math.round((count / (stats.pageViews || 1)) * 100);
                    return (
                      <div key={page} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-mono font-medium text-foreground">{page}</span>
                          <span className="text-muted-foreground">
                            {count} views ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Device & Platform Breakdown */}
            <div className="rounded-sm border border-border bg-card p-6 space-y-4 shadow-sm">
              <div className="border-b pb-3">
                <p className="eyebrow text-primary">Visitor Platforms</p>
                <h3 className="mt-1 font-serif text-2xl text-foreground">Device Distribution</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-sm border bg-background space-y-2">
                  <Monitor className="mx-auto h-6 w-6 text-primary" />
                  <p className="text-xs text-muted-foreground">Desktop</p>
                  <p className="font-serif text-2xl font-bold">{deviceStats.Desktop}%</p>
                  <p className="text-[10px] text-muted-foreground">({deviceStats.raw.Desktop} events)</p>
                </div>

                <div className="p-4 rounded-sm border bg-background space-y-2">
                  <Smartphone className="mx-auto h-6 w-6 text-emerald-600" />
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="font-serif text-2xl font-bold">{deviceStats.Mobile}%</p>
                  <p className="text-[10px] text-muted-foreground">({deviceStats.raw.Mobile} events)</p>
                </div>

                <div className="p-4 rounded-sm border bg-background space-y-2">
                  <Tablet className="mx-auto h-6 w-6 text-amber-600" />
                  <p className="text-xs text-muted-foreground">Tablet</p>
                  <p className="font-serif text-2xl font-bold">{deviceStats.Tablet}%</p>
                  <p className="text-[10px] text-muted-foreground">({deviceStats.raw.Tablet} events)</p>
                </div>
              </div>

              <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Conversion Highlights:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    WhatsApp conversion:{" "}
                    <strong>{stats.pageViews > 0 ? ((stats.whatsappClicks / stats.pageViews) * 100).toFixed(1) : 0}%</strong> of
                    visitors clicked WhatsApp
                  </li>
                  <li>
                    Order intent:{" "}
                    <strong>{stats.pageViews > 0 ? ((stats.orderClicks / stats.pageViews) * 100).toFixed(1) : 0}%</strong> clicked
                    shop or gift card links
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY SETTINGS */}
        {activeTab === "settings" && (
          <div className="mt-6 max-w-xl space-y-6">
            <div className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <p className="eyebrow text-primary">Access Management</p>
                <h3 className="mt-1 font-serif text-2xl text-foreground">Update Admin Credentials</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Protect this admin portal with a strong username and password of your choice.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3 text-xs rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {settingsError && (
                <div className="p-3 text-xs rounded-sm bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                    New Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new admin username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                    New Strong Password (min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-primary text-primary-foreground hover:opacity-90 py-2.5 px-4 text-xs font-semibold"
                >
                  Save New Credentials
                </button>
              </form>

              <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Security Note:</p>
                <p>
                  No link to this admin portal is displayed anywhere on the public website. Keep the URL{" "}
                  <code className="text-primary font-mono bg-muted/50 px-1 py-0.5 rounded">/admin</code> bookmarked privately.
                </p>
              </div>
            </div>

            {/* Website Status & Closure Settings Card */}
            <div className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <p className="eyebrow text-primary">Website Operations</p>
                <h3 className="mt-1 font-serif text-2xl text-foreground">Website Status Control</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Quickly close the website for private events, holidays, or maintenance.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-sm border bg-background">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-sm ${
                      siteStatus.isOpen
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Current Status
                    </p>
                    <p className="text-sm font-serif font-medium">
                      {siteStatus.isOpen ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Open to Public Visitors</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">Temporarily Closed</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSiteStatus}
                  className={`btn py-2 px-3.5 text-xs font-semibold ${
                    siteStatus.isOpen
                      ? "border border-rose-600/40 bg-rose-600 text-white hover:bg-rose-700"
                      : "border border-emerald-600/40 bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  {siteStatus.isOpen ? "Close Website" : "Open Website"}
                </button>
              </div>

              <form onSubmit={handleSaveStatusNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                    Visitor Announcement Message
                  </label>
                  <textarea
                    rows={3}
                    value={closureNoticeText}
                    onChange={(e) => setClosureNoticeText(e.target.value)}
                    placeholder="e.g. FIKA Cafe is closed today for private catering and roasting. We look forward to seeing you tomorrow!"
                    className="w-full rounded-sm border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                    Expected Reopening Time
                  </label>
                  <input
                    type="text"
                    value={reopenTimeText}
                    onChange={(e) => setReopenTimeText(e.target.value)}
                    placeholder="e.g. Tomorrow at 8:00 AM"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="btn bg-primary text-primary-foreground hover:opacity-90 py-2.5 px-4 text-xs font-semibold"
                  >
                    Save Notice Details
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn border border-border hover:bg-background text-xs py-2 px-3"
                  >
                    Preview Page
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BadgeForEventType({ type }: { type: EventType }) {
  switch (type) {
    case "page_view":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <Eye className="h-3 w-3" /> Page View
        </span>
      );
    case "whatsapp_click":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <MessageCircle className="h-3 w-3" /> WhatsApp Click
        </span>
      );
    case "contact_click":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20">
          <Mail className="h-3 w-3" /> Contact Click
        </span>
      );
    case "order_click":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShoppingBag className="h-3 w-3" /> Order Click
        </span>
      );
    case "call_click":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
          <Phone className="h-3 w-3" /> Phone Call
        </span>
      );
    case "form_submission":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
          <CheckCircle2 className="h-3 w-3" /> Form Submitted
        </span>
      );
    default:
      return <span className="text-xs text-muted-foreground">{type}</span>;
  }
}

function DeviceIcon({ device }: { device: "Desktop" | "Mobile" | "Tablet" }) {
  if (device === "Mobile") return <Smartphone className="h-3.5 w-3.5 text-emerald-600" />;
  if (device === "Tablet") return <Tablet className="h-3.5 w-3.5 text-amber-600" />;
  return <Monitor className="h-3.5 w-3.5 text-primary" />;
}
