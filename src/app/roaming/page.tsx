"use client";

import { devices } from "@/lib/mock-data";
import { useState } from "react";

const roamingEvents = [
  { id: "r-01", client: "iPhone 15 Pro", mac: "3C:06:30:A1:B2:01", from: "Floor2-East-01", to: "Floor2-West-01", time: "14:32:15", rssiFrom: -72, rssiTo: -45, seamless: true, band: "5GHz" },
  { id: "r-02", client: "MacBook Air M2", mac: "A4:83:E7:22:D3:02", from: "Cafeteria-01", to: "Break-Room-01", time: "14:28:03", rssiFrom: -78, rssiTo: -52, seamless: true, band: "5GHz" },
  { id: "r-03", client: "Galaxy S24", mac: "B0:72:BF:45:E6:03", from: "Training-01", to: "Conf-Room-01", time: "14:25:47", rssiFrom: -80, rssiTo: -48, seamless: false, band: "2.4GHz" },
  { id: "r-04", client: "ThinkPad X1", mac: "54:E1:AD:78:F9:04", from: "Guest-Net-01", to: "Exec-Suite-01", time: "14:20:12", rssiFrom: -75, rssiTo: -44, seamless: true, band: "5GHz" },
  { id: "r-05", client: "iPad Pro 12.9", mac: "DC:A6:32:9B:C1:05", from: "Branch-North-01", to: "Parking-AP-01", time: "14:15:00", rssiFrom: -82, rssiTo: -60, seamless: false, band: "2.4GHz" },
  { id: "r-06", client: "Surface Pro 9", mac: "C8:E0:EB:11:A4:06", from: "Lab-AP-01", to: "Server-Room-01", time: "14:10:33", rssiFrom: -68, rssiTo: -42, seamless: true, band: "5GHz" },
  { id: "r-07", client: "Pixel 8 Pro", mac: "94:B8:6D:55:D7:07", from: "Warehouse-01", to: "Loading-Dock-01", time: "14:05:18", rssiFrom: -76, rssiTo: -50, seamless: true, band: "5GHz" },
  { id: "r-08", client: "Dell XPS 15", mac: "F4:8C:50:33:E2:08", from: "Core-Gateway-01", to: "Branch-South-01", time: "13:58:42", rssiFrom: -70, rssiTo: -46, seamless: true, band: "5GHz" },
  { id: "r-09", client: "Ring Doorbell", mac: "A0:D0:DC:AA:B1:09", from: "Security-AP-01", to: "Parking-AP-01", time: "13:52:10", rssiFrom: -85, rssiTo: -72, seamless: false, band: "2.4GHz" },
  { id: "r-10", client: "Zoom Room Kit", mac: "E8:48:B8:C4:D5:10", from: "Conf-Room-01", to: "Training-01", time: "13:45:55", rssiFrom: -65, rssiTo: -40, seamless: true, band: "5GHz" },
];

const roamingConfig = {
  enabled: true,
  rssiThreshold: -70,
  roamingAggressiveness: "medium",
  bandSteering: true,
  minRoamInterval: 5,
  "802.11k": true,
  "802.11v": true,
  "802.11r": true,
};

function RssiBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, ((value + 100) / 60) * 100));
  const color = pct > 60 ? "bg-green-500" : pct > 35 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-400 w-10">{value} dBm</span>
    </div>
  );
}

