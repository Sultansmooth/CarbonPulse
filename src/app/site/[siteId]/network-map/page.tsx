"use client";

import { devices, networkConnections } from "@/lib/mock-data";
import { useState, useRef, useCallback } from "react";
import type { Device } from "@/lib/mock-data";
import Image from "next/image";

// Devices that show the real RT-AX55 photo (not all — just key infrastructure nodes)
const IMAGE_DEVICE_IDS = new Set(["rt-002", "rt-003", "rt-008", "rt-010", "rt-012", "rt-015"]);
const GATEWAY_ID = "rt-001";

/* ── Role Badge helper ────────────────────────────────────────────── */
function RoleBadge({ device, yOffset }: { device: Device; yOffset: number }) {
  const roleLabel = (() => {
    switch (device.role) {
      case "gateway": return { text: "GATEWAY", color: "#14b8a6" };
      case "access-point": return { text: `AP (${device.connectionType === "wired" ? "wired" : "wireless"})`, color: "#3b82f6" };
      case "mesh-node": return { text: `MESH (${device.connectionType === "wired" ? "wired" : device.connectionType === "mesh-backhaul" ? "backhaul" : "wireless"})`, color: "#f59e0b" };
      case "repeater": return { text: "REPEATER", color: "#a855f7" };
      default: return { text: "UNKNOWN", color: "#64748b" };
    }
  })();

  // Show SSID if it differs from default
  const defaultSSIDs = new Set(["CarbonPulse", "CarbonPulse_5G"]);
  const uniqueSSIDs: string[] = [];
  if (!defaultSSIDs.has(device.ssid2g) && !uniqueSSIDs.includes(device.ssid2g)) uniqueSSIDs.push(device.ssid2g);
  if (!defaultSSIDs.has(device.ssid5g) && !uniqueSSIDs.includes(device.ssid5g)) uniqueSSIDs.push(device.ssid5g);
  const ssidText = uniqueSSIDs.length > 0 ? uniqueSSIDs.join(" / ") : null;

  return (
    <g>
      <text x={0} y={yOffset} textAnchor="middle" fill={roleLabel.color} fontSize={6.5} fontFamily="monospace" fontWeight="bold" letterSpacing={0.5}>
        {roleLabel.text}
      </text>
      {ssidText && (
        <text x={0} y={yOffset + 9} textAnchor="middle" fill="#64748b" fontSize={6} fontFamily="monospace">
          {ssidText}
        </text>
      )}
    </g>
  );
}

