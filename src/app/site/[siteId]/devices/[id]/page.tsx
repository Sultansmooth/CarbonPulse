"use client";

import { devices } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// --------------- Inline mock data generators ---------------

function generateMockClients(deviceId: string, count: number) {
  const names = [
    "MacBook-Pro-Sarah", "iPhone-15-Pro", "Galaxy-S24-Ultra", "iPad-Air-5",
    "ThinkPad-X1-Carbon", "Pixel-8-Pro", "Surface-Laptop-5", "Chromecast-4K",
    "HP-LaserJet-Pro", "Ring-Doorbell", "Sonos-One", "Apple-TV-4K",
    "Dell-Monitor-USB", "Echo-Dot-5th", "Canon-Printer-MX",
  ];
  const bands: ("2.4 GHz" | "5 GHz")[] = ["2.4 GHz", "5 GHz"];
  const seed = deviceId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  return Array.from({ length: count }, (_, i) => {
    const s = (seed * (i + 1)) % 255;
    return {
      name: names[(seed + i) % names.length],
      mac: `${hex(s)}:${hex(s + 11)}:${hex(s + 22)}:${hex(s + 33)}:${hex(s + 44)}:${hex(s + 55 + i)}`,
      band: bands[(seed + i) % 2],
      rssi: -1 * (30 + ((seed * (i + 3)) % 45)),
      dataUsage: Math.round((((seed * (i + 7)) % 900) + 10) * 10) / 10,
    };
  });
}

function hex(n: number) {
  return (n % 256).toString(16).padStart(2, "0").toUpperCase();
}

function generateHourlyThroughput(deviceId: string) {
  const seed = deviceId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: 24 }, (_, h) => {
    const workFactor = h >= 8 && h <= 17 ? 1.8 : h >= 6 && h <= 20 ? 1.0 : 0.4;
    const dl = Math.round((50 + ((seed * (h + 1)) % 150)) * workFactor);
    const ul = Math.round(dl * (0.15 + ((seed * h) % 30) / 100));
    return {
      hour: `${h.toString().padStart(2, "0")}:00`,
      download: dl,
      upload: ul,
    };
  });
}

function generateChannelUtilization(deviceChannel: number) {
  return Array.from({ length: 11 }, (_, i) => {
    const ch = i + 1;
    const isOccupied = ch === deviceChannel;
    const base = isOccupied ? 45 + Math.round(Math.random() * 25) : 5 + Math.round(Math.random() * 30);
    return { channel: ch, utilization: base };
  });
}

function generateAiInsights(device: { cpuUsage: number; memUsage: number; clients: number; channel2g: number; firmware: string; aiScore: number }) {
  const insights: { title: string; description: string; severity: "info" | "warning" | "critical" }[] = [];

  if (device.cpuUsage > 60) {
    insights.push({
      title: "High CPU Load Detected",
      description: `CPU utilization is at ${device.cpuUsage}%. Consider redistributing ${Math.ceil(device.clients * 0.3)} clients to neighboring APs to reduce processing overhead.`,
      severity: "warning",
    });
  } else {
    insights.push({
      title: "Resource Headroom Available",
      description: `CPU at ${device.cpuUsage}% and memory at ${device.memUsage}% leave significant capacity. This AP could absorb ${Math.floor((100 - device.cpuUsage) / 4)} additional clients.`,
      severity: "info",
    });
  }

  if (device.channel2g === 6) {
    insights.push({
      title: "Channel Congestion Risk",
      description: "Channel 6 on 2.4 GHz is the most commonly used channel in this deployment. Switching to channel 1 or 11 could reduce co-channel interference by up to 40%.",
      severity: "warning",
    });
  } else {
    insights.push({
      title: "Optimal Channel Assignment",
      description: `Channel ${device.channel2g} shows minimal overlap with neighboring APs. Current assignment is near-optimal for this location.`,
      severity: "info",
    });
  }

  if (device.firmware !== "3.0.0.6_386") {
    insights.push({
      title: "Firmware Update Available",
      description: `Running ${device.firmware}. Version 3.0.0.6_386 includes critical security patches and a 12% improvement in WPA3 handshake latency.`,
      severity: "critical",
    });
  } else {
    insights.push({
      title: "TX Power Optimization",
      description: "AI analysis suggests reducing 2.4 GHz TX power by 3 dBm to minimize co-channel interference with adjacent APs without impacting client signal quality.",
      severity: "info",
    });
  }

  return insights;
}

