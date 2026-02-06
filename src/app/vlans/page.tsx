"use client";

import { useState } from "react";

interface Vlan {
  id: number;
  name: string;
  subnet: string;
  gateway: string;
  devices: number;
  clients: number;
  bandwidth: string;
  tagged: string[];
  color: string;
}

interface AclEntry {
  id: string;
  mac: string;
  device: string;
  type: "whitelist" | "blacklist";
  vlan: number;
  reason: string;
  addedBy: string;
  addedAt: string;
}

const vlans: Vlan[] = [
  { id: 1, name: "Management", subnet: "192.168.1.0/24", gateway: "192.168.1.1", devices: 22, clients: 0, bandwidth: "N/A", tagged: ["All APs"], color: "text-carbon-400" },
  { id: 10, name: "Corporate", subnet: "10.10.10.0/24", gateway: "10.10.10.1", devices: 18, clients: 95, bandwidth: "2.4 Gbps", tagged: ["Core-Gateway", "Branch-North", "Branch-South", "Floor2-East", "Floor2-West"], color: "text-blue-400" },
  { id: 20, name: "Guest", subnet: "10.20.20.0/24", gateway: "10.20.20.1", devices: 8, clients: 45, bandwidth: "800 Mbps", tagged: ["Guest-Net-01", "Lobby-AP-01", "Cafeteria-01"], color: "text-purple-400" },
  { id: 30, name: "IoT / Cameras", subnet: "10.30.30.0/24", gateway: "10.30.30.1", devices: 6, clients: 34, bandwidth: "450 Mbps", tagged: ["Security-AP-01", "Warehouse-01", "Loading-Dock-01"], color: "text-amber-400" },
  { id: 40, name: "VoIP", subnet: "10.40.40.0/24", gateway: "10.40.40.1", devices: 10, clients: 22, bandwidth: "320 Mbps", tagged: ["Conf-Room-01", "Exec-Suite-01", "Training-01"], color: "text-green-400" },
  { id: 50, name: "Lab / Testing", subnet: "10.50.50.0/24", gateway: "10.50.50.1", devices: 3, clients: 16, bandwidth: "1.2 Gbps", tagged: ["Lab-AP-01", "Server-Room-01"], color: "text-red-400" },
  { id: 99, name: "Quarantine", subnet: "10.99.99.0/24", gateway: "10.99.99.1", devices: 2, clients: 3, bandwidth: "50 Mbps", tagged: ["Core-Gateway-01"], color: "text-slate-400" },
];

const aclEntries: AclEntry[] = [
  { id: "acl-01", mac: "AA:BB:CC:11:22:33", device: "Unknown Laptop", type: "blacklist", vlan: 10, reason: "Rogue device - unauthorized access attempt", addedBy: "AI Engine", addedAt: "2h ago" },
  { id: "acl-02", mac: "DD:EE:FF:44:55:66", device: "Personal Phone", type: "blacklist", vlan: 10, reason: "Policy violation - P2P traffic detected", addedBy: "Admin", addedAt: "1d ago" },
  { id: "acl-03", mac: "11:22:33:AA:BB:CC", device: "Suspicious IoT", type: "blacklist", vlan: 30, reason: "AI detected: abnormal DNS exfiltration pattern", addedBy: "AI Engine", addedAt: "45m ago" },
  { id: "acl-04", mac: "3C:06:30:A1:B2:01", device: "CEO iPhone 15 Pro", type: "whitelist", vlan: 10, reason: "VIP - priority access all VLANs", addedBy: "Admin", addedAt: "30d ago" },
  { id: "acl-05", mac: "A4:83:E7:22:D3:02", device: "CFO MacBook Air", type: "whitelist", vlan: 10, reason: "VIP - priority access all VLANs", addedBy: "Admin", addedAt: "30d ago" },
  { id: "acl-06", mac: "B0:72:BF:45:E6:03", device: "Security Camera #12", type: "whitelist", vlan: 30, reason: "Verified IoT device - static assignment", addedBy: "AI Engine", addedAt: "15d ago" },
  { id: "acl-07", mac: "54:E1:AD:78:F9:04", device: "Zoom Room Kit - Conf A", type: "whitelist", vlan: 40, reason: "Verified VoIP endpoint", addedBy: "Admin", addedAt: "60d ago" },
  { id: "acl-08", mac: "FF:00:11:22:33:44", device: "Spoofed MAC Device", type: "blacklist", vlan: 20, reason: "AI detected: MAC spoofing attempt on guest network", addedBy: "AI Engine", addedAt: "3h ago" },
];