export default function RoamingPage() {
  const [tab, setTab] = useState<"events" | "config" | "heatmap">("events");
  const seamlessCount = roamingEvents.filter((e) => e.seamless).length;
  const failedCount = roamingEvents.length - seamlessCount;

  return (
    <div className="min-h-screen grid-bg">
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Client Roaming</h1>
            <p className="text-xs text-slate-500 mt-0.5">802.11k/v/r roaming management across RT-AX55 fleet</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              AI Optimize Roaming
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Roams (24h)</p>
            <p className="text-2xl font-bold text-white">{roamingEvents.length * 12}</p>
            <p className="text-[10px] text-slate-500 mt-1">Across all APs</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Seamless Rate</p>
            <p className="text-2xl font-bold text-green-400">{Math.round((seamlessCount / roamingEvents.length) * 100)}%</p>
            <p className="text-[10px] text-slate-500 mt-1">{failedCount} disrupted roams</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Avg Roam Time</p>
            <p className="text-2xl font-bold text-carbon-400">42ms</p>
            <p className="text-[10px] text-slate-500 mt-1">802.11r fast transition</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sticky Clients</p>
            <p className="text-2xl font-bold text-amber-400">4</p>
            <p className="text-[10px] text-slate-500 mt-1">AI recommends forced roam</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1 mb-6 w-fit">
          {(["events", "config", "heatmap"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded text-xs capitalize transition-colors ${tab === t ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}>
              {t === "events" ? "Roam Events" : t === "config" ? "Configuration" : "Signal Heatmap"}
            </button>
          ))}
        </div>

        {tab === "events" && (
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 overflow-hidden card-glow">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Time</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Client</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">From AP</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">RSSI</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">To AP</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">RSSI</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Band</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {roamingEvents.map((evt) => (
                  <tr key={evt.id} className="border-b border-slate-800/20 hover:bg-navy-900/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{evt.time}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white">{evt.client}</p>
                      <p className="text-[9px] text-slate-600 font-mono">{evt.mac}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{evt.from}</td>
                    <td className="px-4 py-3"><RssiBar value={evt.rssiFrom} /></td>
                    <td className="px-4 py-3 text-xs text-slate-300">{evt.to}</td>
                    <td className="px-4 py-3"><RssiBar value={evt.rssiTo} /></td>
                    <td className="px-4 py-3 text-[10px] text-slate-400">{evt.band}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${evt.seamless ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {evt.seamless ? "Seamless" : "Disrupted"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "config" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
              <h3 className="text-sm font-semibold text-white mb-4">Roaming Standards</h3>
              <div className="space-y-4">
                {[
                  { key: "802.11k", label: "802.11k (Neighbor Reports)", desc: "Provides clients a list of neighboring APs to speed roaming decisions", enabled: roamingConfig["802.11k"] },
                  { key: "802.11v", label: "802.11v (BSS Transition)", desc: "Allows APs to suggest clients move to a better AP", enabled: roamingConfig["802.11v"] },
                  { key: "802.11r", label: "802.11r (Fast Transition)", desc: "Pre-authenticates with target AP for sub-50ms handoff", enabled: roamingConfig["802.11r"] },
                ].map((proto) => (
                  <div key={proto.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">{proto.label}</p>
                      <p className="text-[10px] text-slate-500">{proto.desc}</p>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${proto.enabled ? "bg-carbon-500" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${proto.enabled ? "translate-x-4" : ""}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
              <h3 className="text-sm font-semibold text-white mb-4">Roaming Thresholds</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-white">RSSI Threshold</p><p className="text-[10px] text-slate-500">Force roam when signal drops below</p></div>
                  <span className="text-xs font-mono text-carbon-400 bg-navy-900 px-3 py-1 rounded border border-slate-800/50">{roamingConfig.rssiThreshold} dBm</span>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-white">Aggressiveness</p><p className="text-[10px] text-slate-500">How quickly to trigger roaming</p></div>
                  <span className="text-xs text-carbon-400 capitalize bg-navy-900 px-3 py-1 rounded border border-slate-800/50">{roamingConfig.roamingAggressiveness}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-white">Band Steering</p><p className="text-[10px] text-slate-500">Prefer 5GHz for capable clients</p></div>
                  <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer bg-carbon-500`}><div className="w-3 h-3 rounded-full bg-white translate-x-4" /></div>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-white">Min Roam Interval</p><p className="text-[10px] text-slate-500">Minimum seconds between roaming events</p></div>
                  <span className="text-xs font-mono text-carbon-400 bg-navy-900 px-3 py-1 rounded border border-slate-800/50">{roamingConfig.minRoamInterval}s</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "heatmap" && (
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-4">Signal Strength Heatmap</h3>
            <p className="text-xs text-slate-500 mb-6">RSSI coverage distribution across managed APs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.filter((d) => d.status !== "offline").slice(0, 12).map((device) => {
                const mockRssi = -(30 + Math.floor(Math.random() * 50));
                const signalPct = Math.max(0, ((mockRssi + 100) / 60) * 100);
                return (
                  <div key={device.id} className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white font-medium">{device.name}</span>
                      <span className={`text-[10px] font-mono ${signalPct > 60 ? "text-green-400" : signalPct > 35 ? "text-amber-400" : "text-red-400"}`}>{mockRssi} dBm</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${signalPct > 60 ? "bg-gradient-to-r from-green-600 to-green-400" : signalPct > 35 ? "bg-gradient-to-r from-amber-600 to-amber-400" : "bg-gradient-to-r from-red-600 to-red-400"}`} style={{ width: `${signalPct}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1">{device.clients} connected clients</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
