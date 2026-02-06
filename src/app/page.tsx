"use client";

import { devices, alerts, getNetworkStats, throughputData, aiInsights } from "@/lib/mock-data";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow transition-all hover:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50">{icon}</div>
      </div>
    </div>
  );
}

function MiniChart({ data }: { data: typeof throughputData }) {
  const maxVal = Math.max(...data.map((d) => d.download));
  return (
    <div className="flex items-end gap-[3px] h-24 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-[2px]">
          <div
            className="w-full bg-carbon-500/40 rounded-t-sm min-h-[2px] transition-all"
            style={{ height: `${(d.download / maxVal) * 100}%` }}
          />
          <div
            className="w-full bg-blue-500/40 rounded-t-sm min-h-[2px]"
            style={{ height: `${(d.upload / maxVal) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function AlertBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "ai-insight": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full border ${styles[type] || styles.info}`}>
      {type === "ai-insight" ? "AI" : type}
    </span>
  );
}

function MiniRouterIcon({ model }: { model: string }) {
  if (model === "RT-AX88U") {
    return (
      <svg className="w-7 h-7 text-slate-400 opacity-60 group-hover:opacity-90 transition-opacity" fill="none" viewBox="0 0 48 48" strokeWidth={1.5} stroke="currentColor">
        <rect x="8" y="20" width="32" height="14" rx="3" />
        <line x1="14" y1="20" x2="11" y2="8" strokeLinecap="round" />
        <line x1="24" y1="20" x2="24" y2="6" strokeLinecap="round" />
        <line x1="34" y1="20" x2="37" y2="8" strokeLinecap="round" />
        <circle cx="16" cy="27" r="1.5" fill="currentColor" />
        <circle cx="24" cy="27" r="1.5" fill="currentColor" />
        <circle cx="32" cy="27" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (model === "RT-AX58U") {
    return (
      <svg className="w-7 h-7 text-slate-400 opacity-60 group-hover:opacity-90 transition-opacity" fill="none" viewBox="0 0 48 48" strokeWidth={1.5} stroke="currentColor">
        <rect x="10" y="22" width="28" height="12" rx="2.5" />
        <line x1="16" y1="22" x2="13" y2="10" strokeLinecap="round" />
        <line x1="32" y1="22" x2="35" y2="10" strokeLinecap="round" />
        <circle cx="16" cy="28" r="1.5" fill="currentColor" />
        <circle cx="24" cy="28" r="1.5" fill="currentColor" />
        <circle cx="32" cy="28" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (model === "RP-AX56") {
    return (
      <svg className="w-7 h-7 text-slate-400 opacity-60 group-hover:opacity-90 transition-opacity" fill="none" viewBox="0 0 48 48" strokeWidth={1.5} stroke="currentColor">
        <rect x="16" y="18" width="16" height="20" rx="3" />
        <path d="M12 16c3.3-3.3 8.7-3.3 12 0" />
        <path d="M8 12c5.5-5.5 14.5-5.5 20 0" />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" />
        <circle cx="24" cy="30" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7 text-slate-400 opacity-60 group-hover:opacity-90 transition-opacity" fill="none" viewBox="0 0 48 48" strokeWidth={1.5} stroke="currentColor">
      <rect x="10" y="22" width="28" height="12" rx="2.5" />
      <path d="M16 14c4.4-4.4 11.6-4.4 16 0" />
      <circle cx="16" cy="28" r="1.5" fill="currentColor" />
      <circle cx="24" cy="28" r="1.5" fill="currentColor" />
      <circle cx="32" cy="28" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DeviceStatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online: "bg-green-400",
    offline: "bg-red-400",
    warning: "bg-amber-400",
    updating: "bg-blue-400 animate-pulse",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || "bg-slate-400"}`} />;
}


export default function Dashboard() {
  const stats = getNetworkStats();
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 5);

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Network Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time overview of your RT-AX55 fleet</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-800/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
            <div className="text-xs text-slate-500">Last refresh: just now</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Devices" value={stats.totalDevices} sub="ASUS RT-AX55 Fleet" color="text-white"
            icon={<svg className="w-5 h-5 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>} />
          <StatCard label="Online" value={stats.onlineDevices} sub={`${Math.round((stats.onlineDevices / stats.totalDevices) * 100)}% availability`} color="text-green-400"
            icon={<svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard label="Warnings" value={stats.warningDevices} sub="Require attention" color="text-amber-400"
            icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>} />
          <StatCard label="Connected Clients" value={stats.totalClients} sub="Across all APs" color="text-blue-400"
            icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
          <StatCard label="AI Health Score" value={`${stats.aiHealthScore}/100`} sub="Network intelligence" color="text-carbon-400"
            icon={<svg className="w-5 h-5 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Throughput Chart */}
          <div className="lg:col-span-2 bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Network Throughput</h3>
                <p className="text-xs text-slate-500">24-hour bandwidth usage across fleet</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-carbon-500/60" /><span className="text-slate-400">Download</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-blue-500/60" /><span className="text-slate-400">Upload</span></div>
              </div>
            </div>
            <MiniChart data={throughputData} />
            <div className="flex justify-between mt-2 text-[10px] text-slate-600">
              {throughputData.filter((_, i) => i % 3 === 0).map((d) => (<span key={d.time}>{d.time}</span>))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/30 grid grid-cols-3 gap-4">
              <div><p className="text-xs text-slate-500">Peak Download</p><p className="text-lg font-semibold text-carbon-400">620 Mbps</p></div>
              <div><p className="text-xs text-slate-500">Peak Upload</p><p className="text-lg font-semibold text-blue-400">220 Mbps</p></div>
              <div><p className="text-xs text-slate-500">Total Transferred</p><p className="text-lg font-semibold text-white">2.4 TB</p></div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h3 className="text-sm font-semibold text-white">AI Insights</h3>
              <span className="ml-auto text-[10px] text-carbon-400 bg-carbon-500/10 px-2 py-0.5 rounded-full">{aiInsights.length} active</span>
            </div>
            <div className="space-y-3">
              {aiInsights.slice(0, 4).map((insight) => (
                <div key={insight.id} className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30 hover:border-carbon-500/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-medium text-slate-200">{insight.title}</p>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                      insight.impact === "critical" ? "bg-red-500/10 text-red-400" :
                      insight.impact === "high" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>{insight.impact}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{insight.description}</p>
                  <button className="text-[10px] text-carbon-400 hover:text-carbon-300 font-medium uppercase tracking-wider">{insight.action} →</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2 bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
              <button onClick={() => setShowAllAlerts(!showAllAlerts)} className="text-xs text-carbon-400 hover:text-carbon-300">{showAllAlerts ? "Show Less" : "View All"}</button>
            </div>
            <div className="space-y-2">
              {displayedAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 bg-navy-900/30 rounded-lg p-3 hover:bg-navy-900/50 transition-colors">
                  <AlertBadge type={alert.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300">{alert.message}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{alert.deviceName} &middot; {alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Device Grid */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-4">Device Quick View</h3>
            <div className="grid grid-cols-4 gap-2">
              {devices.slice(0, 20).map((device) => (
                <Link href={`/devices/${device.id}`} key={device.id} className="aspect-square bg-navy-900/50 rounded-lg border border-slate-800/30 flex flex-col items-center justify-center gap-0.5 hover:border-carbon-500/20 transition-all cursor-pointer group relative" title={`${device.name}\n${device.ip}\n${device.model}\nClients: ${device.clients}\nRole: ${device.role}`}>
                  {device.model === "RT-AX55" ? (
                    <Image src="/rt-ax55.png" alt="" width={28} height={28} className="object-contain opacity-60 group-hover:opacity-90 transition-opacity" />
                  ) : (
                    <MiniRouterIcon model={device.model} />
                  )}
                  <DeviceStatusDot status={device.status} />
                  <span className="text-[7px] text-slate-500 group-hover:text-slate-300 truncate max-w-full px-0.5">{device.name.split("-")[0]}</span>
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-b-lg ${
                    device.role === "gateway" ? "bg-carbon-500/60" :
                    device.role === "access-point" ? "bg-blue-500/60" :
                    device.role === "mesh-node" ? "bg-amber-500/60" :
                    "bg-purple-500/60"
                  }`} />
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/30 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">{stats.totalDevices} total devices</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {stats.onlineDevices}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {stats.warningDevices}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {stats.offlineDevices}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