// --------------- SVG gauge component ---------------

function ResourceGauge({ label, value, color, unit = "%" }: { label: string; value: number; color: string; unit?: string }) {
  const radius = 54;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270-degree arc
  const offset = arcLength - (value / 100) * arcLength;
  const rotation = 135; // start at bottom-left

  const colorMap: Record<string, { track: string; fill: string; text: string }> = {
    teal: { track: "rgba(20,184,166,0.1)", fill: "rgb(20,184,166)", text: "text-carbon-400" },
    blue: { track: "rgba(59,130,246,0.1)", fill: "rgb(59,130,246)", text: "text-blue-400" },
    amber: { track: "rgba(245,158,11,0.1)", fill: "rgb(245,158,11)", text: "text-amber-400" },
    red: { track: "rgba(239,68,68,0.1)", fill: "rgb(239,68,68)", text: "text-red-400" },
  };

  const resolvedColor = value > 80 ? "red" : value > 60 ? "amber" : color;
  const c = colorMap[resolvedColor] || colorMap.teal;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="120" viewBox="0 0 140 120">
        <g transform={`rotate(${rotation}, 70, 65)`}>
          <circle cx="70" cy="65" r={radius} fill="none" stroke={c.track} strokeWidth={stroke} strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round" />
          <circle cx="70" cy="65" r={radius} fill="none" stroke={c.fill} strokeWidth={stroke} strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </g>
        <text x="70" y="62" textAnchor="middle" className={c.text} fill="currentColor" fontSize="26" fontWeight="700">
          {value}
        </text>
        <text x="70" y="80" textAnchor="middle" fill="#64748b" fontSize="11">
          {unit}
        </text>
      </svg>
      <span className="text-xs text-slate-400 mt-1">{label}</span>
    </div>
  );
}

