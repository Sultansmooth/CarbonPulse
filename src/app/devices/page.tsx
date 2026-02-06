"use client";

import { devices, clientDevices } from "@/lib/mock-data";
import type { DeviceRole, ClientDeviceType } from "@/lib/mock-data";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PageTab = "all" | "infrastructure" | "clients";
type FilterStatus = "all" | "online" | "offline" | "warning" | "idle";
type FilterType = "all" | ClientDeviceType;



const roleLabels: Record<DeviceRole, string> = {
  gateway: "Gateway",
  "access-point": "AP",
  "mesh-node": "Mesh",
  repeater: "Repeater",
};

const deviceTypeColors: Record<ClientDeviceType, string> = {
  phone: "text-blue-400",
  laptop: "text-cyan-400",
  desktop: "text-slate-300",
  printer: "text-amber-400",
  tablet: "text-purple-400",
  iot: "text-green-400",
  "smart-tv": "text-pink-400",
  gaming: "text-red-400",
  voip: "text-orange-400",
  camera: "text-yellow-400",
};

const deviceTypeBgColors: Record<ClientDeviceType, string> = {
  phone: "from-blue-900/40 to-blue-950/60 border-blue-500/20",
  laptop: "from-cyan-900/40 to-cyan-950/60 border-cyan-500/20",
  desktop: "from-slate-800/60 to-slate-900/60 border-slate-500/20",
  printer: "from-amber-900/40 to-amber-950/60 border-amber-500/20",
  tablet: "from-purple-900/40 to-purple-950/60 border-purple-500/20",
  iot: "from-green-900/40 to-green-950/60 border-green-500/20",
  "smart-tv": "from-pink-900/40 to-pink-950/60 border-pink-500/20",
  gaming: "from-red-900/40 to-red-950/60 border-red-500/20",
  voip: "from-orange-900/40 to-orange-950/60 border-orange-500/20",
  camera: "from-yellow-900/40 to-yellow-950/60 border-yellow-500/20",
};

const deviceTypeLabels: Record<ClientDeviceType, string> = {
  phone: "Phone",
  laptop: "Laptop",
  desktop: "Desktop",
  printer: "Printer",
  tablet: "Tablet",
  iot: "IoT",
  "smart-tv": "Smart TV",
  gaming: "Gaming",
  voip: "VoIP",
  camera: "Camera",
};

