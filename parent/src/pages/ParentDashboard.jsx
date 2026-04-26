import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CreateTestPanel from "../components/CreateTestPanel";
import TimelineItem from "../components/TimelineItem";
import TopicCard from "../components/TopicCard";
import { TOPIC_LABELS } from "../constants/topics";
import {
  getAIAnalysis,
  getAIRecommendation,
  getAnalytics,
  getChildren,
  getScreenTimeStatus,
  setScreenTimeLimit,
  toggleScreenTimeLock,
} from "../services/api";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "controls", label: "Controls", icon: "controller" },
  { id: "tests", label: "Tests", icon: "clipboard" },
  { id: "insights", label: "Insights", icon: "chart" },
  { id: "history", label: "History", icon: "clock" },
];

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const formatTime = (seconds) => {
  if (!seconds) return "0m";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
};

const formatTimelineDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getUsageStatus = (percent) => {
  if (percent >= 90) {
    return { label: "Critical", textClass: "text-red-500", fillClass: "bg-red-500" };
  }
  if (percent >= 70) {
    return { label: "High", textClass: "text-amber-500", fillClass: "bg-amber-400" };
  }
  return { label: "Healthy", textClass: "text-emerald-500", fillClass: "bg-emerald-500" };
};

const getLevelMeta = (score) => {
  if (score >= 85) return { label: "Advanced", color: "text-emerald-500", spark: "#10b981" };
  if (score >= 60) return { label: "Intermediate", color: "text-violet-500", spark: "#8b5cf6" };
  return { label: "Beginner", color: "text-amber-500", spark: "#f59e0b" };
};

const getTopicTone = (acc) => {
  if (acc >= 75) return { label: "High", color: "text-emerald-500", bar: "bg-emerald-500" };
  if (acc >= 50) return { label: "Medium", color: "text-amber-500", bar: "bg-amber-400" };
  return { label: "Low", color: "text-rose-500", bar: "bg-rose-500" };
};

const getIconForTopic = (topic) => (TOPIC_LABELS[topic] || topic || "AB").slice(0, 2).toUpperCase();

const Icon = ({ name, className = "h-5 w-5" }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    className,
  };

  const icons = {
    home: (
      <svg {...common}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13V10.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
    controller: (
      <svg {...common}>
        <path d="M8 10h8a4 4 0 0 1 3.8 5.2l-.5 1.5a2.5 2.5 0 0 1-4.3.8l-1.2-1.5h-3.6L9 17.5a2.5 2.5 0 0 1-4.3-.8l-.5-1.5A4 4 0 0 1 8 10Z" />
        <path d="M9 13H7" />
        <path d="M8 12v2" />
        <path d="M15.5 12.5h.01" />
        <path d="M17.5 14.5h.01" />
      </svg>
    ),
    clipboard: (
      <svg {...common}>
        <rect x="6" y="5" width="12" height="15" rx="2" />
        <path d="M9 5.5h6" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
        <path d="M10 3.5h4a1 1 0 0 1 1 1V6H9V4.5a1 1 0 0 1 1-1Z" />
      </svg>
    ),
    chart: (
      <svg {...common}>
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
        <path d="M3 19h18" />
      </svg>
    ),
    clock: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
    star: (
      <svg {...common}>
        <path d="m12 4 2.2 4.5L19 9.2l-3.5 3.4.8 4.8L12 15l-4.3 2.4.8-4.8L5 9.2l4.8-.7Z" />
      </svg>
    ),
    rocket: (
      <svg {...common}>
        <path d="M14.5 4.5c2.3 1 4 3.2 4.8 6.3l-4.1-.7-3.3 3.3-.7 4.1c-3.1-.8-5.3-2.5-6.3-4.8l5.3-5.3Z" />
        <path d="m10.1 13.9-2.8 2.8" />
        <circle cx="14.7" cy="9.3" r="1.1" />
      </svg>
    ),
    sparkles: (
      <svg {...common}>
        <path d="m12 4 1.1 3.4L16.5 8l-3.4 1.1L12 12.5l-1.1-3.4L7.5 8l3.4-.6Z" />
        <path d="m18 13 .7 2.1 2.3.7-2.3.7L18 19l-.7-2.5-2.3-.7 2.3-.7Z" />
        <path d="m6 14 .7 2.1 2.3.7-2.3.7L6 20l-.7-2.5-2.3-.7 2.3-.7Z" />
      </svg>
    ),
  };

  return icons[name] || null;
};

