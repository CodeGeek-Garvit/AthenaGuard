import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { ViolationIncident } from '../types';
import { cn } from '../lib/utils';

const PLATFORM_DATA = [
  { name: 'Twitter', detections: 450, growth: 12 },
  { name: 'Instagram', detections: 320, growth: -5 },
  { name: 'TikTok', detections: 890, growth: 28 },
  { name: 'YouTube', detections: 150, growth: 2 },
  { name: 'FB', detections: 80, growth: -8 },
];

const TREND_DATA = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 600 },
  { time: '12:00', value: 800 },
  { time: '16:00', value: 550 },
  { time: '20:00', value: 900 },
];

export default function DashboardView({ incidents }: { incidents: ViolationIncident[] }) {
  const activeViolations = incidents.filter(i => i.status === 'pending').length;
  const avgConfidence = incidents.length > 0
    ? (incidents.reduce((acc, curr) => acc + curr.similarityScore, 0) / incidents.length) * 100
    : 92.4;
  
  const estimatedRevenueLoss = (incidents.length * 15200) / 10000000; // Mock calculation: ₹15.2k per incident

  const dynamicPlatformData = PLATFORM_DATA.map(p => {
    const count = incidents.filter(i => i.platform.toLowerCase().includes(p.name.toLowerCase())).length;
    return { ...p, detections: p.detections + count * 10 }; // Base + simulation growth
  });

  const dynamicTrendData = TREND_DATA.map((d, i) => {
    const hoursAgo = (TREND_DATA.length - 1 - i) * 4;
    const timeThreshold = new Date(Date.now() - hoursAgo * 3600000);
    const count = incidents.filter(inc => inc.detectedAt > timeThreshold).length;
    return { ...d, value: d.value + count * 150 }; // Increased multiplier for visibility
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Security Overview</h2>
        <p className="text-slate-500 text-sm">System-wide monitoring aggregates and threat levels.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue Protection" 
          value={`₹${estimatedRevenueLoss.toFixed(2)} Cr`}
          change="+12.5%" 
          trend="up" 
          icon={TrendingUp}
          color="emerald"
          subtitle="Estimated loss prevented"
        />
        <StatCard 
          title="Detected Violations" 
          value={incidents.length.toString()} 
          change={`+${incidents.filter(i => {
            const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
            return i.detectedAt > fiveMinsAgo;
          }).length}`}
          trend="up" 
          icon={AlertCircle}
          color="rose"
        />
        <StatCard 
          title="Avg. Match Confidence" 
          value={`${avgConfidence.toFixed(1)}%`}
          change="+0.8%" 
          trend="up" 
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard 
          title="Monitored Reach" 
          value="18.5M" 
          change="+2.1M" 
          trend="up" 
          icon={Globe}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detection Trend */}
        <div className="lg:col-span-2 p-6 bg-[#0D0D0E] border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Detection Pulse</h3>
              <p className="text-xs text-slate-500">Real-time incident frequency across target platforms</p>
            </div>
            <select className="bg-slate-900 border border-slate-800 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg text-slate-400 focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="p-6 bg-[#0D0D0E] border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-1">Platform Impact</h3>
          <p className="text-xs text-slate-500 mb-8">Violation distribution by platform</p>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicPlatformData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="detections" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                  barSize={12} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {dynamicPlatformData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{item.name}</span>
                <span className={cn(
                  "font-mono font-medium",
                  item.growth > 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {item.growth > 0 ? '+' : ''}{item.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, color, subtitle }: { 
  title: string, 
  value: string, 
  change: string, 
  trend: 'up' | 'down', 
  icon: any,
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose',
  subtitle?: string
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="p-5 bg-[#0D0D0E] border border-slate-800 rounded-2xl relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-xl border", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium",
          trend === 'up' ? "text-emerald-400" : "text-rose-400"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
        color === 'emerald' ? "bg-emerald-500" : color === 'blue' ? "bg-blue-500" : color === 'purple' ? "bg-purple-500" : color === 'amber' ? "bg-amber-500" : "bg-rose-500"
      )} />
    </div>
  );
}
