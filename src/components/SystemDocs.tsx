import React from 'react';
import { 
  Users, 
  Map, 
  Zap, 
  GitBranch, 
  FileJson, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  MessageSquare,
  Mail
} from 'lucide-react';

const STAKEHOLDERS = [
  {
    name: 'BCCI',
    role: 'Primary Content Owner',
    value: 'Loss prevention on high-value IPL digital rights; integrity monitoring of broadcast assets.',
  },
  {
    name: 'Star Sports',
    role: 'Official Broadcaster',
    value: 'Protection of exclusive broadcast slots; verification of sub-licensed distribution.',
  },
  {
    name: 'JioCinema',
    role: 'Streaming Partner',
    value: 'Reduced piracy-led concurrent viewer churn; real-time takedown during live matches.',
  },
  {
    name: 'Trust & Safety Teams',
    role: 'Platform Moderator Support',
    value: 'Pre-verified flags to speed up manual review cycles by 40%.',
  },
];

const MILESTONES = [
  { week: 'W1', title: 'Detection Engine', items: ['Perceptual Hashing', 'Vector Embeddings', 'Database Schema'], status: 'completed' },
  { week: 'W2', title: 'Transform Detection', items: ['Crop/Mirror Logic', 'OCR Meme Overlay', 'AI Explainer'], status: 'completed' },
  { week: 'W3', title: 'Dashboard & Alerts', items: ['Real-time Feed', 'ROI Analytics', 'Incident Details'], status: 'current' },
  { week: 'W4', title: 'Platform Scale', items: ['API Integration Hooks', 'Automated DMCA', 'Multi-tenant Support'], status: 'pending' },
];

export default function SystemDocs() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">System & Roadmap</h2>
        <p className="text-slate-500 text-sm">Stakeholder alignment, integration architecture, and development timeline.</p>
      </div>

      {/* Stakeholders Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Ecosystem Stakeholders</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAKEHOLDERS.map((s) => (
            <div key={s.name} className="p-5 bg-[#0D0D0E] border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{s.name}</h4>
                <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">{s.role}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Points Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Conceptual Integration Hooks</h3>
        </div>
        <div className="p-6 bg-[#0D0D0E] border border-slate-800 rounded-3xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <IntegrationStep 
              icon={Layers} 
              title="Broadcast Pipeline" 
              desc="Simulated direct feed ingestion from satellite/IP stream using frame chunking."
            />
            <IntegrationStep 
              icon={FileJson} 
              title="CMS Sync" 
              desc="Automatic source media enrollment via sports organization's media asset management systems."
            />
            <IntegrationStep 
              icon={MessageSquare} 
              title="Takedown API" 
              desc="Pre-built hooks for Meta Rights Manager, Twitter API v2, and YouTube CMS ContentID."
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Development Pulse</h3>
        </div>
        <div className="flex items-stretch gap-4 overflow-x-auto pb-4">
          {MILESTONES.map((m) => (
            <div 
              key={m.week} 
              className={`flex-1 min-w-[200px] p-5 rounded-2xl border transition-all ${
                m.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                m.status === 'current' ? 'bg-blue-500/5 border-blue-500/40' : 
                'bg-[#0D0D0E] border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                  m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                  m.status === 'current' ? 'bg-blue-500/20 text-blue-400' : 
                  'bg-slate-800 text-slate-500'
                }`}>
                  {m.week}
                </span>
                {m.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {m.status === 'current' && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{m.title}</h4>
              <ul className="space-y-1">
                {m.items.map(item => (
                  <li key={item} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntegrationStep({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-3">
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
