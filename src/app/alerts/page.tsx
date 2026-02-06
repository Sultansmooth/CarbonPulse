"use client";

import { alerts } from "@/lib/mock-data";

function AlertIcon({ type }: { type: string }) {
  if (type === "critical") return <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>;
  if (type === "warning") return <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg></div>;
  if (type === "ai-insight") return <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg></div>;
  return <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg></div>;
}

export default function AlertsPage() {
  const critical = alerts.filter((a) => a.type === "critical");
  const warning = alerts.filter((a) => a.type === "warning");
  const ai = alerts.filter((a) => a.type === "ai-insight");

  return (
    <div className="min-h-screen grid-bg">
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Alert Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">{alerts.length} active alerts across network</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs bg-slate-800/50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700/30 hover:bg-slate-800 transition-colors">
              Mark All Read
            </button>
            <button className="text-xs bg-carbon-500/10 text-carbon-400 px-3 py-1.5 rounded-lg border border-carbon-500/20 hover:bg-carbon-500/20 transition-colors">
              Configure Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-850 rounded-xl border border-red-500/20 p-4 card-glow">
            <p className="text-xs text-red-400 font-medium">Critical</p>
            <p className="text-2xl font-bold text-red-400">{critical.length}</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-amber-500/20 p-4 card-glow">
            <p className="text-xs text-amber-400 font-medium">Warnings</p>
            <p className="text-2xl font-bold text-amber-400">{warning.length}</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-purple-500/20 p-4 card-glow">
            <p className="text-xs text-purple-400 font-medium">AI Insights</p>
            <p className="text-2xl font-bold text-purple-400">{ai.length}</p>
          </div>
          <div className="bg-navy-850 rounded-xl border border-blue-500/20 p-4 card-glow">
            <p className="text-xs text-blue-400 font-medium">Info</p>
            <p className="text-2xl font-bold text-blue-400">{alerts.length - critical.length - warning.length - ai.length}</p>
          </div>
        </div>

        {/* Alert List */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 card-glow">
          <div className="space-y-0">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-5 border-b border-slate-800/30 last:border-0 hover:bg-navy-900/30 transition-colors">
                <AlertIcon type={alert.type} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      alert.type === "critical" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      alert.type === "warning" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      alert.type === "ai-insight" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>{alert.type === "ai-insight" ? "AI Insight" : alert.type}</span>
                    <span className="text-[10px] text-slate-600">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-200">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">Source: {alert.deviceName} ({alert.deviceId})</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="text-[10px] text-carbon-400 px-3 py-1 rounded border border-carbon-500/20 hover:bg-carbon-500/10 transition-colors">
                    Investigate
                  </button>
                  <button className="text-[10px] text-slate-500 px-2 py-1 rounded hover:text-slate-300 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
