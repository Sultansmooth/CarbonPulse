"use client";

export default function SettingsPage() {
  return (
    <div className="min-h-screen grid-bg">
      <div className="border-b border-slate-800/50 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure Carbon Pulse network management</p>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        {/* General Settings */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">General</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Auto-refresh interval</p><p className="text-[10px] text-slate-500">How often dashboard data refreshes</p></div>
              <select className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30">
                <option>5 seconds</option><option>10 seconds</option><option>30 seconds</option><option>1 minute</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Dark mode</p><p className="text-[10px] text-slate-500">Interface theme preference</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-carbon-500"><div className="w-3 h-3 rounded-full bg-white translate-x-4" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Timezone</p><p className="text-[10px] text-slate-500">Display times in this timezone</p></div>
              <select className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30">
                <option>UTC-5 (Eastern)</option><option>UTC-6 (Central)</option><option>UTC-7 (Mountain)</option><option>UTC-8 (Pacific)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">AI Engine</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Autonomous mode</p><p className="text-[10px] text-slate-500">Allow AI to make changes without approval</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-slate-700"><div className="w-3 h-3 rounded-full bg-white" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Analysis frequency</p><p className="text-[10px] text-slate-500">How often AI runs network analysis</p></div>
              <select className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30">
                <option>Every 1 minute</option><option>Every 5 minutes</option><option>Every 15 minutes</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Predictive modeling</p><p className="text-[10px] text-slate-500">Enable predictive load and issue forecasting</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-carbon-500"><div className="w-3 h-3 rounded-full bg-white translate-x-4" /></div>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Network Discovery</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Auto-discovery</p><p className="text-[10px] text-slate-500">Automatically detect new RT-AX55 devices</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-carbon-500"><div className="w-3 h-3 rounded-full bg-white translate-x-4" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">SNMP community</p><p className="text-[10px] text-slate-500">SNMP community string for device polling</p></div>
              <input type="text" defaultValue="public" className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30 w-40" />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Scan interval</p><p className="text-[10px] text-slate-500">Network discovery scan frequency</p></div>
              <select className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30">
                <option>Every 5 minutes</option><option>Every 15 minutes</option><option>Every hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-navy-850 rounded-xl border border-slate-800/50 p-6 card-glow">
          <h3 className="text-sm font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Email alerts</p><p className="text-[10px] text-slate-500">Send critical alerts via email</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-carbon-500"><div className="w-3 h-3 rounded-full bg-white translate-x-4" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Slack integration</p><p className="text-[10px] text-slate-500">Post alerts to Slack channel</p></div>
              <div className="w-8 h-4 rounded-full p-0.5 cursor-pointer bg-slate-700"><div className="w-3 h-3 rounded-full bg-white" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-300">Alert threshold</p><p className="text-[10px] text-slate-500">Minimum severity to trigger notification</p></div>
              <select className="bg-navy-900 border border-slate-800/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-carbon-500/30">
                <option>Critical only</option><option>Warning and above</option><option>All alerts</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
