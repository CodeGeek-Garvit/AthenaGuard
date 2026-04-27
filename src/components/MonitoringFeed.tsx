import React from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  User, 
  Layers, 
  ArrowRight,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ViolationIncident } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { detectionService } from '../services/DetectionService';

export default function MonitoringFeed({ incidents, onViewDetails }: { 
  incidents: ViolationIncident[],
  onViewDetails: (id: string) => void 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Monitoring</h2>
          <p className="text-slate-500 text-sm">Real-time detection stream powered by Athena Fingerprinting.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0B] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                P{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0B] bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              +5
            </div>
          </div>
          <button 
            onClick={() => {
              detectionService.triggerManualScan();
              // Small visual feedback is usually good
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-[#0A0A0B] text-xs font-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 group"
          >
            <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
            TRIGGER SIMULATION
          </button>
        </div>
      </div>

      {/* Monitoring Table */}
      <div className="bg-[#0D0D0E] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/30 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <div className="col-span-3">Detected Content</div>
          <div className="col-span-2">Platform</div>
          <div className="col-span-2">Transformations</div>
          <div className="col-span-1 text-center">Match</div>
          <div className="col-span-2 text-center">Decision Engine</div>
          <div className="col-span-2 text-right">Detected At</div>
        </div>

        <div className="divide-y divide-slate-800/50">
          <AnimatePresence initial={false}>
            {incidents.map((incident) => (
              <motion.div 
                key={incident.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-900/40 transition-colors group relative cursor-pointer"
                onClick={() => onViewDetails(incident.id)}
              >
                {incident.status === 'pending' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />
                )}
                
                <div className="col-span-3 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0 shadow-lg">
                    <img src={incident.detectedUrl} className="w-full h-full object-cover opacity-80" alt="Detected" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{incident.posterAccount}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <User className="w-3 h-3" />
                      <span className="truncate">{incident.id.split('_').pop()}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 capitalize">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={incident.platform} />
                    <span className="text-xs text-slate-300">{incident.platform}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {incident.transformation.slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-800 rounded text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                        {t.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 text-center">
                  <span className={cn(
                    "text-xs font-mono font-black",
                    incident.similarityScore > 0.9 ? "text-emerald-400" : incident.similarityScore > 0.75 ? "text-amber-400" : "text-slate-500"
                  )}>
                    {(incident.similarityScore * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="col-span-2 text-center flex flex-col gap-1 items-center">
                  {incident.status === 'pending' ? (
                    <>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                        incident.confidence === 'High' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                        incident.confidence === 'Medium' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : 
                        "bg-slate-800 text-slate-500"
                      )}>
                        {incident.confidence}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{incident.recommendedAction}</span>
                    </>
                  ) : (
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      incident.status === 'Sent' || incident.status === 'Resolved' ? "bg-emerald-500 text-[#0A0A0B]" :
                      incident.status === 'flagged' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      "bg-slate-800 text-slate-500"
                    )}>
                      {incident.status}
                    </span>
                  )}
                </div>

                <div className="col-span-2 text-right flex items-center justify-end gap-3 px-2">
                  <div className="flex flex-col items-end mr-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDistanceToNow(incident.detectedAt, { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {incident.status === 'pending' && (
                      <>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            detectionService.updateIncidentStatus(incident.id, 'flagged'); 
                          }}
                          className="p-1.5 hover:bg-emerald-500/10 text-slate-600 hover:text-emerald-400 rounded-lg transition-all"
                          title="Issue Takedown"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            detectionService.updateIncidentStatus(incident.id, 'dismissed'); 
                          }}
                          className="p-1.5 hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 rounded-lg transition-all"
                          title="Dismiss"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewDetails(incident.id); }}
                      className="p-1.5 hover:bg-slate-800 text-slate-600 hover:text-white rounded-lg transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ShieldTriangle({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function PlatformIcon({ platform }: { platform: ViolationIncident['platform'] }) {
  // Mock icons for platforms
  const colors = {
    twitter: "text-sky-400",
    instagram: "text-pink-400",
    tiktok: "text-white",
    youtube: "text-rose-500",
    facebook: "text-blue-500",
  };

  return (
    <div className={cn("w-2 h-2 rounded-full", colors[platform] || "bg-slate-400")} />
  );
}
