"use client";

import { sites } from "@/lib/sites-data";
import Link from "next/link";

function StatusIndicator({ status }: { status: "healthy" | "warning" | "critical" }) {
  const config = {
    healthy: { color: "bg-green-400", label: "Healthy", textColor: "text-green-400" },
    warning: { color: "bg-amber-400", label: "Warning", textColor: "text-amber-400" },
    critical: { color: "bg-red-400", label: "Critical", textColor: "text-red-400" },
  };
  const c = config[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${c.color} ${status === "healthy" ? "animate-pulse" : ""}`} />
      <span className={`text-xs font-medium ${c.textColor}`}>{c.label}</span>
    </div>
  );
}

function SiteUptimeBar({ seed }: { seed: number }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const hash = ((seed + 1) * 2654435761 + (i + 1) * 340573321) >>> 0;
    const rand = (hash % 1000) / 1000;
    if (rand > 0.95) return "outage";
    if (rand > 0.85) return "congestion";
    return "healthy";
  });
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    congestion: "bg-amber-500",
    outage: "bg-red-500",
  };
  return (
    <div className="flex gap-[1px] h-[4px] rounded overflow-hidden">
      {days.map((status, i) => (
        <div key={i} className={`flex-1 ${colors[status]}`} />
      ))}
    </div>
  );
}

export default function SitesPage() {
  const totalDevices = sites.reduce((sum, s) => sum + s.deviceCount, 0);
  const totalClients = sites.reduce((sum, s) => sum + s.clientCount, 0);
  const healthySites = sites.filter((s) => s.status === "healthy").length;

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-carbon-500 to-carbon-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Carbon Pulse</h1>
              <p className="text-[10px] text-carbon-400 uppercase tracking-widest">Network Management Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-800/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Sites</p>
            <p className="text-2xl font-bold text-white">{sites.length}</p>
            <p className="text-xs text-slate-500 mt-1">{healthySites} healthy</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Devices</p>
            <p className="text-2xl font-bold text-carbon-400">{totalDevices}</p>
            <p className="text-xs text-slate-500 mt-1">Across all sites</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Connected Clients</p>
            <p className="text-2xl font-bold text-blue-400">{totalClients}</p>
            <p className="text-xs text-slate-500 mt-1">Active endpoints</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Avg AI Score</p>
            <p className="text-2xl font-bold text-green-400">{Math.round(sites.reduce((sum, s) => sum + s.aiScore, 0) / sites.length)}</p>
            <p className="text-xs text-slate-500 mt-1">Network intelligence</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Your Sites</h2>
            <p className="text-sm text-slate-500 mt-0.5">Select a site to manage its network</p>
          </div>
          <button className="text-xs bg-carbon-500/10 text-carbon-400 px-4 py-2 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
            + Add Site
          </button>
        </div>

        {/* Site Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, idx) => (
            <Link
              key={site.id}
              href={`/site/${site.id}`}
              className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow transition-all hover:border-carbon-500/30 hover:scale-[1.01] group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    site.status === "healthy" ? "bg-green-500/10 border border-green-500/20" :
                    site.status === "warning" ? "bg-amber-500/10 border border-amber-500/20" :
                    "bg-red-500/10 border border-red-500/20"
                  }`}>
                    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-carbon-400 transition-colors">{site.name}</h3>
                    <p className="text-[10px] text-slate-500">{site.location}</p>
                  </div>
                </div>
                <StatusIndicator status={site.status} />
              </div>

              <p className="text-xs text-slate-400 mb-4">{site.description}</p>

              {/* Uptime bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-slate-500">30-day uptime</span>
                  <span className="text-[9px] text-slate-400">{site.uptime}</span>
                </div>
                <SiteUptimeBar seed={idx * 100 + site.deviceCount} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{site.deviceCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Devices</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{site.clientCount}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Clients</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-carbon-400">{site.aiScore}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">AI Score</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-400">{site.bandwidth}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Bandwidth</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/30 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Updated {site.lastUpdated}</span>
                <span className="text-xs text-carbon-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