function InfraDeviceIcon({ model, className = "w-10 h-10" }: { model: string; className?: string }) {
  if (model === "RT-AX55") {
    return null; // Will use product image
  }
  // Generic router SVG icons for non-AX55 models
  if (model === "RT-AX88U") {
    // High-end router with antennas
    return (
      <svg className={`${className} text-slate-300`} fill="none" viewBox="0 0 48 48" strokeWidth={1.2} stroke="currentColor">
        <rect x="8" y="20" width="32" height="14" rx="3" />
        <line x1="14" y1="20" x2="11" y2="8" strokeLinecap="round" />
        <line x1="24" y1="20" x2="24" y2="6" strokeLinecap="round" />
        <line x1="34" y1="20" x2="37" y2="8" strokeLinecap="round" />
        <circle cx="14" cy="27" r="1.5" fill="currentColor" />
        <circle cx="20" cy="27" r="1.5" fill="currentColor" />
        <circle cx="26" cy="27" r="1.5" fill="currentColor" />
        <circle cx="32" cy="27" r="1.5" fill="currentColor" />
        <line x1="12" y1="38" x2="18" y2="34" strokeLinecap="round" />
        <line x1="36" y1="38" x2="30" y2="34" strokeLinecap="round" />
      </svg>
    );
  }
  if (model === "RT-AX58U") {
    // Mid-range router
    return (
      <svg className={`${className} text-slate-300`} fill="none" viewBox="0 0 48 48" strokeWidth={1.2} stroke="currentColor">
        <rect x="10" y="22" width="28" height="12" rx="2.5" />
        <line x1="16" y1="22" x2="13" y2="10" strokeLinecap="round" />
        <line x1="32" y1="22" x2="35" y2="10" strokeLinecap="round" />
        <circle cx="16" cy="28" r="1.5" fill="currentColor" />
        <circle cx="22" cy="28" r="1.5" fill="currentColor" />
        <circle cx="28" cy="28" r="1.5" fill="currentColor" />
        <line x1="14" y1="38" x2="18" y2="34" strokeLinecap="round" />
        <line x1="34" y1="38" x2="30" y2="34" strokeLinecap="round" />
      </svg>
    );
  }
  if (model === "RP-AX56") {
    // Range extender / repeater
    return (
      <svg className={`${className} text-slate-300`} fill="none" viewBox="0 0 48 48" strokeWidth={1.2} stroke="currentColor">
        <rect x="16" y="18" width="16" height="20" rx="3" />
        <path d="M12 16c3.3-3.3 8.7-3.3 12 0" />
        <path d="M8 12c5.5-5.5 14.5-5.5 20 0" />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" />
        <circle cx="24" cy="30" r="1.5" fill="currentColor" />
        <line x1="20" y1="38" x2="20" y2="42" strokeLinecap="round" />
        <line x1="28" y1="38" x2="28" y2="42" strokeLinecap="round" />
      </svg>
    );
  }
  // Default generic router
  return (
    <svg className={`${className} text-slate-300`} fill="none" viewBox="0 0 48 48" strokeWidth={1.2} stroke="currentColor">
      <rect x="10" y="22" width="28" height="12" rx="2.5" />
      <path d="M16 14c4.4-4.4 11.6-4.4 16 0" />
      <path d="M20 18c2.2-2.2 5.8-2.2 8 0" />
      <circle cx="16" cy="28" r="1.5" fill="currentColor" />
      <circle cx="24" cy="28" r="1.5" fill="currentColor" />
      <circle cx="32" cy="28" r="1.5" fill="currentColor" />
    </svg>
  );
}

function UptimeBar({ seed = 0 }: { seed?: number }) {
  // Generate 30 days of deterministic mock uptime data based on seed
  const days = Array.from({ length: 30 }, (_, i) => {
    const hash = ((seed + 1) * 2654435761 + (i + 1) * 340573321) >>> 0;
    const rand = (hash % 1000) / 1000;
    if (rand > 0.92) return "outage";
    if (rand > 0.82) return "congestion";
    return "healthy";
  });
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    congestion: "bg-amber-500",
    outage: "bg-red-500",
  };
  const healthyCount = days.filter(d => d === "healthy").length;
  const pct = ((healthyCount / 30) * 100).toFixed(1);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-slate-500">30-day uptime</span>
        <span className="text-[9px] text-slate-400">{pct}%</span>
      </div>
      <div className="flex gap-[1px] h-[6px] rounded overflow-hidden">
        {days.map((status, i) => (
          <div key={i} className={`flex-1 ${colors[status]}`} title={`Day ${i + 1}: ${status}`} />
        ))}
      </div>
    </div>
  );
}

function DeviceTypeIcon({ type, className = "w-5 h-5" }: { type: ClientDeviceType; className?: string }) {
  const color = deviceTypeColors[type];
  const cls = `${className} ${color}`;

  switch (type) {
    case "phone":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      );
    case "laptop":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
        </svg>
      );
    case "desktop":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
        </svg>
      );
    case "printer":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
        </svg>
      );
    case "tablet":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    case "iot":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      );
    case "smart-tv":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
    case "gaming":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.108-.128-2.03-.738-2.642-1.59l-.354-.53c-.45-.673-.952-1.303-1.532-1.862M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      );
    case "voip":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      );
    case "camera":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
  }
}


