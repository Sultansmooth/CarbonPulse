"use client";

import { devices } from "@/lib/mock-data";
import { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Derived SSID helpers
// ---------------------------------------------------------------------------

interface SsidInfo {
  name: string;
  bands: ("2.4GHz" | "5GHz")[];
  apCount: number;
  totalClients: number;
  security: string;
  hidden: boolean;
  colorClass: string; // text color
  bgClass: string;    // badge bg
  borderClass: string;
}

function classifySSID(name: string): { security: string; hidden: boolean; colorClass: string; bgClass: string; borderClass: string } {
  const lower = name.toLowerCase();
  if (lower.includes("guest")) {
    return { security: "WPA2-Personal", hidden: false, colorClass: "text-purple-400", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/20" };
  }
  if (lower.includes("exec") || lower.includes("secure") || lower.includes("infra")) {
    return {
      security: "WPA2-Enterprise",
      hidden: lower.includes("infra"),
      colorClass: lower.includes("infra") ? "text-slate-400" : "text-blue-400",
      bgClass: lower.includes("infra") ? "bg-slate-500/10" : "bg-blue-500/10",
      borderClass: lower.includes("infra") ? "border-slate-500/20" : "border-blue-500/20",
    };
  }
  if (lower.includes("lab")) {
    return { security: "WPA3-Personal", hidden: false, colorClass: "text-amber-400", bgClass: "bg-amber-500/10", borderClass: "border-amber-500/20" };
  }
  // primary / default
  return { security: "WPA3-Personal", hidden: false, colorClass: "text-carbon-400", bgClass: "bg-carbon-500/10", borderClass: "border-carbon-500/20" };
}

function deriveSSIDs(devs: typeof devices): SsidInfo[] {
  const map = new Map<string, { bands: Set<string>; aps: Set<string>; clients: number }>();

  devs.forEach((d) => {
    // 2.4GHz SSID
    if (d.ssid2g) {
      const entry = map.get(d.ssid2g) ?? { bands: new Set(), aps: new Set(), clients: 0 };
      entry.bands.add("2.4GHz");
      entry.aps.add(d.id);
      entry.clients += d.clients;
      map.set(d.ssid2g, entry);
    }
    // 5GHz SSID - if same name as 2.4, merge; otherwise separate
    if (d.ssid5g && d.ssid5g !== d.ssid2g) {
      const entry = map.get(d.ssid5g) ?? { bands: new Set(), aps: new Set(), clients: 0 };
      entry.bands.add("5GHz");
      entry.aps.add(d.id);
      // Don't double-count clients; they are already counted under the 2.4 entry
      map.set(d.ssid5g, entry);
    } else if (d.ssid5g && d.ssid5g === d.ssid2g) {
      const entry = map.get(d.ssid5g)!;
      entry.bands.add("5GHz");
    }
  });

  return Array.from(map.entries())
    .map(([name, val]) => {
      const cls = classifySSID(name);
      return {
        name,
        bands: Array.from(val.bands) as ("2.4GHz" | "5GHz")[],
        apCount: val.aps.size,
        totalClients: val.clients,
        ...cls,
      };
    })
    .sort((a, b) => b.totalClients - a.totalClients);
}

// ---------------------------------------------------------------------------
// Channel utilization helpers
// ---------------------------------------------------------------------------

const CHANNELS_2G = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const CHANNELS_5G = [36, 44, 149];

function channelCounts(devs: typeof devices, band: "2g" | "5g") {
  const channels = band === "2g" ? CHANNELS_2G : CHANNELS_5G;
  const counts: Record<number, number> = {};
  channels.forEach((ch) => (counts[ch] = 0));
  devs.forEach((d) => {
    const ch = band === "2g" ? d.channel2g : d.channel5g;
    if (counts[ch] !== undefined) counts[ch]++;
  });
  return channels.map((ch) => ({ channel: ch, count: counts[ch] }));
}

// ---------------------------------------------------------------------------
// Client distribution per SSID
// ---------------------------------------------------------------------------

function clientDistribution(ssids: SsidInfo[]) {
  const maxClients = Math.max(...ssids.map((s) => s.totalClients), 1);
  return ssids.map((s) => ({
    ...s,
    pct: Math.round((s.totalClients / maxClients) * 100),
  }));
}

// ---------------------------------------------------------------------------
// Security settings (mock)
// ---------------------------------------------------------------------------

interface SecuritySetting {
  label: string;
  description: string;
  type: "toggle" | "value";
  enabled?: boolean;
  value?: string;
}

const securitySettings: SecuritySetting[] = [
  { label: "PMF (Protected Management Frames)", description: "Protects management frames from forgery and eavesdropping", type: "toggle", enabled: true },
  { label: "Fast Roaming (802.11r)", description: "Pre-authenticates with target AP for seamless client roaming", type: "toggle", enabled: true },
  { label: "Band Steering", description: "Guides dual-band clients to the less-congested 5GHz band", type: "toggle", enabled: true },
  { label: "MU-MIMO", description: "Multi-User Multiple-Input Multiple-Output for concurrent transmissions", type: "toggle", enabled: true },
  { label: "OFDMA", description: "Orthogonal Frequency Division Multiple Access for efficient spectrum use", type: "toggle", enabled: true },
  { label: "Target Wake Time (TWT)", description: "Schedules device wake times to reduce power consumption", type: "toggle", enabled: true },
  { label: "Beacon Interval", description: "Interval between beacon frames sent by access points", type: "value", value: "100 ms" },
  { label: "DTIM Interval", description: "Delivery Traffic Indication Message period in beacon intervals", type: "value", value: "3" },
  { label: "RTS Threshold", description: "Request-to-Send frame size threshold in bytes", type: "value", value: "2347" },
  { label: "Fragmentation Threshold", description: "Maximum frame size before fragmentation in bytes", type: "value", value: "2346" },
];

// ---------------------------------------------------------------------------
// AI recommendations (mock)
// ---------------------------------------------------------------------------

interface AiRec {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  detail: string;
  action: string;
}

const aiRecommendations: AiRec[] = [
  {
    id: "ai-w-1",
    title: "Channel 6 Congestion",
    severity: "critical",
    detail: "5 APs are broadcasting on 2.4 GHz Channel 6, creating co-channel interference that degrades throughput for 59 connected clients. Redistributing APs across channels 1, 6, and 11 would reduce interference by an estimated 38%.",
    action: "Auto-Redistribute Channels",
  },
  {
    id: "ai-w-2",
    title: "5 GHz Band Underutilization",
    severity: "warning",
    detail: "Approximately 40% of dual-band capable clients are connected on 2.4 GHz despite strong 5 GHz signal availability. Enabling aggressive band steering would shift an estimated 35 clients to the less-congested 5 GHz band.",
    action: "Enable Band Steering",
  },
  {
    id: "ai-w-3",
    title: "Guest Network Isolation",
    severity: "warning",
    detail: "The CarbonPulse-Guest SSID does not have AP isolation enabled, allowing guest clients to communicate with each other. This poses a potential security risk for the 31 clients on the guest network.",
    action: "Enable AP Isolation",
  },
  {
    id: "ai-w-4",
    title: "TX Power Optimization",
    severity: "info",
    detail: "3 APs (Floor2-East-01, Warehouse-01, Guest-Net-01) are running at maximum 23 dBm TX power on both bands, causing overlapping coverage and potential roaming issues. Reducing TX power to 17-20 dBm would improve cell boundaries.",
    action: "Optimize TX Power",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Tab = "ssids" | "radio" | "security" | "ai";

export default function WifiPage() {
  const [tab, setTab] = useState<Tab>("ssids");

  const ssids = useMemo(() => deriveSSIDs(devices), []);
  const ch2g = useMemo(() => channelCounts(devices, "2g"), []);
  const ch5g = useMemo(() => channelCounts(devices, "5g"), []);
  const clientDist = useMemo(() => clientDistribution(ssids), [ssids]);

  const totalClients = devices.reduce((sum, d) => sum + d.clients, 0);
  const totalAPs = devices.length;
  const uniqueSSIDCount = ssids.length;

  // Detect channel conflicts (multiple APs on same channel)
  const channel2gConflicts = new Set(ch2g.filter((c) => c.count > 1).map((c) => c.channel));
  const channel5gConflicts = new Set(ch5g.filter((c) => c.count > 1).map((c) => c.channel));

  return (
    <div className="min-h-screen grid-bg">
      {/* Sticky header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">WiFi Networks</h1>
            <p className="text-xs text-slate-500 mt-0.5">SSID management, radio configuration &amp; client distribution</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              + Create SSID
            </button>
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              AI Channel Optimizer
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* WAN / ISP Connection Overview */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-950/60 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">WAN Connection</h3>
                <p className="text-[10px] text-slate-500">Primary internet uplink &amp; provider status</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ISP Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-navy-900/40 rounded-lg p-3 border border-slate-800/30">
                {/* AT&T Globe Icon */}
                <div className="w-9 h-9 rounded-lg bg-[#009fdb]/10 border border-[#009fdb]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#009fdb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">AT&T Fiber</p>
                  <p className="text-[10px] text-slate-500">Business 1000 Plan &middot; 1 Gbps / 1 Gbps</p>
                </div>
                <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Primary</span>
              </div>

              <div className="flex items-center gap-3 bg-navy-900/40 rounded-lg p-3 border border-slate-800/30">
                {/* Spectrum Icon */}
                <div className="w-9 h-9 rounded-lg bg-[#0078c8]/10 border border-[#0078c8]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0078c8]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">Spectrum Business</p>
                  <p className="text-[10px] text-slate-500">Cable 600 Plan &middot; 600 Mbps / 35 Mbps</p>
                </div>
                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Failover</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-navy-900/30 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500">Public IP</p>
                  <p className="text-xs text-slate-200 font-mono">74.125.224.72</p>
                </div>
                <div className="bg-navy-900/30 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500">DNS</p>
                  <p className="text-xs text-slate-200 font-mono">1.1.1.1 / 8.8.8.8</p>
                </div>
                <div className="bg-navy-900/30 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500">Latency</p>
                  <p className="text-xs text-green-400 font-mono">4ms</p>
                </div>
                <div className="bg-navy-900/30 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500">WAN Uptime</p>
                  <p className="text-xs text-green-400 font-mono">99.97%</p>
                </div>
              </div>
            </div>

            {/* 30-Day Uptime Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-300 font-medium">30-Day Uptime History</p>
                <p className="text-[10px] text-slate-500">1 block = 1 day</p>
              </div>
              <div className="flex gap-[3px] mb-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  // Mock uptime: mostly green, a few issues
                  const day = 30 - i;
                  let status: "up" | "degraded" | "down" = "up";
                  if (day === 12) status = "down";
                  if (day === 13) status = "degraded";
                  if (day === 22) status = "degraded";
                  const color = status === "up" ? "bg-green-500" : status === "degraded" ? "bg-amber-500" : "bg-red-500";
                  const dateStr = `${day}d ago`;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-7 rounded-sm ${color} cursor-pointer hover:opacity-80 transition-opacity`}
                      title={`${dateStr}: ${status === "up" ? "100% uptime" : status === "degraded" ? "Partial outage (99.2%)" : "Major outage (94.1%)"}`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-600">
                <span>30 days ago</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> Operational</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Degraded</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> Outage</span>
                </div>
                <span>Today</span>
              </div>

              {/* Speed test results */}
              <div className="mt-4 bg-navy-900/30 rounded-lg p-3 border border-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Last Speed Test</p>
                  <p className="text-[10px] text-slate-600">12 min ago</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Download</p>
                    <p className="text-lg font-bold text-carbon-400">941</p>
                    <p className="text-[9px] text-slate-600">Mbps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Upload</p>
                    <p className="text-lg font-bold text-blue-400">887</p>
                    <p className="text-[9px] text-slate-600">Mbps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Jitter</p>
                    <p className="text-lg font-bold text-green-400">1.2</p>
                    <p className="text-[9px] text-slate-600">ms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total SSIDs</p>
            <p className="text-2xl font-bold text-white">{uniqueSSIDCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Across all bands</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Broadcasting APs</p>
            <p className="text-2xl font-bold text-carbon-400">{totalAPs}</p>
            <p className="text-[10px] text-slate-500 mt-1">{devices.filter((d) => d.status === "online").length} online</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Connected Clients</p>
            <p className="text-2xl font-bold text-green-400">{totalClients}</p>
            <p className="text-[10px] text-slate-500 mt-1">WiFi associations</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Channel Conflicts</p>
            <p className="text-2xl font-bold text-amber-400">{channel2gConflicts.size + channel5gConflicts.size}</p>
            <p className="text-[10px] text-slate-500 mt-1">Shared channels detected</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1 mb-6 w-fit">
          {([
            { key: "ssids" as const, label: "SSIDs" },
            { key: "radio" as const, label: "Radio Config" },
            { key: "security" as const, label: "Security" },
            { key: "ai" as const, label: "AI Insights" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded text-xs transition-colors ${
                tab === t.key
                  ? "bg-carbon-500/10 text-carbon-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
              {t.key === "ai" && (
                <span className="ml-2 bg-amber-500/20 text-amber-400 text-[9px] px-1.5 py-0.5 rounded-full">
                  {aiRecommendations.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================================= */}
        {/* TAB: SSIDs                                                     */}
        {/* ============================================================= */}
        {tab === "ssids" && (
          <>
            {/* SSID overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {ssids.map((ssid) => (
                <div
                  key={ssid.name}
                  className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow hover:border-slate-700/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold ${ssid.colorClass}`}>{ssid.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${ssid.bgClass} ${ssid.colorClass} ${ssid.borderClass}`}>
                      {ssid.bands.length === 2 ? "Dual Band" : ssid.bands[0]}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security</span>
                      <span className="text-slate-300">{ssid.security}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Broadcasting APs</span>
                      <span className="text-slate-300">{ssid.apCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Clients</span>
                      <span className="text-white font-medium">{ssid.totalClients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hidden Network</span>
                      <span className={ssid.hidden ? "text-amber-400" : "text-slate-500"}>
                        {ssid.hidden ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Band(s)</span>
                      <div className="flex gap-1">
                        {ssid.bands.map((b) => (
                          <span
                            key={b}
                            className={`px-1.5 py-0.5 rounded text-[9px] ${
                              b === "5GHz"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client distribution by SSID */}
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-8">
              <h3 className="text-sm font-semibold text-white mb-1">Client Distribution by SSID</h3>
              <p className="text-[10px] text-slate-500 mb-5">Connected clients per SSID, sorted by count</p>
              <div className="space-y-3">
                {clientDist.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className={`text-xs w-48 truncate font-medium ${s.colorClass}`}>{s.name}</span>
                    <div className="flex-1 h-3 bg-navy-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          s.colorClass.includes("purple")
                            ? "bg-purple-500/70"
                            : s.colorClass.includes("blue")
                            ? "bg-blue-500/70"
                            : s.colorClass.includes("amber")
                            ? "bg-amber-500/70"
                            : s.colorClass.includes("slate")
                            ? "bg-slate-500/70"
                            : "bg-carbon-500/70"
                        }`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-300 w-16 text-right font-mono">{s.totalClients}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 2.4GHz */}
              <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
                <h3 className="text-sm font-semibold text-white mb-1">2.4 GHz Channel Utilization</h3>
                <p className="text-[10px] text-slate-500 mb-5">APs per channel &mdash; Channels 1, 6, 11 recommended</p>
                <div className="flex items-end gap-1.5 h-32">
                  {ch2g.map((c) => {
                    const maxCount = Math.max(...ch2g.map((x) => x.count), 1);
                    const heightPct = Math.max((c.count / maxCount) * 100, 4);
                    const isConflict = channel2gConflicts.has(c.channel);
                    const barColor =
                      c.count === 0
                        ? "bg-slate-800"
                        : c.count >= 4
                        ? "bg-red-500/80"
                        : c.count >= 2
                        ? "bg-amber-500/80"
                        : "bg-carbon-500/80";
                    return (
                      <div key={c.channel} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[9px] font-mono ${isConflict ? "text-amber-400" : "text-slate-500"}`}>
                          {c.count}
                        </span>
                        <div className="w-full flex justify-center">
                          <div
                            className={`w-full max-w-[28px] rounded-t ${barColor} transition-all`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-500">{c.channel}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-[9px] text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-carbon-500/80" /> 1 AP</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500/80" /> 2-3 APs</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-500/80" /> 4+ APs</div>
                </div>
              </div>
              {/* 5GHz */}
              <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
                <h3 className="text-sm font-semibold text-white mb-1">5 GHz Channel Utilization</h3>
                <p className="text-[10px] text-slate-500 mb-5">APs per channel &mdash; DFS channels available</p>
                <div className="flex items-end gap-4 h-32">
                  {ch5g.map((c) => {
                    const maxCount = Math.max(...ch5g.map((x) => x.count), 1);
                    const heightPct = Math.max((c.count / maxCount) * 100, 4);
                    const isConflict = channel5gConflicts.has(c.channel);
                    const barColor =
                      c.count === 0
                        ? "bg-slate-800"
                        : c.count >= 4
                        ? "bg-red-500/80"
                        : c.count >= 2
                        ? "bg-amber-500/80"
                        : "bg-blue-500/80";
                    return (
                      <div key={c.channel} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[9px] font-mono ${isConflict ? "text-amber-400" : "text-slate-500"}`}>
                          {c.count}
                        </span>
                        <div className="w-full flex justify-center">
                          <div
                            className={`w-full max-w-[48px] rounded-t ${barColor} transition-all`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Ch {c.channel}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-[9px] text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500/80" /> 1 AP</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500/80" /> 2-3 APs</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-500/80" /> 4+ APs</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ============================================================= */}
        {/* TAB: Radio Config                                              */}
        {/* ============================================================= */}
        {tab === "radio" && (
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 overflow-hidden card-glow">
            <div className="p-4 border-b border-slate-800/50">
              <h3 className="text-sm font-semibold text-white">Radio Configuration per AP</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Channel assignments, TX power, and band split status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Device</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Role</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">2.4 GHz Ch</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">5 GHz Ch</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">TX 2.4</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">TX 5</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Width 2.4</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Width 5</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Split Band</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => {
                    const ch2Conflict = channel2gConflicts.has(d.channel2g);
                    const ch5Conflict = channel5gConflicts.has(d.channel5g);
                    return (
                      <tr key={d.id} className="border-b border-slate-800/20 hover:bg-navy-900/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-xs text-white font-medium">{d.name}</p>
                          <p className="text-[9px] text-slate-600">{d.location}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            d.role === "gateway"
                              ? "bg-carbon-500/10 text-carbon-400 border-carbon-500/20"
                              : d.role === "access-point"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : d.role === "mesh-node"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {d.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                            ch2Conflict
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-navy-900 text-slate-300"
                          }`}>
                            {d.channel2g}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                            ch5Conflict
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-navy-900 text-slate-300"
                          }`}>
                            {d.channel5g}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono ${d.txPower2g >= 23 ? "text-red-400" : d.txPower2g >= 20 ? "text-amber-400" : "text-slate-300"}`}>
                            {d.txPower2g} dBm
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono ${d.txPower5g >= 23 ? "text-red-400" : d.txPower5g >= 20 ? "text-amber-400" : "text-slate-300"}`}>
                            {d.txPower5g} dBm
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">20 MHz</td>
                        <td className="px-4 py-3 text-xs text-slate-400">80 MHz</td>
                        <td className="px-4 py-3">
                          {d.splitBand ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Split</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">Unified</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              d.status === "online"
                                ? "bg-green-400"
                                : d.status === "offline"
                                ? "bg-red-400"
                                : d.status === "updating"
                                ? "bg-blue-400 animate-pulse"
                                : "bg-amber-400"
                            }`} />
                            <span className={`text-[10px] capitalize ${
                              d.status === "online"
                                ? "text-green-400"
                                : d.status === "offline"
                                ? "text-red-400"
                                : d.status === "updating"
                                ? "text-blue-400"
                                : "text-amber-400"
                            }`}>
                              {d.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB: Security                                                  */}
        {/* ============================================================= */}
        {tab === "security" && (
          <div className="max-w-3xl space-y-6">
            {/* Global security settings */}
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
              <h3 className="text-sm font-semibold text-white mb-1">Global WiFi Security Settings</h3>
              <p className="text-[10px] text-slate-500 mb-5">Applied across all SSIDs and access points</p>
              <div className="space-y-4">
                {securitySettings.map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-xs text-white font-medium">{setting.label}</p>
                      <p className="text-[10px] text-slate-500">{setting.description}</p>
                    </div>
                    {setting.type === "toggle" ? (
                      <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors flex-shrink-0 ${setting.enabled ? "bg-carbon-500" : "bg-slate-700"}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${setting.enabled ? "translate-x-4" : ""}`} />
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-carbon-400 bg-navy-900 px-3 py-1 rounded border border-slate-800/50 flex-shrink-0">
                        {setting.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Per-SSID security overview */}
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
              <h3 className="text-sm font-semibold text-white mb-1">Per-SSID Security Overview</h3>
              <p className="text-[10px] text-slate-500 mb-5">Authentication and encryption per network</p>
              <div className="space-y-2">
                {ssids.map((ssid) => (
                  <div key={ssid.name} className="flex items-center gap-4 bg-navy-900/30 rounded-lg p-3">
                    <span className={`text-xs font-medium w-48 truncate ${ssid.colorClass}`}>{ssid.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ssid.bgClass} ${ssid.colorClass} ${ssid.borderClass}`}>
                      {ssid.security}
                    </span>
                    <span className="text-[10px] text-slate-500 flex-1">
                      {ssid.security === "WPA2-Enterprise"
                        ? "RADIUS auth, AES-256"
                        : ssid.security === "WPA3-Personal"
                        ? "SAE handshake, AES-256"
                        : "PSK, AES-128/256"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${ssid.hidden ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-500"}`}>
                      {ssid.hidden ? "Hidden" : "Visible"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB: AI Insights                                               */}
        {/* ============================================================= */}
        {tab === "ai" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-white">AI WiFi Recommendations</h3>
              <span className="text-[9px] bg-carbon-500/10 text-carbon-400 px-2 py-0.5 rounded-full border border-carbon-500/20">
                Powered by Carbon AI
              </span>
            </div>

            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow hover:border-slate-700/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        rec.severity === "critical"
                          ? "bg-red-400"
                          : rec.severity === "warning"
                          ? "bg-amber-400"
                          : "bg-blue-400"
                      }`} />
                      <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                        rec.severity === "critical"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : rec.severity === "warning"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {rec.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.detail}</p>
                  </div>
                  <button className="text-[10px] bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors whitespace-nowrap flex-shrink-0">
                    {rec.action}
                  </button>
                </div>
              </div>
            ))}

            {/* AI summary card */}
            <div className="bg-navy-900/50 rounded-xl border border-slate-800/30 p-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-carbon-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-carbon-400 animate-pulse" />
                </div>
                <h4 className="text-xs font-semibold text-white">AI Analysis Summary</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Carbon AI has analyzed {totalAPs} access points broadcasting {uniqueSSIDCount} SSIDs
                serving {totalClients} clients. Primary concerns are 2.4 GHz Channel 6 congestion
                ({ch2g.find((c) => c.channel === 6)?.count ?? 0} APs sharing) and suboptimal TX power
                levels on {devices.filter((d) => d.txPower2g >= 23 && d.txPower5g >= 23).length} APs.
                Implementing the recommended changes is estimated to improve overall network efficiency
                by 22% and reduce client roaming failures by 35%.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
