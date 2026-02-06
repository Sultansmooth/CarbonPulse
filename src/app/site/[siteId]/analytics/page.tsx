"use client";

import { devices, throughputData, getNetworkStats } from "@/lib/mock-data";

// ── Helpers ──────────────────────────────────────────────────────────────────

const activeDevices = devices.filter((d) => d.status !== "offline");
const stats = getNetworkStats();

const fleetUptimePercent = Math.round(
  (activeDevices.length / devices.length) * 100
);

const totalBandwidth = devices.reduce((a, d) => a + d.download + d.upload, 0);

const roleColors: Record<string, string> = {
  gateway: "#22d3ee",
  "access-point": "#a78bfa",
  "mesh-node": "#34d399",
  repeater: "#fbbf24",
};

const roleLabels: Record<string, string> = {
  gateway: "Gateway",
  "access-point": "Access Point",
  "mesh-node": "Mesh Node",
  repeater: "Repeater",
};

function bucketize(values: number[], edges: number[]): number[] {
  const counts = new Array(edges.length + 1).fill(0);
  for (const v of values) {
    let placed = false;
    for (let i = 0; i < edges.length; i++) {
      if (v < edges[i]) {
        counts[i]++;
        placed = true;
        break;
      }
    }
    if (!placed) counts[edges.length]++;
  }
  return counts;
}

// ── Summary data ─────────────────────────────────────────────────────────────

const summaryCards = [
  {
    label: "Total Bandwidth",
    value: `${(totalBandwidth / 1000).toFixed(1)} Gbps`,
    sub: "Aggregate DL+UL",
    color: "text-carbon-400",
  },
  {
    label: "Avg CPU",
    value: `${stats.avgCpuUsage}%`,
    sub: `Peak: ${Math.max(...activeDevices.map((d) => d.cpuUsage))}%`,
    color: "text-cyan-400",
  },
  {
    label: "Avg Memory",
    value: `${stats.avgMemUsage}%`,
    sub: `Peak: ${Math.max(...activeDevices.map((d) => d.memUsage))}%`,
    color: "text-blue-400",
  },
  {
    label: "Total Clients",
    value: `${stats.totalClients}`,
    sub: `${devices.length} devices`,
    color: "text-purple-400",
  },
  {
    label: "Avg AI Score",
    value: `${stats.aiHealthScore}`,
    sub: `${activeDevices.filter((d) => d.aiScore >= 85).length} healthy`,
    color: "text-green-400",
  },
  {
    label: "Fleet Uptime",
    value: `${fleetUptimePercent}%`,
    sub: `${activeDevices.length}/${devices.length} online`,
    color: "text-amber-400",
  },
];

// ── Distribution buckets ─────────────────────────────────────────────────────

const cpuBuckets = bucketize(
  activeDevices.map((d) => d.cpuUsage),
  [20, 40, 60, 80]
);
const memBuckets = bucketize(
  activeDevices.map((d) => d.memUsage),
  [20, 40, 60, 80]
);
const clientBuckets = bucketize(
  devices.map((d) => d.clients),
  [5, 10, 15, 20]
);
const aiBuckets = bucketize(
  activeDevices.map((d) => d.aiScore),
  [50, 70, 85]
);

// ── Sorted device lists ──────────────────────────────────────────────────────

const topDevices = [...devices]
  .sort((a, b) => b.aiScore - a.aiScore)
  .slice(0, 5);
const bottomDevices = [...activeDevices]
  .sort((a, b) => a.aiScore - b.aiScore)
  .slice(0, 5);
const bandwidthSorted = [...devices]
  .filter((d) => d.download > 0)
  .sort((a, b) => b.download - a.download);
const maxDownload = Math.max(...bandwidthSorted.map((d) => d.download));

// ── Role distribution ────────────────────────────────────────────────────────

const roleCounts: Record<string, number> = {};
for (const d of devices) {
  roleCounts[d.role] = (roleCounts[d.role] || 0) + 1;
}
const roleEntries = Object.entries(roleCounts);
const roleTotal = roleEntries.reduce((a, [, c]) => a + c, 0);