/* ── Node components ──────────────────────────────────────────────── */
function RouterIcon({ device, x, y, isSelected, onClick, onPointerDown }: {
  device: Device; x: number; y: number; isSelected: boolean; onClick: () => void; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const statusColors: Record<string, { fill: string; ring: string; glow: string }> = {
    online: { fill: "#22c55e", ring: "#4ade80", glow: "rgba(34,197,94,0.3)" },
    offline: { fill: "#ef4444", ring: "#f87171", glow: "rgba(239,68,68,0.3)" },
    warning: { fill: "#f59e0b", ring: "#fbbf24", glow: "rgba(245,158,11,0.3)" },
    updating: { fill: "#3b82f6", ring: "#60a5fa", glow: "rgba(59,130,246,0.3)" },
  };
  const colors = statusColors[device.status] || statusColors.online;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      className="cursor-pointer"
      style={{ filter: isSelected ? `drop-shadow(0 0 12px ${colors.glow})` : `drop-shadow(0 0 4px ${colors.glow})` }}
    >
      {/* Outer ring */}
      <circle r={isSelected ? 28 : 24} fill="none" stroke={colors.ring} strokeWidth={isSelected ? 2 : 1} opacity={0.4}>
        {device.status === "online" && <animate attributeName="r" values={isSelected ? "28;32;28" : "24;28;24"} dur="3s" repeatCount="indefinite" />}
        {device.status === "online" && <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Router body */}
      <rect x={-18} y={-12} width={36} height={24} rx={4} fill="#0f172a" stroke={isSelected ? colors.ring : "#1e293b"} strokeWidth={isSelected ? 2 : 1} />

      {/* Antenna lines */}
      <line x1={-8} y1={-12} x2={-12} y2={-22} stroke={colors.fill} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={8} y1={-12} x2={12} y2={-22} stroke={colors.fill} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={-12} cy={-22} r={2} fill={colors.fill} />
      <circle cx={12} cy={-22} r={2} fill={colors.fill} />

      {/* Signal waves */}
      {device.status === "online" && (
        <>
          <path d="M -6 -16 Q 0 -20 6 -16" fill="none" stroke={colors.fill} strokeWidth={0.8} opacity={0.5} />
          <path d="M -10 -19 Q 0 -25 10 -19" fill="none" stroke={colors.fill} strokeWidth={0.6} opacity={0.3} />
        </>
      )}

      {/* LED indicators */}
      <circle cx={-10} cy={0} r={1.5} fill={device.status === "offline" ? "#475569" : colors.fill}>
        {device.status !== "offline" && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx={-5} cy={0} r={1.5} fill={device.status === "offline" ? "#475569" : "#3b82f6"}>
        {device.status !== "offline" && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />}
      </circle>
      <circle cx={0} cy={0} r={1.5} fill={device.status === "offline" ? "#475569" : "#14b8a6"}>
        {device.status !== "offline" && <animate attributeName="opacity" values="1;0.6;1" dur="1.8s" repeatCount="indefinite" />}
      </circle>

      {/* Device label */}
      <text x={0} y={22} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="monospace">{device.name}</text>
      <text x={0} y={32} textAnchor="middle" fill="#475569" fontSize={7} fontFamily="monospace">{device.ip}</text>

      {/* Role badge */}
      <RoleBadge device={device} yOffset={41} />

      {/* Client count badge */}
      {device.clients > 0 && (
        <>
          <circle cx={22} cy={-8} r={8} fill="#0f172a" stroke={colors.fill} strokeWidth={1} />
          <text x={22} y={-5} textAnchor="middle" fill={colors.fill} fontSize={7} fontWeight="bold">{device.clients}</text>
        </>
      )}

      {/* AI Score indicator */}
      <rect x={-18} y={8} width={Math.max(1, (device.aiScore / 100) * 36)} height={2} rx={1} fill={
        device.aiScore >= 80 ? "#22c55e" : device.aiScore >= 50 ? "#f59e0b" : "#ef4444"
      } opacity={0.6} />
    </g>
  );
}

/* Image-based node for key infrastructure routers showing the real RT-AX55 photo */
function ImageRouterNode({ device, x, y, isSelected, onClick, onPointerDown }: {
  device: Device; x: number; y: number; isSelected: boolean; onClick: () => void; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const statusColors: Record<string, { fill: string; ring: string; glow: string }> = {
    online: { fill: "#22c55e", ring: "#4ade80", glow: "rgba(34,197,94,0.25)" },
    offline: { fill: "#ef4444", ring: "#f87171", glow: "rgba(239,68,68,0.25)" },
    warning: { fill: "#f59e0b", ring: "#fbbf24", glow: "rgba(245,158,11,0.25)" },
    updating: { fill: "#3b82f6", ring: "#60a5fa", glow: "rgba(59,130,246,0.25)" },
  };
  const colors = statusColors[device.status] || statusColors.online;
  const imgW = 56;
  const imgH = 42;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      className="cursor-pointer"
      style={{ filter: isSelected ? `drop-shadow(0 0 14px ${colors.glow})` : `drop-shadow(0 0 6px ${colors.glow})` }}
    >
      {/* Pulse ring */}
      <circle r={isSelected ? 40 : 36} fill="none" stroke={colors.ring} strokeWidth={isSelected ? 1.5 : 0.8} opacity={0.3}>
        {device.status === "online" && <animate attributeName="r" values={isSelected ? "40;46;40" : "36;42;36"} dur="3s" repeatCount="indefinite" />}
        {device.status === "online" && <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Dark backing plate */}
      <rect x={-imgW / 2 - 3} y={-imgH / 2 - 3} width={imgW + 6} height={imgH + 6} rx={6}
        fill="#0c1322" stroke={isSelected ? colors.ring : "#1e293b"} strokeWidth={isSelected ? 1.5 : 0.8} />

      {/* RT-AX55 image */}
      <image href="/rt-ax55.png" x={-imgW / 2} y={-imgH / 2} width={imgW} height={imgH} style={{ borderRadius: 4 }} />

      {/* Status dot */}
      <circle cx={imgW / 2 + 2} cy={-imgH / 2 - 2} r={4} fill={colors.fill} stroke="#0c1322" strokeWidth={2}>
        {device.status === "online" && <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />}
      </circle>

      {/* Device label */}
      <text x={0} y={imgH / 2 + 14} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="monospace">{device.name}</text>
      <text x={0} y={imgH / 2 + 24} textAnchor="middle" fill="#475569" fontSize={7} fontFamily="monospace">{device.ip}</text>

      {/* Role badge */}
      <RoleBadge device={device} yOffset={imgH / 2 + 33} />

      {/* Client count badge */}
      {device.clients > 0 && (
        <>
          <circle cx={imgW / 2 + 2} cy={8} r={9} fill="#0c1322" stroke={colors.fill} strokeWidth={1} />
          <text x={imgW / 2 + 2} y={11} textAnchor="middle" fill={colors.fill} fontSize={8} fontWeight="bold">{device.clients}</text>
        </>
      )}

      {/* AI score bar */}
      <rect x={-imgW / 2 - 3} y={imgH / 2 + 4} width={Math.max(1, (device.aiScore / 100) * (imgW + 6))} height={2} rx={1} fill={
        device.aiScore >= 80 ? "#22c55e" : device.aiScore >= 50 ? "#f59e0b" : "#ef4444"
      } opacity={0.6} />
    </g>
  );
}

/* The core gateway — extra-large, heavily emphasised parent router */
function GatewayNode({ device, x, y, isSelected, onClick, onPointerDown }: {
  device: Device; x: number; y: number; isSelected: boolean; onClick: () => void; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const colors = { fill: "#14b8a6", ring: "#2dd4bf", glow: "rgba(20,184,166,0.4)" };
  const imgW = 90;
  const imgH = 68;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      className="cursor-pointer"
      style={{ filter: isSelected
        ? "drop-shadow(0 0 24px rgba(20,184,166,0.5)) drop-shadow(0 0 48px rgba(20,184,166,0.2))"
        : "drop-shadow(0 0 14px rgba(20,184,166,0.35)) drop-shadow(0 0 32px rgba(20,184,166,0.12))" }}
    >
      {/* Large pulsing outer rings */}
      <circle r={70} fill="none" stroke={colors.ring} strokeWidth={0.5} opacity={0.1}>
        <animate attributeName="r" values="70;82;70" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.02;0.1" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle r={58} fill="none" stroke={colors.ring} strokeWidth={0.8} opacity={0.15}>
        <animate attributeName="r" values="58;66;58" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.04;0.15" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle r={isSelected ? 52 : 48} fill="none" stroke={colors.ring} strokeWidth={isSelected ? 1.5 : 1} opacity={0.25}>
        <animate attributeName="r" values={isSelected ? "52;56;52" : "48;52;48"} dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Gradient backing plate */}
      <rect x={-imgW / 2 - 5} y={-imgH / 2 - 5} width={imgW + 10} height={imgH + 10} rx={8}
        fill="url(#gateway-bg)" stroke={isSelected ? colors.ring : "rgba(20,184,166,0.3)"} strokeWidth={isSelected ? 2 : 1} />

      {/* RT-AX55 image — big */}
      <image href="/rt-ax55.png" x={-imgW / 2} y={-imgH / 2} width={imgW} height={imgH} />

      {/* CORE GATEWAY label above */}
      <rect x={-38} y={-imgH / 2 - 22} width={76} height={14} rx={3} fill="rgba(20,184,166,0.15)" stroke="rgba(20,184,166,0.3)" strokeWidth={0.5} />
      <text x={0} y={-imgH / 2 - 12} textAnchor="middle" fill="#2dd4bf" fontSize={8} fontWeight="bold" fontFamily="monospace" letterSpacing={2}>
        CORE GATEWAY
      </text>

      {/* Status — online glow dot */}
      <circle cx={imgW / 2 + 4} cy={-imgH / 2 - 4} r={5} fill={colors.fill} stroke="#0c1322" strokeWidth={2}>
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Extra ping ring on status dot */}
      <circle cx={imgW / 2 + 4} cy={-imgH / 2 - 4} r={5} fill="none" stroke={colors.fill} strokeWidth={1}>
        <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Device label */}
      <text x={0} y={imgH / 2 + 16} textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight="bold" fontFamily="monospace">{device.name}</text>
      <text x={0} y={imgH / 2 + 27} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="monospace">{device.ip}</text>
      <text x={0} y={imgH / 2 + 38} textAnchor="middle" fill="#475569" fontSize={7} fontFamily="monospace">RT-AX55 &bull; {device.clients} clients &bull; AI {device.aiScore}</text>

      {/* Role badge */}
      <RoleBadge device={device} yOffset={imgH / 2 + 48} />

      {/* Client count badge — larger */}
      <circle cx={imgW / 2 + 4} cy={14} r={11} fill="#0c1322" stroke={colors.fill} strokeWidth={1.5} />
      <text x={imgW / 2 + 4} y={18} textAnchor="middle" fill={colors.fill} fontSize={10} fontWeight="bold">{device.clients}</text>

      {/* AI score bar */}
      <rect x={-imgW / 2 - 5} y={imgH / 2 + 6} width={Math.max(1, (device.aiScore / 100) * (imgW + 10))} height={3} rx={1.5}
        fill="url(#ai-bar-gradient)" opacity={0.8} />
    </g>
  );
}

