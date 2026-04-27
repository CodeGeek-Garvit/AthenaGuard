import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  ExternalLink, 
  ShieldAlert, 
  EyeOff, 
  Download, 
  Bot,
  Zap,
  History,
  Share2,
  Lock,
  Globe,
  TrendingUp,
  ArrowRight,
  FileText,
  X,
  Mail,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { ViolationIncident, MediaAsset } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { detectionService } from '../services/DetectionService';
import { motion, AnimatePresence } from 'motion/react';

export default function IncidentDetails({ incident, onBack }: { 
  incident: ViolationIncident, 
  onBack: () => void 
}) {
  const [showDMCAModal, setShowDMCAModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const originalAsset = detectionService.getAssets().find(a => a.id === incident.originalAssetId);

  const handleSendNotice = async () => {
    setIsSending(true);
    await detectionService.sendDMCAEmail(incident);
    setIsSending(false);
    setShowDMCAModal(false);
  };

  const copyToClipboard = () => {
    const text = `DMCA NOTICE\nTarget Platform: ${incident.platform}\nInfringing URL: ${incident.detectedUrl}\nSimilarity: ${(incident.similarityScore * 100).toFixed(0)}%`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    detectionService.addNotification("DMCA text copied to terminal buffer.");
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate PDF generation with a Blob
    const content = `ATHENA GUARD - FORENSIC DMCA NOTICE\n` +
                    `------------------------------------\n` +
                    `INCIDENT ID: ${incident.id}\n` +
                    `TIMESTAMP: ${new Date().toLocaleString()}\n` +
                    `PLATFORM: ${incident.platform}\n` +
                    `VIOLATING URL: ${incident.detectedUrl}\n` +
                    `SIMILARITY SCORE: ${(incident.similarityScore * 100).toFixed(2)}%\n` +
                    `TRANSFORMATIONS: ${incident.transformation.join(', ')}\n\n` +
                    `This document serves as formal notice of copyright infringement...`;
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ATHENA_DMCA_${incident.id.split('_').pop()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setIsDownloading(false);
    detectionService.addNotification(`Forensic PDF for incident ${incident.id.split('_').pop()} exported to local storage.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-900 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Incident Analysis</h2>
          <p className="text-slate-500 text-sm">Ref ID: {incident.id.toUpperCase()}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button 
            onClick={() => setShowDMCAModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
          >
            <FileText className="w-4 h-4" />
            GENERATE DMCA
          </button>
          <button 
            onClick={() => { detectionService.updateIncidentStatus(incident.id, 'flagged'); onBack(); }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            ISSUE TAKEDOWN
          </button>
          <button 
            onClick={() => { detectionService.updateIncidentStatus(incident.id, 'dismissed'); onBack(); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all"
          >
            <EyeOff className="w-4 h-4" />
            DISMISS
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDMCAModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDMCAModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0D0D0E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Automated DMCA Notice</h3>
                </div>
                <button 
                  onClick={() => setShowDMCAModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-400 bg-slate-950/50">
                <p className="text-white font-bold mb-4 uppercase tracking-widest">Digital Millennium Copyright Act Notification</p>
                
                <section>
                  <p className="text-emerald-400 font-bold mb-1">[SENT TO PLATFORM TRUST & SAFETY]</p>
                  <p>Target Platform: {incident.platform.toUpperCase()}</p>
                  <p>Infringing URL: {incident.detectedUrl}</p>
                  <p>Simulation Status: {incident.confidence} Confidence Detection</p>
                </section>

                <section className="space-y-2">
                  <p className="text-white uppercase font-bold">1. Identification of Copyrighted Work</p>
                  <p>Asset ID: {originalAsset?.fingerprint}</p>
                  <p>Asset Title: {originalAsset?.title}</p>
                  <p>Master Reference: {originalAsset?.url}</p>
                </section>

                <section className="space-y-2">
                  <p className="text-white uppercase font-bold">2. Identification of Infringing Material</p>
                  <p>The material identified was detected via AthenaGuard Fingerprinting with a {(incident.similarityScore * 100).toFixed(0)}% similarity score.</p>
                  <p>Detected Transformations: {incident.transformation.join(', ')}</p>
                </section>

                <section className="space-y-2">
                  <p className="text-white uppercase font-bold">3. Verification of Identity</p>
                  <p>Authorized Agent: AthenaGuard Automated Response Engine</p>
                  <p>On behalf of: Star Sports Network / BCCI (Conceptual)</p>
                  <p>Date Generated: {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
                </section>

                <div className="pt-6 border-t border-slate-800 italic opacity-60 text-[9px]">
                  Note: This is a simulation mode output for the AthenaGuard prototype.
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'COPIED' : 'COPY'}
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  EXPORT PDF
                </button>
                <button 
                  onClick={handleSendNotice}
                  disabled={isSending || incident.status === 'Sent'}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all",
                    incident.status === 'Sent' 
                      ? "bg-slate-800 text-slate-500 cursor-default" 
                      : "bg-emerald-500 text-[#0A0A0B] hover:bg-emerald-400 disabled:opacity-50"
                  )}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      {incident.status === 'Sent' ? 'SENT' : 'SEND NOTICE'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Card */}
            <div className="bg-[#0D0D0E] border border-slate-800 rounded-2xl overflow-hidden group">
              <div className="p-3 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Master Source</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">AUTHENTIC</span>
              </div>
              <div className="aspect-video relative overflow-hidden bg-black">
                <img src={originalAsset?.url} className="w-full h-full object-contain" alt="Original" />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-semibold text-white">{originalAsset?.title}</h4>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Asset Fingerprint</span>
                  <span className="text-emerald-400 font-mono tracking-tighter">{originalAsset?.fingerprint}</span>
                </div>
              </div>
            </div>

            {/* Detected Card */}
            <div className="bg-[#0D0D0E] border border-slate-800 rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              <div className="p-3 border-b border-slate-800 bg-rose-900/10 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Detected Misuse</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">VIOLATION</span>
              </div>
              <div className="aspect-video relative overflow-hidden bg-black">
                <img src={incident.detectedUrl} className="w-full h-full object-contain opacity-70" alt="Detected" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-3 py-1.5 bg-rose-500/90 text-white text-xs font-black rounded-lg backdrop-blur shadow-2xl">
                    MATCH FOUND: {(incident.similarityScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-semibold text-white truncate">{incident.posterAccount} on {incident.platform}</h4>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Detected via</span>
                  <span className="text-emerald-400">Deep-CNN Feature Matching</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation Engine */}
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="w-24 h-24 text-emerald-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-emerald-500 rounded-lg">
                <Bot className="w-4 h-4 text-[#0A0A0B]" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Explanation Engine</h3>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Athena-Core-G1 Analysis Complete</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
              "{incident.aiExplanation || "Analyzing spatial patterns and transformation vectors..."}"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {incident.transformation.map(t => (
                <div key={t} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">{t.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Evolution Timeline */}
          <div className="p-6 bg-[#0D0D0E] border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">Propagation Timeline</h3>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Evolution Path: Master → Viral</span>
            </div>

            <div className="relative pl-12 space-y-12">
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-800" />
              
              {incident.evolutionChain.length > 0 ? (
                incident.evolutionChain.map((node, i) => (
                  <div key={node.id} className="relative group">
                    <div className="absolute -left-[37px] top-1 w-7 h-7 rounded-full bg-slate-800 border-4 border-[#0D0D0E] group-hover:scale-125 transition-transform group-hover:bg-emerald-500 group-hover:border-emerald-500/20" />
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-800 shrink-0 shadow-lg">
                        <img src={node.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Evolution Step" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white uppercase">{node.transformation.replace('_', ' ')}</span>
                          <span className="text-[10px] text-slate-500">{format(node.timestamp, 'HH:mm • MMM d, yyyy')}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-40 italic text-sm text-slate-500">
                  Insufficient data points for full evolution mapping. Scanning siblings...
                </div>
              )}

              {/* Terminal Viral Node */}
              <div className="relative group">
                <div className="absolute -left-[37px] top-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-[#0D0D0E] animate-pulse" />
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0 shadow-lg">
                    <img src={incident.detectedUrl} className="w-full h-full object-cover" alt="Viral Node" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-400 uppercase">CURRENT VIRAL INSTANCE</span>
                      <span className="text-[10px] text-emerald-400/60 ">{format(incident.detectedAt, 'HH:mm • MMM d, yyyy')}</span>
                    </div>
                    <p className="text-xs text-emerald-400/80 line-clamp-2 leading-relaxed">
                      Detected on {incident.platform} via {incident.posterAccount}. High engagement trajectory.
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                        <Share2 className="w-3 h-3" />
                        842 SHARES
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                        <Globe className="w-3 h-3" />
                        12.5K REACH
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-[#0D0D0E] border border-slate-800 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-4">Incident Metadata</h3>
            
            <MetaItem label="Incident Status" value={incident.status} isStatus />
            <MetaItem label="Asset Owner" value="Star Sports Network" />
            <MetaItem label="Licensing Tier" value="Premium Distribution" />
            <MetaItem label="Violation Category" value="Unauthorized Transform" />
            <MetaItem label="Platform URL" value={`/${incident.platform}/${incident.id.split('_').pop()}`} isLink />
            <MetaItem label="Detected Region" value="South East Asia (SEA)" />
            
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Enforcement History</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/5 p-2 rounded-lg border border-rose-400/10">
                  <ShieldAlert className="w-3 h-3" />
                  Account flagged on IG (3d ago)
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/5 p-2 rounded-lg border border-amber-400/10">
                  <Lock className="w-3 h-3" />
                  IP Block active since 2025
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-500 group border border-emerald-500 text-[#0A0A0B] rounded-2xl cursor-pointer transition-all hover:translate-y-[-4px]">
             <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6" />
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </div>
             <h3 className="text-lg font-bold leading-tight mb-2">Estimated Revenue Leakage</h3>
             <p className="text-4xl font-black mb-2 tracking-tighter">$14,285</p>
             <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Based on projected ad-reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value, isLink, isStatus }: { label: string, value: string, isLink?: boolean, isStatus?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{label}</p>
      <div className={cn(
        "text-sm font-medium",
        isLink ? "text-emerald-400 flex items-center gap-1 cursor-pointer hover:underline" : "text-white"
      )}>
        {isStatus ? (
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
            value === 'Sent' || value === 'Resolved' ? "bg-emerald-500 text-[#0A0A0B]" :
            value === 'flagged' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
            "bg-slate-800 text-slate-300"
          )}>
            {value}
          </span>
        ) : (
          <>
            {value}
            {isLink && <ExternalLink className="w-3 h-3" />}
          </>
        )}
      </div>
    </div>
  );
}