const MiniSpark = ({ color = "#3b82f6" }) => (
  <svg viewBox="0 0 120 32" className="h-8 w-28">
    <path
      d="M4 24 C14 24, 18 16, 28 16 S42 24, 52 20 S64 10, 74 18 S90 28, 100 18 S110 10, 116 14"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const SidebarCard = ({ title, subtitle }) => (
  <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
    <div className="mb-4 flex h-20 items-center justify-center rounded-[22px] bg-white/8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/35 bg-gradient-to-br from-amber-100 via-white to-sky-200 text-3xl font-bold text-slate-700">
        {title?.[0] || "C"}
      </div>
    </div>
    <div className="text-center">
      <p className="text-2xl font-extrabold break-words">{title}</p>
      <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      <span className="mt-3 inline-flex rounded-full bg-white/18 px-3 py-1 text-xs font-bold">Active</span>
    </div>
  </div>
);

const StatTile = ({
  iconBg,
  icon,
  title,
  value,
  subtitle,
  valueClass,
  sparkColor,
  valueTextClass = "text-[1.9rem] md:text-[2rem]",
}) => (
  <div className="dashboard-surface rounded-[24px] p-5 lg:p-6">
    <div className="flex items-start gap-4">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`mt-1 break-words font-extrabold leading-tight ${valueTextClass} ${valueClass}`}>
          {value}
        </p>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
    <div className="mt-3 flex justify-end">
      <MiniSpark color={sparkColor} />
    </div>
  </div>
);