/* ── Connection line style helper ─────────────────────────────────── */
function getConnectionLineStyle(
  fromDevice: Device,
  toDevice: Device,
  strengthStyle: { stroke: string; width: number; opacity: number; dash: string },
) {
  // Determine the connectionType for this link.
  // Use the "to" device's connectionType by default; if "to" is the gateway, use "from".
  const linkDevice = toDevice.id === GATEWAY_ID ? fromDevice : toDevice;
  const ct = linkDevice.connectionType;

  if (ct === "wired") {
    // Solid line — override dash to none
    return { ...strengthStyle, dash: "", stroke: strengthStyle.stroke };
  } else if (ct === "wireless") {
    // Dotted line
    return { ...strengthStyle, dash: "2 3" };
  } else {
    // mesh-backhaul — dashed with amber colour
    return { ...strengthStyle, dash: "6 3", stroke: "#f59e0b" };
  }
}

/* ── Main component ───────────────────────────────────────────────── */
export default function NetworkMap() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

  /* ── Positions state (draggable) ── */
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const init: Record<string, { x: number; y: number }> = {};
    for (const d of devices) {
      if (d.x !== undefined && d.y !== undefined) {
        init[d.id] = { x: d.x, y: d.y };
      }
    }
    return init;
  });

  /* ── Drag state refs (avoid re-renders during drag) ── */
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const didDrag = useRef(false);

  /** Convert screen pointer coords to SVG viewBox coords */
  const screenToSVG = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const handlePointerDown = useCallback(
    (deviceId: string) => (e: React.PointerEvent) => {
      e.stopPropagation();
      const pos = positions[deviceId];
      if (!pos) return;
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      dragging.current = { id: deviceId, offsetX: svgCoords.x - pos.x, offsetY: svgCoords.y - pos.y };
      didDrag.current = false;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [positions, screenToSVG],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      didDrag.current = true;
      const { id, offsetX, offsetY } = dragging.current;
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      setPositions((prev) => ({
        ...prev,
        [id]: { x: svgCoords.x - offsetX, y: svgCoords.y - offsetY },
      }));
    },
    [screenToSVG],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const deviceMap = Object.fromEntries(devices.map((d) => [d.id, d]));

  const strengthColors = {
    strong: { stroke: "#14b8a6", width: 2, opacity: 0.5, dash: "" },
    medium: { stroke: "#3b82f6", width: 1.5, opacity: 0.3, dash: "4 4" },
    weak: { stroke: "#ef4444", width: 1, opacity: 0.2, dash: "2 4" },
  };

  /* Helper: get the parent device name for a device */
  const getParentName = (d: Device) => {
    if (!d.parentId) return null;
    const parent = deviceMap[d.parentId];
    return parent ? parent.name : d.parentId;
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Network Topology</h1>
            <p className="text-xs text-slate-500 mt-0.5">Interactive map of your RT-AX55 mesh network — drag nodes to rearrange</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="w-8 h-5 rounded border border-carbon-500/30 overflow-hidden bg-navy-900 flex items-center justify-center">
                  <Image src="/rt-ax55.png" alt="" width={24} height={18} className="object-contain" />
                </span>
                <span className="text-slate-400">Key Node</span>
              </span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-carbon-500 rounded" /> Wired</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-blue-500 rounded border-dotted" style={{ borderBottom: "2px dotted #3b82f6", height: 0, width: 24 }} /> Wireless</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 rounded" style={{ borderBottom: "2px dashed #f59e0b", height: 0, width: 24 }} /> Mesh Backhaul</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-red-500 rounded opacity-50" /> Weak</span>
            </div>
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              AI Auto-Layout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Map Area */}
        <div className="flex-1 p-4">
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 overflow-hidden card-glow" style={{ height: "calc(100vh - 120px)" }}>
            <svg
              ref={svgRef}
              viewBox="0 0 950 600"
              className="w-full h-full"
              style={{ background: "radial-gradient(ellipse at 42% 25%, rgba(20,184,166,0.05) 0%, transparent 55%)" }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(30,41,59,0.3)" strokeWidth="0.5" />
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="gateway-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0c1322" />
                  <stop offset="100%" stopColor="#0a1628" />
                </linearGradient>
                <linearGradient id="ai-bar-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connection lines */}
              {networkConnections.map((conn, i) => {
                const from = deviceMap[conn.from];
                const to = deviceMap[conn.to];
                const fromPos = positions[conn.from];
                const toPos = positions[conn.to];
                if (!fromPos || !toPos) return null;
                const baseStyle = strengthColors[conn.strength];
                const style = getConnectionLineStyle(from, to, baseStyle);
                const connId = `${conn.from}-${conn.to}`;
                const isHighlighted = selectedDevice && (conn.from === selectedDevice.id || conn.to === selectedDevice.id);
                const isHovered = hoveredConnection === connId;
                // Thicker lines coming from gateway
                const isGatewayLink = conn.from === GATEWAY_ID || conn.to === GATEWAY_ID;

                return (
                  <g key={i}
                    onMouseEnter={() => setHoveredConnection(connId)}
                    onMouseLeave={() => setHoveredConnection(null)}
                  >
                    <line
                      x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                      stroke={style.stroke}
                      strokeWidth={isHighlighted || isHovered ? style.width + 1.5 : isGatewayLink ? style.width + 0.5 : style.width}
                      opacity={isHighlighted ? 0.8 : selectedDevice ? 0.08 : isGatewayLink ? style.opacity + 0.15 : style.opacity}
                      strokeDasharray={style.dash}
                      className={conn.strength === "strong" && style.dash === "" ? "data-flow-line" : ""}
                    />
                    {(isHighlighted || (!selectedDevice && conn.strength === "strong")) && (
                      <circle r={2} fill={style.stroke} opacity={0.8}>
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath xlinkHref={`#path-${i}`} />
                        </animateMotion>
                      </circle>
                    )}
                    <path id={`path-${i}`} d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`} fill="none" />
                  </g>
                );
              })}

              {/* Device nodes — render gateway last so it draws on top */}
              {devices.filter((d) => d.x !== undefined && d.id !== GATEWAY_ID && !IMAGE_DEVICE_IDS.has(d.id)).map((device) => {
                const pos = positions[device.id];
                if (!pos) return null;
                return (
                  <RouterIcon
                    key={device.id}
                    device={device}
                    x={pos.x}
                    y={pos.y}
                    isSelected={selectedDevice?.id === device.id}
                    onClick={() => {
                      if (!didDrag.current) setSelectedDevice(selectedDevice?.id === device.id ? null : device);
                    }}
                    onPointerDown={handlePointerDown(device.id)}
                  />
                );
              })}

              {/* Image-based key nodes */}
              {devices.filter((d) => IMAGE_DEVICE_IDS.has(d.id)).map((device) => {
                const pos = positions[device.id];
                if (!pos) return null;
                return (
                  <ImageRouterNode
                    key={device.id}
                    device={device}
                    x={pos.x}
                    y={pos.y}
                    isSelected={selectedDevice?.id === device.id}
                    onClick={() => {
                      if (!didDrag.current) setSelectedDevice(selectedDevice?.id === device.id ? null : device);
                    }}
                    onPointerDown={handlePointerDown(device.id)}
                  />
                );
              })}

              {/* Core Gateway — rendered last, on top of everything */}
              {devices.filter((d) => d.id === GATEWAY_ID).map((device) => {
                const pos = positions[device.id];
                if (!pos) return null;
                return (
                  <GatewayNode
                    key={device.id}
                    device={device}
                    x={pos.x}
                    y={pos.y}
                    isSelected={selectedDevice?.id === device.id}
                    onClick={() => {
                      if (!didDrag.current) setSelectedDevice(selectedDevice?.id === device.id ? null : device);
                    }}
                    onPointerDown={handlePointerDown(device.id)}
                  />
                );
              })}

              {/* Bottom label */}
              <text x={475} y={585} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="monospace">
                ASUS RT-AX55 Mesh Network &middot; {devices.length} Nodes &middot; AI-Managed Topology
              </text>
            </svg>
          </div>
        </div>

        {/* Side Panel */}
        {selectedDevice && (
          <div className="w-80 border-l border-slate-800/50 bg-navy-950 p-5 overflow-y-auto" style={{ height: "calc(100vh - 73px)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Device Details</h3>
              <button onClick={() => setSelectedDevice(null)} className="text-slate-500 hover:text-slate-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Device Image — real RT-AX55 photo */}
            <div className="bg-navy-900 rounded-lg p-4 mb-4 border border-slate-800/30 flex flex-col items-center">
              {selectedDevice.id === GATEWAY_ID && (
                <div className="mb-2 px-2 py-0.5 rounded bg-carbon-500/10 border border-carbon-500/20">
                  <span className="text-[9px] text-carbon-400 uppercase tracking-widest font-bold">Core Gateway</span>
                </div>
              )}
              <div className={`relative ${selectedDevice.id === GATEWAY_ID ? "w-48 h-36" : "w-36 h-24"} mb-3`}>
                <Image
                  src="/rt-ax55.png"
                  alt={`${selectedDevice.model} - ${selectedDevice.name}`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-white">{selectedDevice.model}</p>
              <p className="text-[10px] text-slate-500">{selectedDevice.name}</p>
              {selectedDevice.id === GATEWAY_ID && (
                <p className="text-[9px] text-carbon-400 mt-1">Primary uplink &middot; All traffic routes through this node</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Status</span>
                <span className={`capitalize ${
                  selectedDevice.status === "online" ? "text-green-400" :
                  selectedDevice.status === "offline" ? "text-red-400" :
                  selectedDevice.status === "warning" ? "text-amber-400" : "text-blue-400"
                }`}>{selectedDevice.status}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Role</span>
                <span className={`font-semibold ${
                  selectedDevice.role === "gateway" ? "text-teal-400" :
                  selectedDevice.role === "access-point" ? "text-blue-400" :
                  selectedDevice.role === "mesh-node" ? "text-amber-400" : "text-purple-400"
                }`}>
                  {selectedDevice.role === "gateway" ? "Core Gateway" :
                   selectedDevice.role === "access-point" ? "Access Point" :
                   selectedDevice.role === "mesh-node" ? "Mesh Node" : "Repeater"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Connection</span>
                <span className={`capitalize ${
                  selectedDevice.connectionType === "wired" ? "text-green-400" :
                  selectedDevice.connectionType === "wireless" ? "text-blue-400" : "text-amber-400"
                }`}>
                  {selectedDevice.connectionType === "mesh-backhaul" ? "Mesh Backhaul" : selectedDevice.connectionType}
                </span>
              </div>
              {selectedDevice.parentId && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Parent Device</span>
                  <span className="text-slate-300 font-mono text-[10px]">{getParentName(selectedDevice)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs"><span className="text-slate-500">IP Address</span><span className="text-slate-300 font-mono">{selectedDevice.ip}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">MAC</span><span className="text-slate-300 font-mono text-[10px]">{selectedDevice.mac}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Firmware</span><span className="text-slate-300 font-mono">{selectedDevice.firmware}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Uptime</span><span className="text-slate-300">{selectedDevice.uptime}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Location</span><span className="text-slate-300 text-right max-w-[160px]">{selectedDevice.location}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Clients</span><span className="text-blue-400 font-semibold">{selectedDevice.clients}</span></div>
            </div>

            {/* Wireless / SSID Info */}
            <div className="bg-navy-900 rounded-lg p-3 mb-4 border border-slate-800/30">
              <p className="text-xs font-medium text-white mb-3">Wireless Configuration</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">SSID 2.4 GHz</span>
                  <span className="text-slate-300 font-mono text-[10px]">{selectedDevice.ssid2g}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">SSID 5 GHz</span>
                  <span className="text-slate-300 font-mono text-[10px]">{selectedDevice.ssid5g}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Split Band</span>
                  <span className={`font-semibold ${selectedDevice.splitBand ? "text-amber-400" : "text-slate-500"}`}>
                    {selectedDevice.splitBand ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">TX Power 2.4 GHz</span>
                  <span className="text-slate-300">{selectedDevice.txPower2g} dBm</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">TX Power 5 GHz</span>
                  <span className="text-slate-300">{selectedDevice.txPower5g} dBm</span>
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="bg-navy-900 rounded-lg p-3 mb-4 border border-slate-800/30">
              <p className="text-xs font-medium text-white mb-3">Resource Usage</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-500">CPU</span><span className="text-slate-300">{selectedDevice.cpuUsage}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selectedDevice.cpuUsage > 80 ? "bg-red-500" : selectedDevice.cpuUsage > 60 ? "bg-amber-500" : "bg-carbon-500"}`} style={{ width: `${selectedDevice.cpuUsage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-500">Memory</span><span className="text-slate-300">{selectedDevice.memUsage}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selectedDevice.memUsage > 80 ? "bg-red-500" : selectedDevice.memUsage > 60 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${selectedDevice.memUsage}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bandwidth */}
            <div className="bg-navy-900 rounded-lg p-3 mb-4 border border-slate-800/30">
              <p className="text-xs font-medium text-white mb-2">Bandwidth</p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[10px] text-slate-500">Download</p><p className="text-sm font-semibold text-carbon-400">{selectedDevice.download} Mbps</p></div>
                <div><p className="text-[10px] text-slate-500">Upload</p><p className="text-sm font-semibold text-blue-400">{selectedDevice.upload} Mbps</p></div>
              </div>
            </div>

            {/* AI Health */}
            <div className="bg-navy-900 rounded-lg p-3 mb-4 border border-slate-800/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-white">AI Health Score</p>
                <span className={`text-lg font-bold ${
                  selectedDevice.aiScore >= 80 ? "text-green-400" :
                  selectedDevice.aiScore >= 50 ? "text-amber-400" : "text-red-400"
                }`}>{selectedDevice.aiScore}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  selectedDevice.aiScore >= 80 ? "bg-gradient-to-r from-green-600 to-green-400" :
                  selectedDevice.aiScore >= 50 ? "bg-gradient-to-r from-amber-600 to-amber-400" :
                  "bg-gradient-to-r from-red-600 to-red-400"
                }`} style={{ width: `${selectedDevice.aiScore}%` }} />
              </div>
            </div>

            {/* Channel Info */}
            <div className="bg-navy-900 rounded-lg p-3 border border-slate-800/30">
              <p className="text-xs font-medium text-white mb-2">Wireless Channels</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-navy-850 rounded p-2">
                  <p className="text-[10px] text-slate-500">2.4 GHz</p>
                  <p className="text-sm font-semibold text-white">Ch {selectedDevice.channel2g}</p>
                </div>
                <div className="text-center bg-navy-850 rounded p-2">
                  <p className="text-[10px] text-slate-500">5 GHz</p>
                  <p className="text-sm font-semibold text-white">Ch {selectedDevice.channel5g}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button className="w-full text-xs bg-carbon-500/10 text-carbon-400 px-3 py-2 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
                AI Optimize This Device
              </button>
              <button className="w-full text-xs bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                Remote Access
              </button>
              <button className="w-full text-xs bg-slate-800/50 text-slate-400 px-3 py-2 rounded-lg border border-slate-700/30 hover:bg-slate-800 transition-colors">
                View Full Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