// --------------- Status / Role badge helpers ---------------

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    online: "bg-green-500/10 text-green-400 border-green-500/20",
    offline: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    updating: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-full border font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    gateway: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "access-point": "bg-carbon-500/10 text-carbon-400 border-carbon-500/20",
    "mesh-node": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    repeater: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-full border font-medium ${styles[role] || styles["access-point"]}`}>
      {role}
    </span>
  );
}

// --------------- Insight severity icon ---------------

function InsightIcon({ severity }: { severity: "info" | "warning" | "critical" }) {
  if (severity === "critical")
    return (
      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    );
  if (severity === "warning")
    return (
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zm0-13.5a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
        </svg>
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-lg bg-carbon-500/10 border border-carbon-500/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    </div>
  );
}

// --------------- Main Page Component ---------------

export default function DeviceDetailPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const id = params.id as string;
  const device = devices.find((d) => d.id === id);

  if (!device) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Device Not Found</h1>
          <p className="text-slate-500 mb-6 text-sm">No device matches ID &quot;{id}&quot;</p>
          <Link href={`/site/${siteId}/devices`} className="text-carbon-400 hover:text-carbon-300 text-sm underline underline-offset-4">
            Back to Devices
          </Link>
        </div>
      </div>
    );
  }

  const parentDevice = device.parentId ? devices.find((d) => d.id === device.parentId) : null;
  const mockClients = generateMockClients(device.id, Math.max(device.clients, 5));
  const hourlyData = generateHourlyThroughput(device.id);
  const channelUtil = generateChannelUtilization(device.channel2g);
  const aiInsights = generateAiInsights(device);

  // SVG throughput chart dimensions
  const chartW = 720;
  const chartH = 180;
  const chartPadL = 40;
  const chartPadR = 10;
  const chartPadT = 10;
  const chartPadB = 30;
  const plotW = chartW - chartPadL - chartPadR;
  const plotH = chartH - chartPadT - chartPadB;
  const maxThroughput = Math.max(...hourlyData.map((d) => Math.max(d.download, d.upload)), 1);

  function throughputPath(key: "download" | "upload") {
    return hourlyData
      .map((d, i) => {
        const x = chartPadL + (i / (hourlyData.length - 1)) * plotW;
        const y = chartPadT + plotH - (d[key] / maxThroughput) * plotH;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }

  function throughputArea(key: "download" | "upload") {
    const line = hourlyData.map((d, i) => {
      const x = chartPadL + (i / (hourlyData.length - 1)) * plotW;
      const y = chartPadT + plotH - (d[key] / maxThroughput) * plotH;
      return `${x},${y}`;
    });
    return `M${chartPadL},${chartPadT + plotH} L${line.join(" L")} L${chartPadL + plotW},${chartPadT + plotH} Z`;
  }

  // Channel bar chart
  const barChartW = 720;
  const barChartH = 200;
  const barPadL = 40;
  const barPadR = 10;
  const barPadT = 10;
  const barPadB = 35;
  const barPlotW = barChartW - barPadL - barPadR;
  const barPlotH = barChartH - barPadT - barPadB;
  const barW = barPlotW / 11 - 8;

  return (
    <div className="min-h-screen grid-bg">
      {/* ========== HEADER ========== */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/site/${siteId}/devices`}
              className="w-9 h-9 rounded-lg bg-navy-850 border border-slate-800/50 flex items-center justify-center hover:border-carbon-500/30 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">{device.name}</h1>
                <StatusBadge status={device.status} />
                <RoleBadge role={device.role} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {device.model} &middot; {device.ip} &middot; AI Score&nbsp;
                <span className={device.aiScore >= 80 ? "text-green-400" : device.aiScore >= 50 ? "text-amber-400" : "text-red-400"}>
                  {device.aiScore}/100
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs bg-navy-850 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800/50 hover:border-carbon-500/30 hover:text-carbon-400 transition-colors">
              Reboot
            </button>
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* ========== TOP: Image + Device Info + SSID/Radio ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Image */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 flex flex-col items-center justify-center gradient-border">
            <div className="relative w-full max-w-[220px] aspect-square mb-4">
              <Image src="/rt-ax55.png" alt="ASUS RT-AX55" fill className="object-contain drop-shadow-[0_0_30px_rgba(20,184,166,0.15)]" />
            </div>
            <p className="text-sm font-semibold text-white">{device.model}</p>
            <p className="text-[11px] text-slate-500">{device.firmware}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${device.status === "online" ? "bg-green-400" : device.status === "warning" ? "bg-amber-400" : device.status === "updating" ? "bg-blue-400" : "bg-red-400"}`} />
              <span className="text-xs text-slate-400">Last seen: {device.lastSeen}</span>
            </div>
          </div>

          {/* Device Info Card */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Device Information
            </h2>
            <div className="space-y-3">
              {[
                { label: "IP Address", value: device.ip },
                { label: "MAC Address", value: device.mac },
                { label: "Firmware", value: device.firmware },
                { label: "Uptime", value: device.uptime },
                { label: "Location", value: device.location },
                { label: "Role", value: device.role },
                { label: "Connection", value: device.connectionType },
                { label: "Parent Device", value: parentDevice ? `${parentDevice.name} (${parentDevice.ip})` : "None (Root)" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="text-slate-300 font-mono text-right max-w-[60%] truncate">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SSID & Radio Section */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
              SSID &amp; Radio
            </h2>
            <div className="space-y-4">
              {/* 2.4 GHz */}
              <div className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">2.4 GHz</span>
                  <span className="text-[10px] text-slate-500">Ch {device.channel2g}</span>
                </div>
                <p className="text-sm text-white font-mono mb-1">{device.ssid2g}</p>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span>TX Power: <span className="text-slate-300">{device.txPower2g} dBm</span></span>
                  <span>Channel: <span className="text-slate-300">{device.channel2g}</span></span>
                </div>
              </div>
              {/* 5 GHz */}
              <div className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold">5 GHz</span>
                  <span className="text-[10px] text-slate-500">Ch {device.channel5g}</span>
                </div>
                <p className="text-sm text-white font-mono mb-1">{device.ssid5g}</p>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span>TX Power: <span className="text-slate-300">{device.txPower5g} dBm</span></span>
                  <span>Channel: <span className="text-slate-300">{device.channel5g}</span></span>
                </div>
              </div>
              {/* Split Band Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/30">
                <span className="text-xs text-slate-500">Band Split</span>
                <span className={`text-xs font-medium ${device.splitBand ? "text-carbon-400" : "text-slate-500"}`}>
                  {device.splitBand ? "Enabled - Separate SSIDs" : "Disabled - Unified SSID"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RESOURCE GAUGES ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
            <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Resource Utilization
            </h2>
            <p className="text-[10px] text-slate-500 mb-4">Real-time CPU and memory load</p>
            <div className="flex items-center justify-around">
              <ResourceGauge label="CPU Usage" value={device.cpuUsage} color="teal" />
              <ResourceGauge label="Memory Usage" value={device.memUsage} color="blue" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
            <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Quick Statistics
            </h2>
            <p className="text-[10px] text-slate-500 mb-4">Current throughput and client summary</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Download", value: `${device.download.toFixed(1)} Mbps`, color: "text-carbon-400" },
                { label: "Upload", value: `${device.upload.toFixed(1)} Mbps`, color: "text-blue-400" },
                { label: "Connected Clients", value: device.clients.toString(), color: "text-purple-400" },
                { label: "AI Health Score", value: `${device.aiScore}/100`, color: device.aiScore >= 80 ? "text-green-400" : device.aiScore >= 50 ? "text-amber-400" : "text-red-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30">
                  <p className="text-[10px] text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== BANDWIDTH TREND (24h) ========== */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Bandwidth Trend (24h)
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-carbon-400 rounded" /><span className="text-[10px] text-slate-500">Download</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-400 rounded" /><span className="text-[10px] text-slate-500">Upload</span></div>
          </div>
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
              {/* grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                const y = chartPadT + plotH * (1 - f);
                return (
                  <g key={f}>
                    <line x1={chartPadL} y1={y} x2={chartPadL + plotW} y2={y} stroke="rgba(100,116,139,0.1)" />
                    <text x={chartPadL - 4} y={y + 3} textAnchor="end" fill="#475569" fontSize="9">
                      {Math.round(maxThroughput * f)}
                    </text>
                  </g>
                );
              })}
              {/* x-axis labels */}
              {hourlyData.filter((_, i) => i % 3 === 0).map((d, i) => {
                const idx = i * 3;
                const x = chartPadL + (idx / (hourlyData.length - 1)) * plotW;
                return (
                  <text key={d.hour} x={x} y={chartH - 5} textAnchor="middle" fill="#475569" fontSize="9">
                    {d.hour}
                  </text>
                );
              })}
              {/* area fills */}
              <path d={throughputArea("download")} fill="rgba(20,184,166,0.08)" />
              <path d={throughputArea("upload")} fill="rgba(59,130,246,0.06)" />
              {/* lines */}
              <path d={throughputPath("download")} fill="none" stroke="rgb(20,184,166)" strokeWidth="2" strokeLinejoin="round" />
              <path d={throughputPath("upload")} fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinejoin="round" />
              {/* dots */}
              {hourlyData.map((d, i) => {
                const x = chartPadL + (i / (hourlyData.length - 1)) * plotW;
                const yDl = chartPadT + plotH - (d.download / maxThroughput) * plotH;
                return <circle key={i} cx={x} cy={yDl} r="2.5" fill="rgb(20,184,166)" opacity="0.7" />;
              })}
            </svg>
          </div>
        </div>

        {/* ========== CLIENT LIST ========== */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow overflow-hidden gradient-border">
          <div className="px-6 py-4 border-b border-slate-800/30">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Connected Clients
              <span className="text-[10px] text-slate-500 font-normal ml-2">{mockClients.length} devices</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/30">
                  <th className="text-left px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Client</th>
                  <th className="text-left px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">MAC Address</th>
                  <th className="text-left px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Band</th>
                  <th className="text-left px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">RSSI</th>
                  <th className="text-left px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Signal</th>
                  <th className="text-right px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Data Usage</th>
                </tr>
              </thead>
              <tbody>
                {mockClients.map((client, i) => {
                  const signalQuality = client.rssi > -50 ? "Excellent" : client.rssi > -60 ? "Good" : client.rssi > -70 ? "Fair" : "Weak";
                  const signalColor = client.rssi > -50 ? "text-green-400" : client.rssi > -60 ? "text-carbon-400" : client.rssi > -70 ? "text-amber-400" : "text-red-400";
                  const barCount = client.rssi > -50 ? 4 : client.rssi > -60 ? 3 : client.rssi > -70 ? 2 : 1;
                  return (
                    <tr key={i} className="border-b border-slate-800/20 hover:bg-navy-900/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800/70 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                            {client.name.charAt(0)}
                          </div>
                          <span className="text-xs text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400 font-mono">{client.mac}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${client.band === "5 GHz" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                          {client.band}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-300 font-mono">{client.rssi} dBm</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-end gap-[2px] h-3.5">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className={`w-[3px] rounded-sm ${bar <= barCount ? (signalColor.includes("green") ? "bg-green-400" : signalColor.includes("carbon") ? "bg-carbon-400" : signalColor.includes("amber") ? "bg-amber-400" : "bg-red-400") : "bg-slate-700"}`}
                                style={{ height: `${bar * 25}%` }}
                              />
                            ))}
                          </div>
                          <span className={`text-[10px] ${signalColor}`}>{signalQuality}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-300 text-right font-mono">{client.dataUsage} MB</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== AI INSIGHTS ========== */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            AI Insights for {device.name}
          </h2>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-navy-900/50 rounded-lg p-4 border border-slate-800/30">
                <InsightIcon severity={insight.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-white">{insight.title}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
                      insight.severity === "critical" ? "bg-red-500/10 text-red-400" :
                      insight.severity === "warning" ? "bg-amber-500/10 text-amber-400" :
                      "bg-carbon-500/10 text-carbon-400"
                    }`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== CHANNEL UTILIZATION (2.4 GHz) ========== */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow p-6 gradient-border">
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-carbon-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.981 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.789M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            2.4 GHz Channel Utilization
          </h2>
          <p className="text-[10px] text-slate-500 mb-4">Channels 1-11 &middot; Current AP on Ch {device.channel2g}</p>
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${barChartW} ${barChartH}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis gridlines */}
              {[0, 25, 50, 75, 100].map((v) => {
                const y = barPadT + barPlotH * (1 - v / 100);
                return (
                  <g key={v}>
                    <line x1={barPadL} y1={y} x2={barPadL + barPlotW} y2={y} stroke="rgba(100,116,139,0.1)" />
                    <text x={barPadL - 4} y={y + 3} textAnchor="end" fill="#475569" fontSize="9">
                      {v}%
                    </text>
                  </g>
                );
              })}
              {/* Bars */}
              {channelUtil.map((ch, i) => {
                const x = barPadL + i * (barPlotW / 11) + (barPlotW / 11 - barW) / 2;
                const barH = (ch.utilization / 100) * barPlotH;
                const y = barPadT + barPlotH - barH;
                const isCurrentCh = ch.channel === device.channel2g;
                const fill = isCurrentCh
                  ? "url(#currentChGrad)"
                  : ch.utilization > 60
                  ? "rgba(245,158,11,0.6)"
                  : "rgba(100,116,139,0.25)";
                return (
                  <g key={ch.channel}>
                    <rect x={x} y={y} width={barW} height={barH} rx="3" fill={fill} />
                    {isCurrentCh && <rect x={x} y={y} width={barW} height={barH} rx="3" stroke="rgb(20,184,166)" strokeWidth="1" fill="none" opacity="0.5" />}
                    <text x={x + barW / 2} y={barPadT + barPlotH + 14} textAnchor="middle" fill={isCurrentCh ? "#2dd4bf" : "#475569"} fontSize="10" fontWeight={isCurrentCh ? "700" : "400"}>
                      {ch.channel}
                    </text>
                    <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill={isCurrentCh ? "#2dd4bf" : "#64748b"} fontSize="9">
                      {ch.utilization}%
                    </text>
                  </g>
                );
              })}
              <defs>
                <linearGradient id="currentChGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(20,184,166,0.8)" />
                  <stop offset="100%" stopColor="rgba(20,184,166,0.3)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