function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    online: "bg-green-500/10 text-green-400 border-green-500/20",
    offline: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    updating: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    idle: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full border ${styles[status] || styles.offline}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function RssiIndicator({ rssi }: { rssi: number }) {
  if (rssi === 0) return <span className="text-[10px] text-slate-500">Wired</span>;
  const pct = Math.max(0, Math.min(100, ((rssi + 100) / 60) * 100));
  const bars = pct > 75 ? 4 : pct > 50 ? 3 : pct > 25 ? 2 : 1;
  const color = bars >= 3 ? "bg-green-400" : bars === 2 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-end gap-[2px] h-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-[3px] rounded-sm ${i <= bars ? color : "bg-slate-700"}`} style={{ height: `${i * 25}%` }} />
        ))}
      </div>
      <span className="text-[10px] text-slate-500">{rssi} dBm</span>
    </div>
  );
}

export default function DevicesPage() {
  const [tab, setTab] = useState<PageTab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  const onlineInfra = devices.filter((d) => d.status === "online").length;
  const onlineClients = clientDevices.filter((d) => d.status === "online").length;
  const totalAll = devices.length + clientDevices.length;

  const filteredInfra = devices.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.ip.includes(search) && !d.mac.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredClients = clientDevices.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.ip.includes(search) && !d.mac.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clientTypeCounts = clientDevices.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Device Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">{totalAll} devices on network &middot; {onlineInfra + onlineClients} online</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              Discover Devices
            </button>
            <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Infrastructure", value: devices.length, sub: `${onlineInfra} online`, color: "text-carbon-400" },
            { label: "Clients", value: clientDevices.length, sub: `${onlineClients} online`, color: "text-blue-400" },
            { label: "Phones", value: clientTypeCounts["phone"] || 0, sub: "Mobile devices", color: "text-blue-400" },
            { label: "Laptops", value: clientTypeCounts["laptop"] || 0, sub: "Portable PCs", color: "text-cyan-400" },
            { label: "Printers", value: clientTypeCounts["printer"] || 0, sub: "Print devices", color: "text-amber-400" },
            { label: "IoT / Cameras", value: (clientTypeCounts["iot"] || 0) + (clientTypeCounts["camera"] || 0), sub: "Smart devices", color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-navy-850 rounded-xl border border-slate-800/50 p-4 card-glow">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1">
            {([
              { key: "all" as const, label: "All Devices", count: totalAll },
              { key: "infrastructure" as const, label: "Infrastructure", count: devices.length },
              { key: "clients" as const, label: "Network Devices", count: clientDevices.length },
            ]).map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setTypeFilter("all"); }} className={`px-4 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${tab === t.key ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}>
                {t.label}
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded">{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, IP, or MAC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-850 border border-slate-800/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-carbon-500/30"
            />
          </div>
          <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1">
            {(["all", "online", "offline", "idle"] as FilterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded text-xs capitalize transition-colors ${statusFilter === s ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
          {(tab === "clients" || tab === "all") && (
            <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1 flex-wrap">
              <button onClick={() => setTypeFilter("all")} className={`px-3 py-1.5 rounded text-xs transition-colors ${typeFilter === "all" ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}>All Types</button>
              {(["phone", "laptop", "desktop", "printer", "tablet", "camera", "iot", "voip", "smart-tv", "gaming"] as ClientDeviceType[]).map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`px-2 py-1.5 rounded text-xs capitalize transition-colors ${typeFilter === t ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}>
                  {deviceTypeLabels[t]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infrastructure Devices */}
        {(tab === "all" || tab === "infrastructure") && typeFilter === "all" && (
          <>
            {tab === "all" && <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" /></svg>
              Infrastructure ({filteredInfra.length})
            </h2>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {filteredInfra.map((device) => (
                <Link href={`/devices/${device.id}`} key={device.id} className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow hover:border-slate-700/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-navy-900/60 border border-slate-800/30 flex items-center justify-center overflow-hidden group-hover:border-slate-700/50 transition-colors">
                        {device.model === "RT-AX55" ? (
                          <Image src="/rt-ax55.png" alt="RT-AX55" width={44} height={44} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <InfraDeviceIcon model={device.model} className="w-10 h-10" />
                        )}
                        <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${
                          device.role === "gateway" ? "bg-carbon-500" :
                          device.role === "access-point" ? "bg-blue-500" :
                          device.role === "mesh-node" ? "bg-amber-500" :
                          "bg-purple-500"
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{device.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{device.ip}</p>
                        <p className="text-[9px] text-slate-600">{device.model}</p>
                      </div>
                    </div>
                    <StatusBadge status={device.status} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      device.role === "gateway" ? "bg-carbon-500/10 text-carbon-400 border-carbon-500/20" :
                      device.role === "access-point" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      device.role === "mesh-node" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    }`}>{roleLabels[device.role]}</span>
                    <span className="text-[9px] text-slate-600">{device.connectionType}</span>
                    <span className="text-[9px] text-slate-600">&middot; {device.clients} clients</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5"><span className="text-slate-500">CPU</span><span className="text-slate-400">{device.cpuUsage}%</span></div>
                      <ProgressBar value={device.cpuUsage} color={device.cpuUsage > 80 ? "bg-red-500" : device.cpuUsage > 60 ? "bg-amber-500" : "bg-carbon-500"} />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5"><span className="text-slate-500">Memory</span><span className="text-slate-400">{device.memUsage}%</span></div>
                      <ProgressBar value={device.memUsage} color={device.memUsage > 80 ? "bg-red-500" : device.memUsage > 60 ? "bg-amber-500" : "bg-blue-500"} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <UptimeBar seed={parseInt(device.id.replace(/\D/g, ""), 10)} />
                  </div>
                  <div className="pt-3 border-t border-slate-800/30 grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-[10px] text-slate-500">DL</p><p className="text-xs font-semibold text-carbon-400">{device.download.toFixed(0)}</p></div>
                    <div><p className="text-[10px] text-slate-500">UL</p><p className="text-xs font-semibold text-blue-400">{device.upload.toFixed(0)}</p></div>
                    <div><p className="text-[10px] text-slate-500">AI</p><p className={`text-xs font-semibold ${device.aiScore >= 80 ? "text-green-400" : device.aiScore >= 50 ? "text-amber-400" : "text-red-400"}`}>{device.aiScore}</p></div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Client / Network Devices */}
        {(tab === "all" || tab === "clients") && (
          <>
            {tab === "all" && typeFilter === "all" && <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              Network Devices ({filteredClients.length})
            </h2>}
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 overflow-hidden card-glow">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Device</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">IP</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">MAC</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Connected To</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Band</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Signal</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Data (24h)</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">OS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((cd) => {
                    const ap = devices.find((d) => d.id === cd.connectedTo);
                    return (
                      <tr key={cd.id} className="border-b border-slate-800/20 hover:bg-navy-900/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${deviceTypeBgColors[cd.type]} flex items-center justify-center border`}>
                              <DeviceTypeIcon type={cd.type} className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-white font-medium">{cd.name}</p>
                              <p className="text-[10px] text-slate-600">{cd.manufacturer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] capitalize ${deviceTypeColors[cd.type]}`}>{deviceTypeLabels[cd.type]}</span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={cd.status} /></td>
                        <td className="px-4 py-3 text-xs text-slate-300 font-mono">{cd.ip}</td>
                        <td className="px-4 py-3 text-[10px] text-slate-400 font-mono">{cd.mac}</td>
                        <td className="px-4 py-3">
                          {ap ? (
                            <Link href={`/devices/${ap.id}`} className="text-xs text-carbon-400 hover:text-carbon-300">{ap.name}</Link>
                          ) : (
                            <span className="text-xs text-slate-500">Unknown</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            cd.band === "5GHz" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            cd.band === "2.4GHz" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          }`}>{cd.band}</span>
                        </td>
                        <td className="px-4 py-3"><RssiIndicator rssi={cd.rssi} /></td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {cd.dataUsage >= 1000 ? `${(cd.dataUsage / 1000).toFixed(1)} GB` : `${cd.dataUsage} MB`}
                        </td>
                        <td className="px-4 py-3 text-[10px] text-slate-400">{cd.os}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
