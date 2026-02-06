"use client";

import { devices, aiInsights } from "@/lib/mock-data";

function AIMetricRing({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function AIControlPage() {
  const onlineDevices = devices.filter((d) => d.status !== "offline");
  const avgAiScore = Math.round(onlineDevices.reduce((a, d) => a + d.aiScore, 0) / onlineDevices.length);
  const optimizedCount = onlineDevices.filter((d) => d.aiScore >= 80).length;
  const needsAttention = onlineDevices.filter((d) => d.aiScore < 60).length;

  const aiModels = [
    { name: "Channel Optimizer", status: "active", accuracy: 94, lastRun: "2m ago", version: "v2.3.1" },
    { name: "Load Predictor", status: "active", accuracy: 89, lastRun: "5m ago", version: "v1.8.0" },
    { name: "Anomaly Detector", status: "active", accuracy: 97, lastRun: "30s ago", version: "v3.1.2" },
    { name: "QoS Optimizer", status: "training", accuracy: 78, lastRun: "1h ago", version: "v1.2.0-beta" },
    { name: "Firmware Risk Analyzer", status: "active", accuracy: 92, lastRun: "15m ago", version: "v2.0.4" },
  ];

  const automationRules = [
    { name: "Auto Channel Switch", trigger: "Interference > 40%", action: "Switch to optimal channel", enabled: true, executions: 147 },
    { name: "Client Load Balance", trigger: "Clients > 20 on single AP", action: "Migrate to nearest AP", enabled: true, executions: 89 },
    { name: "Firmware Auto-Update", trigger: "New stable release", action: "Staged rollout (5/hr)", enabled: false, executions: 12 },
    { name: "Bandwidth Throttle", trigger: "Total usage > 90%", action: "Apply fair-share QoS", enabled: true, executions: 234 },
    { name: "Security Lockdown", trigger: "Anomaly score > 0.8", action: "Isolate + alert admin", enabled: true, executions: 3 },
    { name: "Power Optimization", trigger: "No clients for 30min", action: "Reduce TX power 50%", enabled: true, executions: 567 },
  ];

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">AI Control Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Intelligent network management & automation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-carbon-400 bg-carbon-500/10 px-3 py-1.5 rounded-lg border border-carbon-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-carbon-400 animate-pulse" />
              AI Engine Running
            </div>
            <button className="text-xs bg-carbon-600 text-white px-4 py-1.5 rounded-lg hover:bg-carbon-500 transition-colors font-medium">
              Run Full Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* AI Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow flex flex-col items-center justify-center">
            <AIMetricRing label="Fleet Health" value={avgAiScore} max={100} color="#14b8a6" />
            <p className="text-xs text-slate-400 mt-3 text-center">AI-computed network health across {onlineDevices.length} active devices</p>
          </div>

          <div className="lg:col-span-3 bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <h3 className="text-sm font-semibold text-white mb-4">AI Performance Overview</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{optimizedCount}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Optimized</p>
                <p className="text-[10px] text-slate-600">AI Score 80+</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">{needsAttention}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Needs Attention</p>
                <p className="text-[10px] text-slate-600">AI Score &lt;60</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-carbon-400">1,052</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Auto-Actions (24h)</p>
                <p className="text-[10px] text-slate-600">Channel, QoS, Power</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">99.7%</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Prediction Accuracy</p>
                <p className="text-[10px] text-slate-600">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Models */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">AI Models</h3>
              <span className="text-[10px] text-slate-500">{aiModels.filter((m) => m.status === "active").length}/{aiModels.length} active</span>
            </div>
            <div className="space-y-3">
              {aiModels.map((model, i) => (
                <div key={i} className="bg-navy-900/50 rounded-lg p-3 border border-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${model.status === "active" ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
                      <span className="text-xs font-medium text-white">{model.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{model.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Accuracy: <span className="text-carbon-400 font-semibold">{model.accuracy}%</span></span>
                    <span className="text-slate-500">Last run: {model.lastRun}</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-carbon-600 to-carbon-400 rounded-full" style={{ width: `${model.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Rules */}
          <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Automation Rules</h3>
              <button className="text-[10px] text-carbon-400 hover:text-carbon-300 uppercase tracking-wider">+ New Rule</button>
            </div>
            <div className="space-y-3">
              {automationRules.map((rule, i) => (
                <div key={i} className={`bg-navy-900/50 rounded-lg p-3 border ${rule.enabled ? "border-slate-800/30" : "border-slate-800/20 opacity-60"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">{rule.name}</span>
                    <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${rule.enabled ? "bg-carbon-500" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${rule.enabled ? "translate-x-4" : ""}`} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p>Trigger: <span className="text-slate-400">{rule.trigger}</span></p>
                    <p>Action: <span className="text-carbon-400">{rule.action}</span></p>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-600">{rule.executions} executions total</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Insights */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-carbon-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <h3 className="text-sm font-semibold text-white">Active AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="bg-navy-900/50 rounded-lg p-4 border border-slate-800/30 hover:border-carbon-500/20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded ${
                    insight.impact === "critical" ? "bg-red-500/10 text-red-400" :
                    insight.impact === "high" ? "bg-amber-500/10 text-amber-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>{insight.impact} impact</span>
                </div>
                <h4 className="text-xs font-medium text-white mb-1">{insight.title}</h4>
                <p className="text-[11px] text-slate-500 mb-3">{insight.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 text-[10px] bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors font-medium">
                    {insight.action}
                  </button>
                  <button className="text-[10px] text-slate-500 px-3 py-1.5 rounded border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Activity Log */}
        <div className="mt-6 bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-4">Recent AI Activity</h3>
          <div className="space-y-2">
            {[
              { time: "14:32:15", action: "Channel Switch", detail: "Branch-North-01: 2.4GHz Ch1 → Ch11 (interference reduced 42%)", type: "success" },
              { time: "14:28:03", action: "Load Balance", detail: "Migrated 3 clients from Floor2-East-01 → Floor2-West-01", type: "success" },
              { time: "14:25:47", action: "Anomaly Alert", detail: "Guest-Net-01: Unusual DNS pattern from 3 clients - monitoring", type: "warning" },
              { time: "14:20:12", action: "QoS Applied", detail: "Training-01: Pre-staged bandwidth rules for upcoming session", type: "info" },
              { time: "14:15:00", action: "Power Adjust", detail: "Storage-AP-01: TX power reduced 50% (0 clients for 45min)", type: "success" },
              { time: "14:10:33", action: "Prediction", detail: "Cafeteria-01: Lunch peak predicted in 20min - QoS pre-applied", type: "info" },
              { time: "14:05:18", action: "Firmware Scan", detail: "4 devices flagged for update - rollout plan generated", type: "info" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-2 border-b border-slate-800/20 last:border-0">
                <span className="text-slate-600 font-mono w-16 shrink-0">{log.time}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  log.type === "success" ? "bg-green-400" : log.type === "warning" ? "bg-amber-400" : "bg-blue-400"
                }`} />
                <span className="text-carbon-400 font-medium w-28 shrink-0">{log.action}</span>
                <span className="text-slate-400 truncate">{log.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
