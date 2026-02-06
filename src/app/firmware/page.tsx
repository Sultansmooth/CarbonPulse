"use client";

import { devices } from "@/lib/mock-data";

export default function FirmwarePage() {
  const outdated = devices.filter((d) => d.firmware !== "3.0.0.6_386");
  const upToDate = devices.filter((d) => d.firmware === "3.0.0.6_386");

  return (
    <div className="min-h-screen grid-bg">
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Firmware Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and deploy firmware across your fleet</p>
          </div>
          <button className="text-xs bg-carbon-600 text-white px-4 py-1.5 rounded-lg hover:bg-carbon-500 transition-colors font-medium">
            Start Staged Rollout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Latest Version</p>
            <p className="text-xl font-bold text-carbon-400 font-mono">3.0.0.6_386</p>
            <p className="text-[10px] text-slate-500 mt-1">Released Jan 15, 2026</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Up To Date</p>
            <p className="text-xl font-bold text-green-400">{upToDate.length} / {devices.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">{Math.round((upToDate.length / devices.length) * 100)}% fleet coverage</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending Updates</p>
            <p className="text-xl font-bold text-amber-400">{outdated.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">AI rollout plan ready</p>
          </div>
        </div>

        {/* Outdated devices */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Devices Needing Update</h3>
          <div className="space-y-2">
            {outdated.map((d) => (
              <div key={d.id} className="flex items-center justify-between bg-navy-900/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.status === "offline" ? "bg-red-400" : d.status === "updating" ? "bg-blue-400 animate-pulse" : "bg-amber-400"}`} />
                  <div>
                    <p className="text-xs text-white font-medium">{d.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Current: {d.firmware}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">AI Risk</p>
                    <p className="text-xs font-semibold text-green-400">Low</p>
                  </div>
                  <button className={`text-[10px] px-3 py-1 rounded border transition-colors ${
                    d.status === "updating"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-carbon-500/10 text-carbon-400 border-carbon-500/20 hover:bg-carbon-500/20"
                  }`}>
                    {d.status === "updating" ? "Updating..." : "Update Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rollout plan */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-4">AI Rollout Plan</h3>
          <div className="space-y-4">
            {[
              { phase: "Phase 1", devices: "Low-traffic APs (Storage, Parking)", count: 2, risk: "Minimal", time: "15 min" },
              { phase: "Phase 2", devices: "Medium-traffic APs (Labs, Warehouse)", count: 1, risk: "Low", time: "20 min" },
              { phase: "Phase 3", devices: "High-traffic APs (after business hours)", count: 1, risk: "Medium", time: "30 min" },
            ].map((phase, i) => (
              <div key={i} className="flex items-center gap-4 bg-navy-900/30 rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-carbon-500/10 border border-carbon-500/20 flex items-center justify-center text-xs font-bold text-carbon-400">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{phase.phase}</p>
                  <p className="text-[10px] text-slate-500">{phase.devices}</p>
                </div>
                <div className="text-right text-[10px]">
                  <p className="text-slate-400">{phase.count} devices</p>
                  <p className="text-slate-500">Est: {phase.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