const SectionTitle = ({ icon, title, action }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
        {icon}
      </div>
      <h3 className="text-[1.2rem] font-extrabold tracking-tight text-slate-800 md:text-[1.35rem]">
        {title}
      </h3>
    </div>
    {action}
  </div>
);

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [screenTime, setScreenTime] = useState(null);
  const [limitInput, setLimitInput] = useState(60);
  const [screenTimeLoading, setScreenTimeLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const user = safeParse(localStorage.getItem("parentUser"));
  const parentId = user?.id || user?._id || "Unavailable";
  const selectedChildName =
    children.find((child) => child._id === selectedChild)?.name || "Child";

  const fetchDashboardData = async (childId) => {
    setLoading(true);
    setError("");

    try {
      const [analyticsRes, screenRes, aiRes, recRes] = await Promise.all([
        getAnalytics(childId),
        getScreenTimeStatus(childId),
        getAIAnalysis(childId),
        getAIRecommendation(childId),
      ]);

      setAnalytics(analyticsRes.data);
      setScreenTime(screenRes.data);
      setLimitInput(screenRes.data.dailyLimit);
      setAiAnalysis(aiRes.data);
      setAiRecommendation(recRes.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChildren()
      .then(({ data }) => {
        setChildren(data);
        if (data.length > 0) {
          setSelectedChild(data[0]._id);
          fetchDashboardData(data[0]._id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load children.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchDashboardData(selectedChild);
    }
  }, [selectedChild]);

  const handleSetLimit = async () => {
    if (!selectedChild) return;
    setScreenTimeLoading(true);
    try {
      await setScreenTimeLimit({ childId: selectedChild, dailyLimit: limitInput });
      const { data } = await getScreenTimeStatus(selectedChild);
      setScreenTime(data);
    } catch (err) {
      setError(err.message || "Could not set limit.");
    } finally {
      setScreenTimeLoading(false);
    }
  };

  const handleToggleLock = async () => {
    if (!selectedChild || !screenTime) return;
    setScreenTimeLoading(true);
    try {
      await toggleScreenTimeLock({ childId: selectedChild, isLocked: !screenTime.isLocked });
      const { data } = await getScreenTimeStatus(selectedChild);
      setScreenTime(data);
    } catch (err) {
      setError(err.message || "Could not update lock status.");
    } finally {
      setScreenTimeLoading(false);
    }
  };

  const handleToggleLearningOnly = async () => {
    if (!selectedChild || !screenTime) return;
    setScreenTimeLoading(true);
    try {
      await setScreenTimeLimit({
        childId: selectedChild,
        dailyLimit: screenTime.dailyLimit,
        allowLearningOnly: !screenTime.allowLearningOnly,
      });
      const { data } = await getScreenTimeStatus(selectedChild);
      setScreenTime(data);
    } catch (err) {
      setError(err.message || "Could not update learning-only mode.");
    } finally {
      setScreenTimeLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("parentToken");
    localStorage.removeItem("parentUser");
    localStorage.removeItem("parentSessionExpiresAt");
    navigate("/login");
  };

  const usageStatus = getUsageStatus(screenTime?.percentUsed || 0);
  const levelMeta = getLevelMeta(analytics?.overview?.averageAccuracy || 0);
  const bestStrongTopic = analytics?.strongTopics?.[0];
  const strongestLabel = bestStrongTopic
    ? TOPIC_LABELS[bestStrongTopic.topic] || bestStrongTopic.topic
    : "None";

  const showOverview = activeSection === "overview";
  const showControls = showOverview || activeSection === "controls";
  const showInsights = showOverview || activeSection === "insights";
  const showHistory = showOverview || activeSection === "history";
  const showTests = activeSection === "tests";

  const statTiles = analytics
    ? [
        {
          title: "Total Learning Time",
          value: formatTime(analytics.overview.totalTimeSpent),
          subtitle: "Across all topics",
          valueClass: "text-sky-500",
          sparkColor: "#3b82f6",
          iconBg: "bg-sky-100 text-sky-500",
          icon: <Icon name="clock" className="h-6 w-6" />,
        },
        {
          title: "Total Sessions",
          value: analytics.overview.totalSessions,
          subtitle: "Games and tests played",
          valueClass: "text-emerald-500",
          sparkColor: "#22c55e",
          iconBg: "bg-emerald-100 text-emerald-500",
          icon: <Icon name="controller" className="h-6 w-6" />,
        },
        {
          title: "Average Accuracy",
          value: `${analytics.overview.averageAccuracy}%`,
          subtitle:
            analytics.overview.averageAccuracy >= 75
              ? "High"
              : analytics.overview.averageAccuracy >= 50
              ? "Medium"
              : "Needs support",
          valueClass: "text-violet-500",
          sparkColor: "#8b5cf6",
          iconBg: "bg-fuchsia-100 text-fuchsia-500",
          icon: <Icon name="chart" className="h-6 w-6" />,
        },
        {
          title: "Current Level",
          value: levelMeta.label,
          subtitle: "Keep learning",
          valueClass: levelMeta.color,
          sparkColor: levelMeta.spark,
          iconBg: "bg-amber-100 text-amber-500",
          icon: <Icon name="star" className="h-6 w-6" />,
          valueTextClass: "text-[1.45rem] md:text-[1.7rem]",
        },
      ]
    : [];

  const topicRows = (analytics?.topics || []).slice(0, 4);
  const timelinePreview = (analytics?.timeline || []).slice(0, 4);
  const donutAccuracy = analytics?.overview?.averageAccuracy || 0;

  return (
    <div className="parent-shell min-h-screen">
      <aside className="parent-sidebar hidden xl:flex">
        <nav className="space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-900/25"
                  : "text-white/82 hover:bg-white/10"
              }`}
            >
              <Icon name={section.icon} className="h-5 w-5" />
              {section.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <SidebarCard title={selectedChildName} subtitle="Current child" />
        </div>
      </aside>

      <main className="parent-main">
        <div className="parent-main-bg" aria-hidden="true">
          <div className="parent-orb parent-orb-a" />
          <div className="parent-orb parent-orb-b" />
          <div className="parent-orb parent-orb-c" />
          <div className="parent-dots" />
          <div className="parent-wave" />
        </div>

        <div className="relative z-10">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-slate-800 md:text-[2.3rem]">
                Welcome back, {user?.name || "Parent"}!
              </h1>
              <p className="mt-2 text-base text-slate-500 md:text-lg">
                Here&apos;s how{" "}
                <span className="font-semibold text-indigo-500">{selectedChildName}</span> is learning today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="xl:hidden">
                <select
                  value={activeSection}
                  onChange={(event) => setActiveSection(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none"
                >
                  {SECTIONS.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              {children.length > 0 && (
                <select
                  value={selectedChild || ""}
                  onChange={(event) => setSelectedChild(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none"
                >
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Sign Out
              </button>
            </div>
          </header>

          {!loading && children.length === 0 && (
            <div className="dashboard-surface mt-8 rounded-[28px] p-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                <Icon name="star" className="h-9 w-9" />
              </div>
              <h2 className="mt-5 text-3xl font-extrabold text-slate-800">No children linked yet</h2>
              <p className="mt-2 text-slate-500">
                Register a child account linked to your Parent ID to start tracking progress.
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Your Parent ID: <span className="font-mono font-bold text-slate-700">{parentId}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="dashboard-surface mt-6 flex flex-col gap-3 rounded-[24px] border border-rose-200 bg-rose-50/90 p-4 text-rose-700 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold">{error}</span>
              {selectedChild && (
                <button
                  type="button"
                  onClick={() => fetchDashboardData(selectedChild)}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-600"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <p className="mt-4 text-sm font-medium text-slate-500">Loading dashboard...</p>
              </div>
            </div>
          )}

          {!loading && analytics && (
            <div className="mt-8 space-y-6">
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-4">
                {statTiles.map((tile) => (
                  <StatTile key={tile.title} {...tile} />
                ))}
              </section>

              {showControls && (
                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.02fr_1.08fr]">
                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle icon={<Icon name="clock" className="h-5 w-5" />} title="Screen Time Control" />

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-600">
                          Daily Limit (minutes)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            type="number"
                            min={5}
                            max={480}
                            value={limitInput}
                            onChange={(event) => setLimitInput(Number(event.target.value))}
                            className="w-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSetLimit}
                            disabled={screenTimeLoading}
                            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-105 disabled:opacity-50"
                          >
                            Set
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-600">Today&apos;s Usage</span>
                          <span className={`text-sm font-bold ${usageStatus.textClass}`}>
                            {screenTime?.percentUsed || 0}% - {usageStatus.label}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">
                          {screenTime?.usedMinutes || 0}m / {screenTime?.dailyLimit || limitInput}m
                        </p>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${usageStatus.fillClass}`}
                            style={{ width: `${Math.min(screenTime?.percentUsed || 0, 100)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleLock}
                        disabled={screenTimeLoading || !screenTime}
                        className="flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        {screenTime?.isLocked ? "Unlock App" : "Lock App Now"}
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleLearningOnly}
                        disabled={screenTimeLoading || !screenTime}
                        className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {screenTime?.allowLearningOnly
                          ? "Learning-Only Mode: ON"
                          : "Enable Learning-Only Mode"}
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle
                      icon={<Icon name="chart" className="h-5 w-5" />}
                      title="Weekly Activity (Sessions)"
                      action={
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">
                          Last 7 Days
                        </div>
                      }
                    />

                    {analytics.last7Days.some((entry) => entry.sessions > 0) ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.last7Days} barCategoryGap={26}>
                          <CartesianGrid vertical={false} stroke="#e7eaf5" />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(139, 92, 246, 0.06)" }}
                            contentStyle={{
                              borderRadius: "18px",
                              border: "1px solid #ececf5",
                              boxShadow: "0 18px 45px rgba(79, 70, 229, 0.12)",
                            }}
                          />
                          <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                            {analytics.last7Days.map((entry, index) => (
                              <Cell
                                key={`${entry.day}-${index}`}
                                fill={index % 2 === 0 ? "#7c6cf2" : "#a26df3"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-[250px] items-center justify-center rounded-[24px] bg-slate-50 text-sm font-semibold text-slate-400">
                        No activity in the last 7 days
                      </div>
                    )}
                  </div>
                </section>
              )}

              {showInsights && (
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-[1.05fr_0.95fr_0.9fr_1fr]">
                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle icon={<Icon name="chart" className="h-5 w-5" />} title="Topic Accuracy" />

                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                      <div
                        className="mx-auto flex h-44 w-44 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(#34d399 0 ${Math.max(
                            Math.min(donutAccuracy, 100) * 1.5,
                            20
                          )}deg, #fbbf24 ${Math.max(
                            Math.min(donutAccuracy, 100) * 1.5,
                            20
                          )}deg ${Math.max(Math.min(donutAccuracy, 100) * 2.8, 130)}deg, #fb7185 ${Math.max(
                            Math.min(donutAccuracy, 100) * 2.8,
                            130
                          )}deg 360deg)`,
                        }}
                      >
                        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                          <p className="text-[2rem] font-extrabold text-slate-800">{donutAccuracy}%</p>
                          <p className="text-sm text-slate-500">Overall</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-700">Strong</p>
                            <p className="text-sm text-slate-500">{analytics.strongTopics.length} topic</p>
                          </div>
                          <span className="text-sm font-extrabold text-emerald-500">
                            {analytics.strongTopics[0]?.averageAccuracy || 0}%
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-700">Medium</p>
                            <p className="text-sm text-slate-500">
                              {
                                analytics.topics.filter(
                                  (item) => item.averageAccuracy >= 50 && item.averageAccuracy < 75
                                ).length
                              }{" "}
                              topic
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-amber-500">
                            {analytics.topics.find(
                              (item) => item.averageAccuracy >= 50 && item.averageAccuracy < 75
                            )?.averageAccuracy || 0}
                            %
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-700">Weak</p>
                            <p className="text-sm text-slate-500">{analytics.weakTopics.length} topic</p>
                          </div>
                          <span className="text-sm font-extrabold text-rose-500">
                            {analytics.weakTopics[0]?.averageAccuracy || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle
                      icon={<Icon name="sparkles" className="h-5 w-5" />}
                      title="Strong Areas (High)"
                    />

                    {bestStrongTopic ? (
                      <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-extrabold text-white">
                            {getIconForTopic(bestStrongTopic.topic)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800">{strongestLabel}</p>
                            <p className="text-sm text-slate-500">
                              {bestStrongTopic.totalAttempts || 1} attempt
                              {bestStrongTopic.totalAttempts !== 1 ? "s" : ""} - In progress
                            </p>
                          </div>
                          <span className="text-lg font-extrabold text-emerald-500">
                            {bestStrongTopic.averageAccuracy}%
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${bestStrongTopic.averageAccuracy}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          Best: {bestStrongTopic.bestAccuracy || bestStrongTopic.averageAccuracy}%
                        </p>
                      </div>
                    ) : (
                      <div className="flex min-h-40 items-center justify-center text-center text-sm font-semibold text-slate-400">
                        No strong topics yet.
                      </div>
                    )}
                  </div>

                  <div className="dashboard-surface rounded-[28px] p-6 text-center">
                    <SectionTitle icon={<span className="text-lg font-bold text-rose-500">S</span>} title="Needs Support" />

                    {analytics.weakTopics.length > 0 ? (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 text-2xl font-bold text-rose-400">
                          {getIconForTopic(analytics.weakTopics[0].topic)}
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          {TOPIC_LABELS[analytics.weakTopics[0].topic] || analytics.weakTopics[0].topic}
                        </p>
                        <p className="text-sm text-slate-500">
                          Needs extra attention at {analytics.weakTopics[0].averageAccuracy}% accuracy.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-50 text-2xl font-bold text-violet-400">
                          OK
                        </div>
                        <p className="text-sm font-bold text-slate-700">No weak topics.</p>
                        <p className="text-sm text-slate-500">Great progress!</p>
                      </div>
                    )}
                  </div>

                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle
                      icon={<Icon name="clipboard" className="h-5 w-5" />}
                      title="All Topic Performance"
                    />

                    <div className="space-y-4">
                      {topicRows.length > 0 ? (
                        topicRows.map((topic) => {
                          const tone = getTopicTone(topic.averageAccuracy);
                          return (
                            <div key={topic.topic}>
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-xs font-extrabold text-white">
                                  {getIconForTopic(topic.topic)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="break-words font-bold text-slate-800">
                                        {TOPIC_LABELS[topic.topic] || topic.topic}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {Math.round((topic.totalTimeSpent || 0) / 60)}m spent
                                      </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                      <p className={`text-sm font-extrabold ${tone.color}`}>
                                        {topic.averageAccuracy}%
                                      </p>
                                      <p className={`text-sm font-semibold ${tone.color}`}>{tone.label}</p>
                                    </div>
                                  </div>
                                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className={`h-full rounded-full ${tone.bar}`}
                                      style={{ width: `${topic.averageAccuracy}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-400">No topic data available yet.</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {showHistory && (
                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.03fr_1.15fr]">
                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle icon={<Icon name="clock" className="h-5 w-5" />} title="Learning Timeline" />

                    {timelinePreview.length > 0 ? (
                      <div className="space-y-1">
                        {timelinePreview.map((entry) => (
                          <TimelineItem key={entry._id} {...entry} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-400">
                        No learning activity recorded yet.
                      </div>
                    )}
                  </div>

                  <div className="dashboard-surface rounded-[28px] p-6">
                    <SectionTitle icon={<Icon name="rocket" className="h-5 w-5" />} title="AI Insights" />

                    {aiAnalysis ? (
                      <div className="space-y-4">
                        <div className="rounded-[20px] border border-violet-100 bg-violet-50/80 p-4">
                          <div className="mb-2 flex items-center gap-2 text-violet-500">
                            <Icon name="rocket" className="h-5 w-5" />
                            <p className="text-sm font-extrabold">Recommended Next Activity</p>
                          </div>
                          <p className="text-sm text-slate-600">
                            {aiRecommendation?.message ||
                              `You are doing great in ${strongestLabel}. Next steps will appear here.`}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="rounded-[18px] border border-emerald-100 bg-slate-50 p-4">
                            <p className="text-sm font-extrabold text-slate-700">Strong Areas</p>
                            <p className="mt-2 text-sm font-semibold text-emerald-500">
                              {aiAnalysis.strongTopics.length > 0
                                ? `${TOPIC_LABELS[aiAnalysis.strongTopics[0].topic] || aiAnalysis.strongTopics[0].topic} (${aiAnalysis.strongTopics[0].averageAccuracy}%)`
                                : "No strong areas yet"}
                            </p>
                          </div>

                          <div className="rounded-[18px] border border-rose-100 bg-rose-50/40 p-4">
                            <p className="text-sm font-extrabold text-slate-700">Needs Focus</p>
                            <p className="mt-2 text-sm text-slate-500">
                              {aiAnalysis.weakTopics.length > 0
                                ? `${TOPIC_LABELS[aiAnalysis.weakTopics[0].topic] || aiAnalysis.weakTopics[0].topic} (${aiAnalysis.weakTopics[0].averageAccuracy}%)`
                                : "No weak areas."}
                            </p>
                          </div>
                        </div>

                        {aiAnalysis.unattemptedTopics?.length > 0 && (
                          <div>
                            <p className="mb-3 text-sm font-extrabold text-slate-700">Not Yet Explored</p>
                            <div className="flex flex-wrap gap-2">
                              {aiAnalysis.unattemptedTopics.map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600"
                                >
                                  {TOPIC_LABELS[topic] || topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-400">
                        AI insights will appear once your child starts learning.
                      </div>
                    )}
                  </div>
                </section>
              )}

              {showTests && (
                <section className="dashboard-surface rounded-[28px] p-6">
                  <CreateTestPanel
                    selectedChild={selectedChild}
                    childName={selectedChildName}
                    aiAnalysis={aiAnalysis}
                  />
                </section>
              )}

              {activeSection === "insights" && analytics.topics.length > 0 && (
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {analytics.topics.map((topic) => (
                    <TopicCard key={topic.topic} {...topic} />
                  ))}
                </section>
              )}

              {activeSection === "history" && analytics.timeline.length > 4 && (
                <section className="dashboard-surface rounded-[28px] p-6">
                  <SectionTitle icon={<Icon name="clock" className="h-5 w-5" />} title="Full Timeline" />
                  <div className="space-y-1">
                    {analytics.timeline.map((entry) => (
                      <div key={`full-${entry._id}`} className="rounded-2xl border border-slate-100 px-4 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words font-bold text-slate-800">
                              {TOPIC_LABELS[entry.topic] || entry.topic}
                            </p>
                            <p className="text-sm text-slate-500">
                              {entry.score}/{entry.totalQuestions} correct - {entry.difficultyLevel || "easy"} -{" "}
                              {formatTimelineDate(entry.date)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-lg font-extrabold ${
                              entry.accuracy >= 75
                                ? "text-emerald-500"
                                : entry.accuracy >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {entry.accuracy}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
