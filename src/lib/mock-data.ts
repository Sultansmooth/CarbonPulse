export type DeviceRole = "gateway" | "access-point" | "mesh-node" | "repeater";
export type ConnectionType = "wired" | "wireless" | "mesh-backhaul";

export interface Device {
  id: string;
  name: string;
  model: string;
  ip: string;
  mac: string;
  status: "online" | "offline" | "warning" | "updating";
  firmware: string;
  uptime: string;
  clients: number;
  cpuUsage: number;
  memUsage: number;
  download: number;
  upload: number;
  channel2g: number;
  channel5g: number;
  location: string;
  lastSeen: string;
  aiScore: number;
  x?: number;
  y?: number;
  // Role & type metadata
  role: DeviceRole;
  connectionType: ConnectionType;
  ssid2g: string;
  ssid5g: string;
  splitBand: boolean; // true = different SSIDs per band
  parentId?: string;  // upstream device id
  txPower2g: number;  // dBm
  txPower5g: number;  // dBm
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: "critical" | "warning" | "info" | "ai-insight";
  message: string;
  timestamp: string;
}

export interface NetworkStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  totalClients: number;
  avgCpuUsage: number;
  avgMemUsage: number;
  totalBandwidth: number;
  aiHealthScore: number;
}

export const devices: Device[] = [
  { id: "rt-001", name: "Core-Gateway-01", model: "RT-AX88U", ip: "192.168.1.1", mac: "A8:5E:45:1A:2B:01", status: "online", firmware: "3.0.0.6_386", uptime: "45d 12h 33m", clients: 18, cpuUsage: 42, memUsage: 61, download: 487.3, upload: 94.2, channel2g: 6, channel5g: 149, location: "Main Office - Floor 1", lastSeen: "now", aiScore: 95, x: 400, y: 150, role: "gateway", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse_5G", splitBand: true, txPower2g: 23, txPower5g: 20 },
  { id: "rt-002", name: "Branch-North-01", model: "RT-AX55", ip: "192.168.2.1", mac: "A8:5E:45:1A:2B:02", status: "online", firmware: "3.0.0.6_386", uptime: "30d 8h 15m", clients: 12, cpuUsage: 35, memUsage: 48, download: 312.1, upload: 67.8, channel2g: 1, channel5g: 36, location: "Building A - North Wing", lastSeen: "now", aiScore: 92, x: 200, y: 300, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-001", txPower2g: 20, txPower5g: 20 },
  { id: "rt-003", name: "Branch-South-01", model: "RT-AX55", ip: "192.168.3.1", mac: "A8:5E:45:1A:2B:03", status: "online", firmware: "3.0.0.6_386", uptime: "30d 8h 15m", clients: 15, cpuUsage: 55, memUsage: 72, download: 445.6, upload: 89.1, channel2g: 11, channel5g: 44, location: "Building A - South Wing", lastSeen: "now", aiScore: 78, x: 600, y: 300, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-001", txPower2g: 20, txPower5g: 20 },
  { id: "rt-004", name: "Floor2-East-01", model: "RT-AX58U", ip: "192.168.4.1", mac: "A8:5E:45:1A:2B:04", status: "warning", firmware: "3.0.0.4_382", uptime: "15d 4h 22m", clients: 22, cpuUsage: 82, memUsage: 89, download: 523.8, upload: 102.4, channel2g: 6, channel5g: 149, location: "Building B - Floor 2 East", lastSeen: "now", aiScore: 45, x: 150, y: 480, role: "mesh-node", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-002", txPower2g: 23, txPower5g: 23 },
  { id: "rt-005", name: "Floor2-West-01", model: "RT-AX55", ip: "192.168.5.1", mac: "A8:5E:45:1A:2B:05", status: "online", firmware: "3.0.0.6_386", uptime: "45d 12h 33m", clients: 8, cpuUsage: 22, memUsage: 35, download: 156.2, upload: 34.5, channel2g: 1, channel5g: 36, location: "Building B - Floor 2 West", lastSeen: "now", aiScore: 98, x: 350, y: 480, role: "mesh-node", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-004", txPower2g: 17, txPower5g: 17 },
  { id: "rt-006", name: "Warehouse-01", model: "RT-AX55", ip: "192.168.6.1", mac: "A8:5E:45:1A:2B:06", status: "online", firmware: "3.0.0.6_386", uptime: "20d 16h 45m", clients: 5, cpuUsage: 15, memUsage: 28, download: 89.4, upload: 22.1, channel2g: 11, channel5g: 44, location: "Warehouse Zone A", lastSeen: "now", aiScore: 96, x: 550, y: 480, role: "mesh-node", connectionType: "mesh-backhaul", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-003", txPower2g: 23, txPower5g: 23 },
  { id: "rt-007", name: "Lobby-AP-01", model: "RP-AX56", ip: "192.168.7.1", mac: "A8:5E:45:1A:2B:07", status: "offline", firmware: "3.0.0.4_382", uptime: "0d 0h 0m", clients: 0, cpuUsage: 0, memUsage: 0, download: 0, upload: 0, channel2g: 6, channel5g: 149, location: "Main Lobby", lastSeen: "2h 15m ago", aiScore: 0, x: 750, y: 200, role: "repeater", connectionType: "wireless", ssid2g: "CarbonPulse-Guest", ssid5g: "CarbonPulse-Guest", splitBand: false, parentId: "rt-008", txPower2g: 20, txPower5g: 20 },
  { id: "rt-008", name: "Conf-Room-01", model: "RT-AX55", ip: "192.168.8.1", mac: "A8:5E:45:1A:2B:08", status: "online", firmware: "3.0.0.6_386", uptime: "45d 12h 33m", clients: 14, cpuUsage: 38, memUsage: 52, download: 267.9, upload: 78.3, channel2g: 1, channel5g: 36, location: "Conference Center", lastSeen: "now", aiScore: 88, x: 750, y: 400, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse-Conf", splitBand: true, parentId: "rt-003", txPower2g: 17, txPower5g: 20 },
  { id: "rt-009", name: "Parking-AP-01", model: "RP-AX56", ip: "192.168.9.1", mac: "A8:5E:45:1A:2B:09", status: "online", firmware: "3.0.0.5_384", uptime: "10d 3h 12m", clients: 3, cpuUsage: 10, memUsage: 22, download: 45.2, upload: 12.8, channel2g: 11, channel5g: 44, location: "Parking Structure B1", lastSeen: "now", aiScore: 90, x: 100, y: 200, role: "repeater", connectionType: "wireless", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-002", txPower2g: 23, txPower5g: 23 },
  { id: "rt-010", name: "Server-Room-01", model: "RT-AX88U", ip: "192.168.10.1", mac: "A8:5E:45:1A:2B:10", status: "online", firmware: "3.0.0.6_386", uptime: "60d 22h 10m", clients: 6, cpuUsage: 28, memUsage: 44, download: 892.5, upload: 445.1, channel2g: 6, channel5g: 149, location: "Server Room - Rack 4", lastSeen: "now", aiScore: 94, x: 400, y: 350, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse-Infra", ssid5g: "CarbonPulse-Infra", splitBand: false, parentId: "rt-001", txPower2g: 14, txPower5g: 17 },
  { id: "rt-011", name: "Break-Room-01", model: "RT-AX58U", ip: "192.168.11.1", mac: "A8:5E:45:1A:2B:11", status: "online", firmware: "3.0.0.6_386", uptime: "25d 7h 48m", clients: 9, cpuUsage: 30, memUsage: 40, download: 178.3, upload: 45.6, channel2g: 1, channel5g: 36, location: "Break Room - Floor 1", lastSeen: "now", aiScore: 91, x: 250, y: 150, role: "mesh-node", connectionType: "mesh-backhaul", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-001", txPower2g: 20, txPower5g: 20 },
  { id: "rt-012", name: "Exec-Suite-01", model: "RT-AX55", ip: "192.168.12.1", mac: "A8:5E:45:1A:2B:12", status: "online", firmware: "3.0.0.6_386", uptime: "45d 12h 33m", clients: 4, cpuUsage: 18, memUsage: 32, download: 134.7, upload: 56.2, channel2g: 11, channel5g: 44, location: "Executive Suite - Floor 3", lastSeen: "now", aiScore: 97, x: 650, y: 150, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse-Exec", ssid5g: "CarbonPulse-Exec", splitBand: false, parentId: "rt-001", txPower2g: 14, txPower5g: 17 },
  { id: "rt-013", name: "Lab-AP-01", model: "RT-AX55", ip: "192.168.13.1", mac: "A8:5E:45:1A:2B:13", status: "warning", firmware: "3.0.0.4_382", uptime: "8d 19h 5m", clients: 16, cpuUsage: 75, memUsage: 85, download: 567.2, upload: 234.8, channel2g: 6, channel5g: 149, location: "Research Lab", lastSeen: "now", aiScore: 52, x: 500, y: 250, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse-Lab", ssid5g: "CarbonPulse-Lab-5G", splitBand: true, parentId: "rt-010", txPower2g: 23, txPower5g: 23 },
  { id: "rt-014", name: "Cafeteria-01", model: "RT-AX58U", ip: "192.168.14.1", mac: "A8:5E:45:1A:2B:14", status: "online", firmware: "3.0.0.6_386", uptime: "30d 15h 20m", clients: 25, cpuUsage: 48, memUsage: 58, download: 389.1, upload: 67.4, channel2g: 1, channel5g: 36, location: "Cafeteria - Main Building", lastSeen: "now", aiScore: 82, x: 300, y: 380, role: "mesh-node", connectionType: "mesh-backhaul", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-010", txPower2g: 23, txPower5g: 20 },
  { id: "rt-015", name: "Training-01", model: "RT-AX55", ip: "192.168.15.1", mac: "A8:5E:45:1A:2B:15", status: "online", firmware: "3.0.0.6_386", uptime: "40d 6h 55m", clients: 20, cpuUsage: 58, memUsage: 65, download: 445.8, upload: 112.3, channel2g: 11, channel5g: 44, location: "Training Center", lastSeen: "now", aiScore: 76, x: 700, y: 350, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse-Training", splitBand: true, parentId: "rt-008", txPower2g: 20, txPower5g: 20 },
  { id: "rt-016", name: "Storage-AP-01", model: "RP-AX56", ip: "192.168.16.1", mac: "A8:5E:45:1A:2B:16", status: "online", firmware: "3.0.0.5_384", uptime: "12d 8h 30m", clients: 2, cpuUsage: 8, memUsage: 20, download: 23.4, upload: 8.7, channel2g: 6, channel5g: 149, location: "Storage Facility", lastSeen: "now", aiScore: 99, x: 150, y: 380, role: "repeater", connectionType: "wireless", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-002", txPower2g: 23, txPower5g: 23 },
  { id: "rt-017", name: "Guest-Net-01", model: "RT-AX55", ip: "192.168.17.1", mac: "A8:5E:45:1A:2B:17", status: "online", firmware: "3.0.0.6_386", uptime: "45d 12h 33m", clients: 31, cpuUsage: 62, memUsage: 70, download: 612.5, upload: 89.2, channel2g: 1, channel5g: 36, location: "Guest Network - All Floors", lastSeen: "now", aiScore: 68, x: 550, y: 150, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse-Guest", ssid5g: "CarbonPulse-Guest", splitBand: false, parentId: "rt-012", txPower2g: 23, txPower5g: 23 },
  { id: "rt-018", name: "Loading-Dock-01", model: "RT-AX55", ip: "192.168.18.1", mac: "A8:5E:45:1A:2B:18", status: "online", firmware: "3.0.0.6_386", uptime: "18d 14h 22m", clients: 7, cpuUsage: 25, memUsage: 38, download: 112.3, upload: 34.5, channel2g: 11, channel5g: 44, location: "Loading Dock Area", lastSeen: "now", aiScore: 93, x: 800, y: 300, role: "mesh-node", connectionType: "mesh-backhaul", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-006", txPower2g: 23, txPower5g: 23 },
  { id: "rt-019", name: "Roof-AP-01", model: "RP-AX56", ip: "192.168.19.1", mac: "A8:5E:45:1A:2B:19", status: "updating", firmware: "3.0.0.5_384", uptime: "5d 2h 10m", clients: 1, cpuUsage: 45, memUsage: 55, download: 0, upload: 0, channel2g: 6, channel5g: 149, location: "Rooftop - Building A", lastSeen: "now", aiScore: 70, x: 450, y: 80, role: "repeater", connectionType: "wireless", ssid2g: "CarbonPulse-Outdoor", ssid5g: "CarbonPulse-Outdoor", splitBand: false, parentId: "rt-001", txPower2g: 23, txPower5g: 23 },
  { id: "rt-020", name: "Annex-01", model: "RT-AX58U", ip: "192.168.20.1", mac: "A8:5E:45:1A:2B:20", status: "online", firmware: "3.0.0.6_386", uptime: "35d 11h 48m", clients: 10, cpuUsage: 32, memUsage: 46, download: 234.6, upload: 56.8, channel2g: 1, channel5g: 36, location: "Annex Building", lastSeen: "now", aiScore: 89, x: 850, y: 450, role: "mesh-node", connectionType: "wired", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-008", txPower2g: 20, txPower5g: 20 },
  { id: "rt-021", name: "Security-AP-01", model: "RT-AX55", ip: "192.168.21.1", mac: "A8:5E:45:1A:2B:21", status: "online", firmware: "3.0.0.6_386", uptime: "60d 0h 15m", clients: 11, cpuUsage: 40, memUsage: 50, download: 198.4, upload: 78.9, channel2g: 11, channel5g: 44, location: "Security Office", lastSeen: "now", aiScore: 87, x: 50, y: 350, role: "access-point", connectionType: "wired", ssid2g: "CarbonPulse-Secure", ssid5g: "CarbonPulse-Secure", splitBand: false, parentId: "rt-002", txPower2g: 17, txPower5g: 17 },
  { id: "rt-022", name: "Gym-AP-01", model: "RT-AX58U", ip: "192.168.22.1", mac: "A8:5E:45:1A:2B:22", status: "online", firmware: "3.0.0.6_386", uptime: "22d 9h 33m", clients: 13, cpuUsage: 44, memUsage: 54, download: 334.7, upload: 67.1, channel2g: 6, channel5g: 36, location: "Fitness Center", lastSeen: "now", aiScore: 84, x: 850, y: 150, role: "mesh-node", connectionType: "mesh-backhaul", ssid2g: "CarbonPulse", ssid5g: "CarbonPulse", splitBand: false, parentId: "rt-012", txPower2g: 20, txPower5g: 20 },
];

export const alerts: Alert[] = [
  { id: "a-001", deviceId: "rt-007", deviceName: "Lobby-AP-01", type: "critical", message: "Device unreachable - no heartbeat for 2h 15m", timestamp: "2 hours ago" },
  { id: "a-002", deviceId: "rt-004", deviceName: "Floor2-East-01", type: "warning", message: "CPU usage at 82% - AI recommends client redistribution", timestamp: "15 min ago" },
  { id: "a-003", deviceId: "rt-013", deviceName: "Lab-AP-01", type: "warning", message: "Memory usage at 85% - firmware update recommended", timestamp: "32 min ago" },
  { id: "a-004", deviceId: "rt-017", deviceName: "Guest-Net-01", type: "ai-insight", message: "AI detected: 31 clients on single AP. Recommend enabling band steering.", timestamp: "5 min ago" },
  { id: "a-005", deviceId: "rt-019", deviceName: "Roof-AP-01", type: "info", message: "Firmware update in progress (3.0.0.5 → 3.0.0.6)", timestamp: "10 min ago" },
  { id: "a-006", deviceId: "rt-004", deviceName: "Floor2-East-01", type: "ai-insight", message: "AI Analysis: Channel congestion detected on 2.4GHz Ch6. Auto-switching to Ch11 recommended.", timestamp: "1 hour ago" },
  { id: "a-007", deviceId: "rt-015", deviceName: "Training-01", type: "ai-insight", message: "Predictive: Training session at 2PM will increase load. Pre-optimizing QoS rules.", timestamp: "20 min ago" },
  { id: "a-008", deviceId: "rt-014", deviceName: "Cafeteria-01", type: "warning", message: "Lunch hour peak: 25 simultaneous clients detected", timestamp: "45 min ago" },
];

export const networkConnections: Array<{ from: string; to: string; strength: "strong" | "medium" | "weak" }> = [
  { from: "rt-001", to: "rt-002", strength: "strong" },
  { from: "rt-001", to: "rt-003", strength: "strong" },
  { from: "rt-001", to: "rt-010", strength: "strong" },
  { from: "rt-001", to: "rt-011", strength: "strong" },
  { from: "rt-001", to: "rt-019", strength: "medium" },
  { from: "rt-001", to: "rt-012", strength: "strong" },
  { from: "rt-001", to: "rt-017", strength: "medium" },
  { from: "rt-002", to: "rt-004", strength: "medium" },
  { from: "rt-002", to: "rt-009", strength: "strong" },
  { from: "rt-002", to: "rt-016", strength: "medium" },
  { from: "rt-003", to: "rt-006", strength: "strong" },
  { from: "rt-003", to: "rt-013", strength: "medium" },
  { from: "rt-003", to: "rt-008", strength: "strong" },
  { from: "rt-004", to: "rt-005", strength: "strong" },
  { from: "rt-005", to: "rt-014", strength: "medium" },
  { from: "rt-006", to: "rt-018", strength: "strong" },
  { from: "rt-007", to: "rt-008", strength: "weak" },
  { from: "rt-008", to: "rt-015", strength: "strong" },
  { from: "rt-008", to: "rt-020", strength: "medium" },
  { from: "rt-010", to: "rt-014", strength: "strong" },
  { from: "rt-010", to: "rt-013", strength: "strong" },
  { from: "rt-012", to: "rt-017", strength: "strong" },
  { from: "rt-015", to: "rt-020", strength: "medium" },
  { from: "rt-018", to: "rt-020", strength: "strong" },
  { from: "rt-021", to: "rt-002", strength: "strong" },
  { from: "rt-021", to: "rt-016", strength: "medium" },
  { from: "rt-022", to: "rt-012", strength: "strong" },
  { from: "rt-022", to: "rt-018", strength: "medium" },
];

export function getNetworkStats(): NetworkStats {
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const warning = devices.filter((d) => d.status === "warning").length;
  const totalClients = devices.reduce((acc, d) => acc + d.clients, 0);
  const active = devices.filter((d) => d.status !== "offline");
  const avgCpu = Math.round(active.reduce((acc, d) => acc + d.cpuUsage, 0) / active.length);
  const avgMem = Math.round(active.reduce((acc, d) => acc + d.memUsage, 0) / active.length);
  const totalBw = Math.round(devices.reduce((acc, d) => acc + d.download + d.upload, 0));
  const avgAi = Math.round(active.reduce((acc, d) => acc + d.aiScore, 0) / active.length);

  return {
    totalDevices: devices.length,
    onlineDevices: online,
    offlineDevices: offline,
    warningDevices: warning,
    totalClients,
    avgCpuUsage: avgCpu,
    avgMemUsage: avgMem,
    totalBandwidth: totalBw,
    aiHealthScore: avgAi,
  };
}

export const throughputData = [
  { time: "00:00", download: 120, upload: 45 },
  { time: "02:00", download: 80, upload: 30 },
  { time: "04:00", download: 45, upload: 20 },
  { time: "06:00", download: 90, upload: 35 },
  { time: "08:00", download: 350, upload: 120 },
  { time: "09:00", download: 480, upload: 180 },
  { time: "10:00", download: 520, upload: 200 },
  { time: "11:00", download: 560, upload: 210 },
  { time: "12:00", download: 620, upload: 190 },
  { time: "13:00", download: 580, upload: 220 },
  { time: "14:00", download: 540, upload: 200 },
  { time: "15:00", download: 500, upload: 185 },
  { time: "16:00", download: 460, upload: 170 },
  { time: "17:00", download: 380, upload: 140 },
  { time: "18:00", download: 280, upload: 100 },
  { time: "20:00", download: 200, upload: 70 },
  { time: "22:00", download: 150, upload: 55 },
];

export type ClientDeviceType = "phone" | "laptop" | "desktop" | "printer" | "tablet" | "iot" | "smart-tv" | "gaming" | "voip" | "camera";

export interface ClientDevice {
  id: string;
  name: string;
  type: ClientDeviceType;
  mac: string;
  ip: string;
  connectedTo: string; // AP device id
  band: "2.4GHz" | "5GHz" | "Wired";
  rssi: number; // dBm, 0 for wired
  status: "online" | "offline" | "idle";
  os: string;
  manufacturer: string;
  dataUsage: number; // MB in last 24h
  lastSeen: string;
  vlan: number;
}

export const clientDevices: ClientDevice[] = [
  { id: "cd-001", name: "CEO iPhone 15 Pro", type: "phone", mac: "3C:06:30:A1:B2:01", ip: "10.10.10.12", connectedTo: "rt-012", band: "5GHz", rssi: -42, status: "online", os: "iOS 18.2", manufacturer: "Apple", dataUsage: 2450, lastSeen: "now", vlan: 10 },
  { id: "cd-002", name: "CFO MacBook Air M3", type: "laptop", mac: "A4:83:E7:22:D3:02", ip: "10.10.10.14", connectedTo: "rt-012", band: "5GHz", rssi: -38, status: "online", os: "macOS 15.2", manufacturer: "Apple", dataUsage: 8920, lastSeen: "now", vlan: 10 },
  { id: "cd-003", name: "HP LaserJet Pro M404", type: "printer", mac: "10:60:4B:88:C4:03", ip: "10.10.10.50", connectedTo: "rt-002", band: "Wired", rssi: 0, status: "online", os: "Firmware 5.2", manufacturer: "HP", dataUsage: 340, lastSeen: "now", vlan: 10 },
  { id: "cd-004", name: "Dell OptiPlex 7080", type: "desktop", mac: "54:BF:64:33:A1:04", ip: "10.10.10.20", connectedTo: "rt-002", band: "Wired", rssi: 0, status: "online", os: "Windows 11 Pro", manufacturer: "Dell", dataUsage: 12400, lastSeen: "now", vlan: 10 },
  { id: "cd-005", name: "Galaxy S24 Ultra", type: "phone", mac: "B0:72:BF:45:E6:05", ip: "10.10.10.15", connectedTo: "rt-004", band: "5GHz", rssi: -55, status: "online", os: "Android 15", manufacturer: "Samsung", dataUsage: 1870, lastSeen: "now", vlan: 10 },
  { id: "cd-006", name: "ThinkPad X1 Carbon", type: "laptop", mac: "54:E1:AD:78:F9:06", ip: "10.10.10.22", connectedTo: "rt-004", band: "5GHz", rssi: -48, status: "online", os: "Windows 11 Pro", manufacturer: "Lenovo", dataUsage: 6780, lastSeen: "now", vlan: 10 },
  { id: "cd-007", name: "Epson WorkForce Pro", type: "printer", mac: "64:EB:8C:11:22:07", ip: "10.10.10.51", connectedTo: "rt-005", band: "2.4GHz", rssi: -62, status: "online", os: "Firmware 3.1", manufacturer: "Epson", dataUsage: 120, lastSeen: "5m ago", vlan: 10 },
  { id: "cd-008", name: "iPad Pro 12.9\"", type: "tablet", mac: "DC:A6:32:9B:C1:08", ip: "10.10.10.30", connectedTo: "rt-015", band: "5GHz", rssi: -44, status: "online", os: "iPadOS 18.2", manufacturer: "Apple", dataUsage: 3200, lastSeen: "now", vlan: 10 },
  { id: "cd-009", name: "Ring Doorbell Pro 2", type: "camera", mac: "A0:D0:DC:AA:B1:09", ip: "10.30.30.10", connectedTo: "rt-021", band: "2.4GHz", rssi: -68, status: "online", os: "Firmware 4.8", manufacturer: "Ring", dataUsage: 4500, lastSeen: "now", vlan: 30 },
  { id: "cd-010", name: "Zoom Room Kit", type: "voip", mac: "E8:48:B8:C4:D5:10", ip: "10.40.40.12", connectedTo: "rt-008", band: "Wired", rssi: 0, status: "online", os: "Zoom OS 5.17", manufacturer: "Zoom/DTEN", dataUsage: 5600, lastSeen: "now", vlan: 40 },
  { id: "cd-011", name: "Samsung Smart TV 65\"", type: "smart-tv", mac: "F4:7B:09:55:E2:11", ip: "10.10.10.80", connectedTo: "rt-011", band: "5GHz", rssi: -50, status: "online", os: "Tizen 8.0", manufacturer: "Samsung", dataUsage: 15200, lastSeen: "now", vlan: 10 },
  { id: "cd-012", name: "PS5 Console", type: "gaming", mac: "A8:E3:EE:22:F1:12", ip: "10.10.10.90", connectedTo: "rt-011", band: "5GHz", rssi: -46, status: "idle", os: "PS5 System 24.08", manufacturer: "Sony", dataUsage: 8900, lastSeen: "2h ago", vlan: 10 },
  { id: "cd-013", name: "Nest Thermostat", type: "iot", mac: "18:B4:30:CC:D4:13", ip: "10.30.30.20", connectedTo: "rt-006", band: "2.4GHz", rssi: -72, status: "online", os: "Nest FW 6.4", manufacturer: "Google", dataUsage: 45, lastSeen: "now", vlan: 30 },
  { id: "cd-014", name: "Surface Pro 9", type: "laptop", mac: "C8:E0:EB:11:A4:14", ip: "10.10.10.24", connectedTo: "rt-013", band: "5GHz", rssi: -52, status: "online", os: "Windows 11 Pro", manufacturer: "Microsoft", dataUsage: 7200, lastSeen: "now", vlan: 10 },
  { id: "cd-015", name: "Pixel 8 Pro", type: "phone", mac: "94:B8:6D:55:D7:15", ip: "10.10.10.16", connectedTo: "rt-014", band: "5GHz", rssi: -58, status: "online", os: "Android 15", manufacturer: "Google", dataUsage: 1340, lastSeen: "now", vlan: 10 },
  { id: "cd-016", name: "Canon ImageCLASS", type: "printer", mac: "F0:03:8C:AA:11:16", ip: "10.10.10.52", connectedTo: "rt-013", band: "Wired", rssi: 0, status: "online", os: "Firmware 7.2", manufacturer: "Canon", dataUsage: 280, lastSeen: "now", vlan: 10 },
  { id: "cd-017", name: "MacBook Pro 16\" M3", type: "laptop", mac: "F0:18:98:BB:C2:17", ip: "10.10.10.25", connectedTo: "rt-003", band: "5GHz", rssi: -40, status: "online", os: "macOS 15.2", manufacturer: "Apple", dataUsage: 11200, lastSeen: "now", vlan: 10 },
  { id: "cd-018", name: "Guest iPhone 14", type: "phone", mac: "22:33:44:55:66:18", ip: "10.20.20.100", connectedTo: "rt-017", band: "5GHz", rssi: -60, status: "online", os: "iOS 17.6", manufacturer: "Apple", dataUsage: 890, lastSeen: "now", vlan: 20 },
  { id: "cd-019", name: "Guest Android Tablet", type: "tablet", mac: "33:44:55:66:77:19", ip: "10.20.20.101", connectedTo: "rt-017", band: "2.4GHz", rssi: -65, status: "online", os: "Android 14", manufacturer: "Samsung", dataUsage: 450, lastSeen: "now", vlan: 20 },
  { id: "cd-020", name: "Hikvision Cam #3", type: "camera", mac: "C0:56:E3:DD:F8:20", ip: "10.30.30.11", connectedTo: "rt-021", band: "Wired", rssi: 0, status: "online", os: "Firmware 5.7.21", manufacturer: "Hikvision", dataUsage: 38000, lastSeen: "now", vlan: 30 },
  { id: "cd-021", name: "Hikvision Cam #7", type: "camera", mac: "C0:56:E3:DD:F8:21", ip: "10.30.30.12", connectedTo: "rt-006", band: "Wired", rssi: 0, status: "online", os: "Firmware 5.7.21", manufacturer: "Hikvision", dataUsage: 36500, lastSeen: "now", vlan: 30 },
  { id: "cd-022", name: "Polycom VoIP Phone", type: "voip", mac: "00:04:F2:EE:AA:22", ip: "10.40.40.13", connectedTo: "rt-008", band: "Wired", rssi: 0, status: "online", os: "UC SW 7.2", manufacturer: "Poly", dataUsage: 1200, lastSeen: "now", vlan: 40 },
  { id: "cd-023", name: "Cisco VoIP Phone", type: "voip", mac: "00:1B:D4:FF:BB:23", ip: "10.40.40.14", connectedTo: "rt-015", band: "Wired", rssi: 0, status: "online", os: "SIP 12.8", manufacturer: "Cisco", dataUsage: 980, lastSeen: "now", vlan: 40 },
  { id: "cd-024", name: "Raspberry Pi Lab", type: "iot", mac: "B8:27:EB:11:22:24", ip: "10.50.50.10", connectedTo: "rt-013", band: "Wired", rssi: 0, status: "online", os: "Raspbian 12", manufacturer: "Raspberry Pi", dataUsage: 2300, lastSeen: "now", vlan: 50 },
  { id: "cd-025", name: "Dell Latitude 5540", type: "laptop", mac: "D4:81:D7:44:CC:25", ip: "10.10.10.26", connectedTo: "rt-005", band: "5GHz", rssi: -54, status: "online", os: "Windows 11 Pro", manufacturer: "Dell", dataUsage: 5400, lastSeen: "now", vlan: 10 },
  { id: "cd-026", name: "Amazon Echo Show", type: "iot", mac: "44:65:0D:EE:FF:26", ip: "10.30.30.21", connectedTo: "rt-011", band: "2.4GHz", rssi: -66, status: "online", os: "Fire OS 8", manufacturer: "Amazon", dataUsage: 780, lastSeen: "now", vlan: 30 },
  { id: "cd-027", name: "HP EliteBook 840", type: "laptop", mac: "3C:52:82:AA:DD:27", ip: "10.10.10.27", connectedTo: "rt-014", band: "5GHz", rssi: -56, status: "idle", os: "Windows 11 Pro", manufacturer: "HP", dataUsage: 3200, lastSeen: "35m ago", vlan: 10 },
  { id: "cd-028", name: "Nintendo Switch", type: "gaming", mac: "98:41:5C:BB:EE:28", ip: "10.10.10.91", connectedTo: "rt-011", band: "5GHz", rssi: -58, status: "offline", os: "Switch FW 19.0", manufacturer: "Nintendo", dataUsage: 0, lastSeen: "2d ago", vlan: 10 },
  { id: "cd-029", name: "LG Smart TV 55\"", type: "smart-tv", mac: "A8:23:FE:CC:11:29", ip: "10.10.10.81", connectedTo: "rt-008", band: "5GHz", rssi: -48, status: "idle", os: "webOS 24", manufacturer: "LG", dataUsage: 9800, lastSeen: "4h ago", vlan: 10 },
  { id: "cd-030", name: "Unknown Device", type: "phone", mac: "FF:00:11:22:33:30", ip: "10.20.20.199", connectedTo: "rt-017", band: "2.4GHz", rssi: -78, status: "online", os: "Unknown", manufacturer: "Unknown", dataUsage: 2200, lastSeen: "now", vlan: 20 },
  { id: "cd-031", name: "iMac 24\" M3", type: "desktop", mac: "14:98:77:DD:AA:31", ip: "10.10.10.21", connectedTo: "rt-003", band: "Wired", rssi: 0, status: "online", os: "macOS 15.2", manufacturer: "Apple", dataUsage: 18500, lastSeen: "now", vlan: 10 },
  { id: "cd-032", name: "Xerox VersaLink C405", type: "printer", mac: "9C:93:4E:BB:CC:32", ip: "10.10.10.53", connectedTo: "rt-003", band: "Wired", rssi: 0, status: "online", os: "Firmware 8.1", manufacturer: "Xerox", dataUsage: 560, lastSeen: "now", vlan: 10 },
];

export const aiInsights = [
  { id: "ai-1", title: "Channel Optimization Available", description: "3 devices on overlapping 2.4GHz channels. AI can redistribute to minimize interference by 34%.", impact: "high" as const, action: "Auto-Optimize Channels" },
  { id: "ai-2", title: "Predictive Load Balancing", description: "Based on 30-day patterns, Tuesday 2PM spike expected. Pre-staging QoS rules for 15 devices.", impact: "medium" as const, action: "Apply Pre-staging" },
  { id: "ai-3", title: "Firmware Rollout Recommended", description: "4 devices running outdated firmware. Staged rollout plan ready - zero downtime estimated.", impact: "high" as const, action: "Start Rollout" },
  { id: "ai-4", title: "Client Migration Suggested", description: "Floor2-East-01 overloaded (22 clients). AI suggests migrating 8 clients to Floor2-West-01.", impact: "medium" as const, action: "Migrate Clients" },
  { id: "ai-5", title: "Security Anomaly Detected", description: "Unusual traffic pattern on Guest-Net-01. 3 clients generating abnormal DNS queries.", impact: "critical" as const, action: "Investigate" },
];