// ── Channel analysis ─────────────────────────────────────────────────────────

const channel2gCounts: Record<number, string[]> = {};
const channel5gCounts: Record<number, string[]> = {};
for (const d of activeDevices) {
  if (!channel2gCounts[d.channel2g]) channel2gCounts[d.channel2g] = [];
  channel2gCounts[d.channel2g].push(d.name);
  if (!channel5gCounts[d.channel5g]) channel5gCounts[d.channel5g] = [];
  channel5gCounts[d.channel5g].push(d.name);
}

// ── Mock 7-day health data ───────────────────────────────────────────────────

const weeklyHealth = [
  { day: "Mon", score: 81 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 83 },
  { day: "Thu", score: 85 },
  { day: "Fri", score: 80 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: stats.aiHealthScore },
];

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function MiniDistributionChart({
  title,
  buckets,
  labels,
  colors,
}: {
  title: string;
  buckets: number[];
  labels: string[];
  colors: string[];
}) {
  const max = Math.max(...buckets, 1);
  return (
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-medium text-slate-300 mb-3 truncate">
        {title}
      </h4>
      <div className="flex items-end gap-1.5 h-24">
        {buckets.map((count, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium">
              {count}
            </span>
            <div className="w-full rounded-t relative" style={{ background: "rgba(51,65,85,0.3)", height: "100%" }}>
              <div
                className="w-full rounded-t absolute bottom-0 left-0 transition-all"
                style={{
                  height: `${(count / max) * 100}%`,
                  backgroundColor: colors[i] || colors[0],
                  minHeight: count > 0 ? "4px" : "0px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-[10px] text-slate-500 text-center truncate">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function BandwidthLineChart() {
  const W = 800;
  const H = 300;
  const PAD = { top: 20, right: 20, bottom: 40, left: 55 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const maxDl = Math.max(...throughputData.map((d) => d.download));
  const maxUl = Math.max(...throughputData.map((d) => d.upload));
  const maxY = Math.ceil(Math.max(maxDl, maxUl) / 100) * 100 + 50;

  const xStep = cw / (throughputData.length - 1);

  function toX(i: number) {
    return PAD.left + i * xStep;
  }
  function toY(v: number) {
    return PAD.top + ch - (v / maxY) * ch;
  }

  const dlPoints = throughputData.map((d, i) => `${toX(i)},${toY(d.download)}`).join(" ");
  const ulPoints = throughputData.map((d, i) => `${toX(i)},${toY(d.upload)}`).join(" ");

  const dlArea = `${PAD.left},${PAD.top + ch} ${dlPoints} ${toX(throughputData.length - 1)},${PAD.top + ch}`;
  const ulArea = `${PAD.left},${PAD.top + ch} ${ulPoints} ${toX(throughputData.length - 1)},${PAD.top + ch}`;

  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700].filter((v) => v <= maxY);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: "300px" }}>
      {/* Grid lines */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            y1={toY(v)}
            x2={W - PAD.right}
            y2={toY(v)}
            stroke="rgba(148,163,184,0.08)"
            strokeDasharray="4,4"
          />
          <text
            x={PAD.left - 8}
            y={toY(v) + 3}
            fill="rgba(148,163,184,0.5)"
            fontSize="10"
            textAnchor="end"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Y-axis label */}
      <text
        x={12}
        y={H / 2}
        fill="rgba(148,163,184,0.4)"
        fontSize="9"
        textAnchor="middle"
        transform={`rotate(-90, 12, ${H / 2})`}
      >
        Mbps
      </text>

      {/* Area fills */}
      <polygon points={dlArea} fill="rgba(45,212,191,0.1)" />
      <polygon points={ulArea} fill="rgba(96,165,250,0.08)" />

      {/* Lines */}
      <polyline
        points={dlPoints}
        fill="none"
        stroke="rgba(45,212,191,0.8)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={ulPoints}
        fill="none"
        stroke="rgba(96,165,250,0.7)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {throughputData.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.download)} r="3" fill="#2dd4bf" />
          <circle cx={toX(i)} cy={toY(d.upload)} r="2.5" fill="#60a5fa" />
        </g>
      ))}

      {/* X-axis labels */}
      {throughputData.map((d, i) =>
        i % 2 === 0 ? (
          <text
            key={i}
            x={toX(i)}
            y={H - 8}
            fill="rgba(148,163,184,0.5)"
            fontSize="10"
            textAnchor="middle"
          >
            {d.time}
          </text>
        ) : null
      )}

      {/* Axis lines */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ch} stroke="rgba(148,163,184,0.15)" />
      <line x1={PAD.left} y1={PAD.top + ch} x2={W - PAD.right} y2={PAD.top + ch} stroke="rgba(148,163,184,0.15)" />
    </svg>
  );
}

function RoleDonutChart() {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 72;
  const innerR = 48;

  let cumAngle = -90;
  const slices: Array<{
    path: string;
    color: string;
    role: string;
    count: number;
    midAngle: number;
  }> = [];

  for (const [role, count] of roleEntries) {
    const angle = (count / roleTotal) * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad = ((cumAngle + angle) * Math.PI) / 180;
    const midAngle = cumAngle + angle / 2;

    const x1o = cx + outerR * Math.cos(startRad);
    const y1o = cy + outerR * Math.sin(startRad);
    const x2o = cx + outerR * Math.cos(endRad);
    const y2o = cy + outerR * Math.sin(endRad);
    const x1i = cx + innerR * Math.cos(endRad);
    const y1i = cy + innerR * Math.sin(endRad);
    const x2i = cx + innerR * Math.cos(startRad);
    const y2i = cy + innerR * Math.sin(startRad);

    const large = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i}`,
      `Z`,
    ].join(" ");

    slices.push({ path, color: roleColors[role] || "#666", role, count, midAngle });
    cumAngle += angle;
  }

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity={0.8} stroke="rgba(15,23,42,0.8)" strokeWidth="2" />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          {devices.length}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="10">
          devices
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-slate-300">{roleLabels[s.role] || s.role}</span>
            <span className="text-slate-500 ml-auto pl-3">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyHealthChart() {
  const W = 400;
  const H = 120;
  const PAD = { top: 15, right: 15, bottom: 25, left: 35 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const minScore = Math.min(...weeklyHealth.map((d) => d.score)) - 5;
  const maxScore = Math.max(...weeklyHealth.map((d) => d.score)) + 5;
  const xStep = cw / (weeklyHealth.length - 1);

  function toX(i: number) {
    return PAD.left + i * xStep;
  }
  function toY(v: number) {
    return PAD.top + ch - ((v - minScore) / (maxScore - minScore)) * ch;
  }

  const linePoints = weeklyHealth.map((d, i) => `${toX(i)},${toY(d.score)}`).join(" ");
  const areaPoints = `${PAD.left},${PAD.top + ch} ${linePoints} ${toX(weeklyHealth.length - 1)},${PAD.top + ch}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: "120px" }}>
      {/* Horizontal guides */}
      {[75, 80, 85, 90].filter((v) => v >= minScore && v <= maxScore).map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            y1={toY(v)}
            x2={W - PAD.right}
            y2={toY(v)}
            stroke="rgba(148,163,184,0.07)"
            strokeDasharray="3,3"
          />
          <text x={PAD.left - 5} y={toY(v) + 3} fill="rgba(148,163,184,0.4)" fontSize="9" textAnchor="end">
            {v}
          </text>
        </g>
      ))}

      <polygon points={areaPoints} fill="rgba(74,222,128,0.08)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="rgba(74,222,128,0.7)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {weeklyHealth.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.score)} r="3.5" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
          <text x={toX(i)} y={toY(d.score) - 8} fill="rgba(148,163,184,0.6)" fontSize="9" textAnchor="middle">
            {d.score}
          </text>
          <text x={toX(i)} y={H - 5} fill="rgba(148,163,184,0.5)" fontSize="9" textAnchor="middle">
            {d.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen grid-bg">
      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Network Analytics</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fleet performance metrics and trends
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {["24h", "7d", "30d", "90d"].map((period) => (
              <button
                key={period}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  period === "24h"
                    ? "bg-carbon-500/10 text-carbon-400 border-carbon-500/20"
                    : "text-slate-500 border-slate-800/50 hover:text-slate-300"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* ═══════════════════════════════════════════════════════════════════
            1. SUMMARY STATS ROW
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-navy-850 rounded-xl border border-slate-800/50 p-4 card-glow"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-[10px] text-slate-600 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            2. 24h BANDWIDTH TREND (SVG line chart)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                24-Hour Bandwidth Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregate download and upload across all devices
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-teal-400 inline-block" />
                <span className="text-slate-400">Download</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-blue-400 inline-block" />
                <span className="text-slate-400">Upload</span>
              </span>
            </div>
          </div>
          <BandwidthLineChart />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            3. DEVICE PERFORMANCE DISTRIBUTION (4 mini bar charts)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-1">
            Device Performance Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            How devices are distributed across key metric ranges
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MiniDistributionChart
              title="CPU Usage"
              buckets={cpuBuckets}
              labels={["0-20%", "20-40%", "40-60%", "60-80%", "80%+"]}
              colors={["#34d399", "#a3e635", "#facc15", "#fb923c", "#f87171"]}
            />
            <MiniDistributionChart
              title="Memory Usage"
              buckets={memBuckets}
              labels={["0-20%", "20-40%", "40-60%", "60-80%", "80%+"]}
              colors={["#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9"]}
            />
            <MiniDistributionChart
              title="Client Load"
              buckets={clientBuckets}
              labels={["0-5", "5-10", "10-15", "15-20", "20+"]}
              colors={["#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"]}
            />
            <MiniDistributionChart
              title="AI Score"
              buckets={aiBuckets}
              labels={["0-50", "50-70", "70-85", "85+"]}
              colors={["#f87171", "#fbbf24", "#a3e635", "#34d399"]}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            4. TOP / BOTTOM DEVICE RANKINGS
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 5 */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-1">
              Top 5 Performing Devices
            </h3>
            <p className="text-xs text-slate-500 mb-4">Highest AI health scores</p>
            <div className="space-y-3">
              {topDevices.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-600 w-4 text-right font-mono">
                    {i + 1}.
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: roleColors[d.role] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300 truncate">
                        {d.name}
                      </span>
                      <span className="text-xs text-green-400 font-bold ml-2">
                        {d.aiScore}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-green-500/60"
                        style={{ width: `${d.aiScore}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                      <span>{d.clients} clients</span>
                      <span>{roleLabels[d.role]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 5 */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-1">
              Bottom 5 - Needs Improvement
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lowest AI scores (excluding offline)
            </p>
            <div className="space-y-3">
              {bottomDevices.map((d, i) => {
                const issues: string[] = [];
                if (d.cpuUsage > 70) issues.push(`High CPU ${d.cpuUsage}%`);
                if (d.memUsage > 70) issues.push(`High Mem ${d.memUsage}%`);
                if (d.clients > 20) issues.push(`${d.clients} clients`);
                if (d.firmware !== "3.0.0.6_386") issues.push("Old firmware");
                if (issues.length === 0) issues.push("Sub-optimal metrics");

                return (
                  <div key={d.id} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-600 w-4 text-right font-mono">
                      {i + 1}.
                    </span>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: roleColors[d.role] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-300 truncate">
                          {d.name}
                        </span>
                        <span
                          className={`text-xs font-bold ml-2 ${
                            d.aiScore < 60 ? "text-red-400" : "text-amber-400"
                          }`}
                        >
                          {d.aiScore}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${d.aiScore}%`,
                            backgroundColor:
                              d.aiScore < 60
                                ? "rgba(248,113,113,0.6)"
                                : "rgba(251,191,36,0.6)",
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {issues.map((issue, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/80 border border-red-500/10"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            5. BANDWIDTH BY DEVICE (horizontal bar chart)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-1">
            Bandwidth by Device
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Download speed per device, sorted descending. Color indicates device
            role.
          </p>
          <div className="space-y-2">
            {bandwidthSorted.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 w-28 truncate text-right flex-shrink-0">
                  {d.name}
                </span>
                <div className="flex-1 bg-slate-800/30 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${(d.download / maxDownload) * 100}%`,
                      backgroundColor: roleColors[d.role],
                      opacity: 0.6,
                      minWidth: "32px",
                    }}
                  >
                    <span className="text-[9px] font-medium text-white/80 whitespace-nowrap">
                      {d.download.toFixed(0)}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 w-14 text-right flex-shrink-0">
                  {d.download.toFixed(1)} Mb
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-800/30">
            {Object.entries(roleLabels).map(([role, label]) => (
              <span key={role} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: roleColors[role] }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            6 + 7. NETWORK HEALTH + ROLE DISTRIBUTION (side by side)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 6. Network Health Over Time */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-1">
              Network Health - 7 Day Trend
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Average AI health score across entire fleet per day
            </p>
            <WeeklyHealthChart />
          </div>

          {/* 7. Role Distribution */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-1">
              Device Role Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fleet composition by device role
            </p>
            <div className="flex justify-center">
              <RoleDonutChart />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            8. CHANNEL USAGE ANALYSIS
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-1">
            Channel Usage Analysis
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Device count per channel with conflict indicators
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2.4 GHz */}
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                2.4 GHz Channels
              </h4>
              <div className="space-y-2">
                {Object.entries(channel2gCounts)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([ch, devs]) => {
                    const conflict = devs.length >= 4;
                    const warning = devs.length >= 3;
                    return (
                      <div key={ch} className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 w-12 flex-shrink-0">
                          Ch {ch}
                        </span>
                        <div className="flex-1 bg-slate-800/30 rounded-full h-5 relative overflow-hidden">
                          <div
                            className="h-full rounded-full flex items-center px-2"
                            style={{
                              width: `${(devs.length / Math.max(...Object.values(channel2gCounts).map((d) => d.length))) * 100}%`,
                              backgroundColor: conflict
                                ? "rgba(248,113,113,0.5)"
                                : warning
                                ? "rgba(251,191,36,0.4)"
                                : "rgba(45,212,191,0.4)",
                              minWidth: "40px",
                            }}
                          >
                            <span className="text-[10px] text-white/80 font-medium">
                              {devs.length} device{devs.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        {conflict && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 flex-shrink-0">
                            Conflict
                          </span>
                        )}
                        {warning && !conflict && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 flex-shrink-0">
                            Crowded
                          </span>
                        )}
                      </div>
                    );
                  })}
                <div className="mt-2 pt-2 border-t border-slate-800/30">
                  <p className="text-[10px] text-slate-500">
                    Non-overlapping channels: 1, 6, 11. Devices sharing the same
                    channel compete for airtime.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 GHz */}
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                5 GHz Channels
              </h4>
              <div className="space-y-2">
                {Object.entries(channel5gCounts)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([ch, devs]) => {
                    const conflict = devs.length >= 5;
                    const warning = devs.length >= 4;
                    return (
                      <div key={ch} className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 w-12 flex-shrink-0">
                          Ch {ch}
                        </span>
                        <div className="flex-1 bg-slate-800/30 rounded-full h-5 relative overflow-hidden">
                          <div
                            className="h-full rounded-full flex items-center px-2"
                            style={{
                              width: `${(devs.length / Math.max(...Object.values(channel5gCounts).map((d) => d.length))) * 100}%`,
                              backgroundColor: conflict
                                ? "rgba(248,113,113,0.5)"
                                : warning
                                ? "rgba(251,191,36,0.4)"
                                : "rgba(96,165,250,0.4)",
                              minWidth: "40px",
                            }}
                          >
                            <span className="text-[10px] text-white/80 font-medium">
                              {devs.length} device{devs.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        {conflict && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 flex-shrink-0">
                            Conflict
                          </span>
                        )}
                        {warning && !conflict && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 flex-shrink-0">
                            Crowded
                          </span>
                        )}
                      </div>
                    );
                  })}
                <div className="mt-2 pt-2 border-t border-slate-800/30">
                  <p className="text-[10px] text-slate-500">
                    5 GHz has more available channels but shorter range. Balanced
                    distribution reduces co-channel interference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