export default function VlanPage() {
  const [tab, setTab] = useState<"vlans" | "blacklist" | "whitelist">("vlans");
  const filteredAcl = tab === "blacklist"
    ? aclEntries.filter((e) => e.type === "blacklist")
    : aclEntries.filter((e) => e.type === "whitelist");

  return (
    <div className="min-h-screen grid-bg">
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">VLAN Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Network segmentation, access control lists & device policies</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              + Add VLAN
            </button>
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              AI Segment Scan
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-navy-850 rounded-lg border border-slate-800/50 p-1 mb-6 w-fit">
          {([
            { key: "vlans", label: "VLANs" },
            { key: "blacklist", label: "Blacklist" },
            { key: "whitelist", label: "Whitelist" },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${tab === t.key ? "bg-carbon-500/10 text-carbon-400" : "text-slate-500 hover:text-slate-300"}`}>
              {t.label}
              {t.key === "blacklist" && <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded-full">{aclEntries.filter((e) => e.type === "blacklist").length}</span>}
              {t.key === "whitelist" && <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded-full">{aclEntries.filter((e) => e.type === "whitelist").length}</span>}
            </button>
          ))}
        </div>

        {tab === "vlans" && (
          <>
            {/* VLAN Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {vlans.map((vlan) => (
                <div key={vlan.id} className="bg-navy-850 rounded-xl border border-slate-800/50 p-5 card-glow hover:border-slate-700/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${vlan.color}`}>VLAN {vlan.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-navy-900 px-2 py-0.5 rounded">{vlan.clients} clients</span>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{vlan.name}</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-500">Subnet</span><span className="text-slate-300 font-mono">{vlan.subnet}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Gateway</span><span className="text-slate-300 font-mono">{vlan.gateway}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Bandwidth</span><span className="text-slate-300">{vlan.bandwidth}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tagged APs</span><span className="text-slate-300">{vlan.tagged.length}</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/30">
                    <p className="text-[9px] text-slate-600 truncate">APs: {vlan.tagged.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inter-VLAN routing */}
            <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
              <h3 className="text-sm font-semibold text-white mb-4">Inter-VLAN Routing Rules</h3>
              <div className="space-y-2">
                {[
                  { from: "Corporate (10)", to: "VoIP (40)", policy: "Allow", desc: "Office phones and conferencing" },
                  { from: "Corporate (10)", to: "Guest (20)", policy: "Deny", desc: "Network isolation" },
                  { from: "Guest (20)", to: "IoT (30)", policy: "Deny", desc: "Guest cannot access cameras" },
                  { from: "IoT (30)", to: "Corporate (10)", policy: "Deny", desc: "IoT devices isolated from corporate" },
                  { from: "Lab (50)", to: "Corporate (10)", policy: "Limited", desc: "Read-only file share access" },
                  { from: "Any", to: "Quarantine (99)", policy: "Deny", desc: "Quarantined devices fully isolated" },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-4 bg-navy-900/30 rounded-lg p-3">
                    <span className="text-xs text-slate-300 w-32">{rule.from}</span>
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    <span className="text-xs text-slate-300 w-32">{rule.to}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      rule.policy === "Allow" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      rule.policy === "Deny" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>{rule.policy}</span>
                    <span className="text-[10px] text-slate-500 flex-1">{rule.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {(tab === "blacklist" || tab === "whitelist") && (
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 overflow-hidden card-glow">
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {tab === "blacklist" ? "Blacklisted Devices" : "Whitelisted Devices"}
              </h3>
              <button className={`text-[10px] px-3 py-1 rounded border transition-colors ${
                tab === "blacklist"
                  ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              }`}>
                + Add {tab === "blacklist" ? "to Blacklist" : "to Whitelist"}
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Device</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">MAC Address</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">VLAN</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Reason</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Added By</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">When</th>
                  <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcl.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-800/20 hover:bg-navy-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${entry.type === "blacklist" ? "bg-red-400" : "bg-green-400"}`} />
                        <span className="text-xs text-white">{entry.device}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">{entry.mac}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">VLAN {entry.vlan}</td>
                    <td className="px-4 py-3 text-[10px] text-slate-400 max-w-[250px] truncate">{entry.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        entry.addedBy === "AI Engine" ? "bg-purple-500/10 text-purple-400" : "bg-slate-800 text-slate-400"
                      }`}>{entry.addedBy}</span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-500">{entry.addedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {entry.type === "blacklist" ? (
                          <button className="text-[10px] text-green-400 hover:text-green-300">Unblock</button>
                        ) : (
                          <button className="text-[10px] text-red-400 hover:text-red-300">Remove</button>
                        )}
                        <button className="text-[10px] text-slate-500 hover:text-slate-300">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
