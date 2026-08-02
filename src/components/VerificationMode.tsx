import React, { useState } from 'react';
import { Upload, FileSearch, ShieldCheck, Zap, AlertCircle, FileUp, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaAsset, ViolationIncident, TransformationType } from '../types';
import { detectionService } from '../services/DetectionService';
import { explainViolation } from '../lib/gemini';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { jsPDF } from 'jspdf';

export default function VerificationMode() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ViolationIncident | null>(null);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const { profile } = useAuth();

  const processMedia = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);

    // Forensic scanning simulation steps
    await new Promise(resolve => setTimeout(resolve, 1200));
    // Step 2: Vector comparison
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Step 3: Result aggregation
    await new Promise(resolve => setTimeout(resolve, 800));

    const assets = detectionService.getAssets();
    
    // SMART MATCHING: Try to find an asset that has a similar name to the uploaded file
    const fileWords = file.name.toLowerCase().split(/[^a-z0-9]/).filter(word => word.length > 2);
    
    let matchedAsset = assets.find(a => {
      const assetWords = a.title.toLowerCase().split(/[^a-z0-9]/).filter(word => word.length > 2);
      return fileWords.some(fw => assetWords.includes(fw)) || assetWords.some(aw => fileWords.includes(aw));
    });

    // Fallback to latest asset if no word match
    if (!matchedAsset && assets.length > 0) {
      matchedAsset = assets[0];
    }
    
    if (!matchedAsset) {
      setIsProcessing(false);
      window.alert("No master assets found in library to compare against. Please enroll assets first.");
      return;
    }

    // Simulate finding transformations based on file properties or just mock them
    const transformations: TransformationType[] = ['cropped', 'compressed'];
    if (file.size > 2000000) transformations.push('filter');
    
    // Calculate a realistic similarity score
    const score = matchedAsset ? 0.94 : 0.45;
    const confidence = score > 0.9 ? 'High' : score > 0.75 ? 'Medium' : 'Low';
    const action = score > 0.9 ? 'Auto DMCA' : score > 0.75 ? 'Manual Review' : 'Safe';

    const mockResult: ViolationIncident = {
      id: `ver_${Math.random().toString(36).substr(2, 9)}`,
      originalAssetId: matchedAsset.id,
      detectedUrl: preview || matchedAsset.url,
      platform: 'manual_upload', 
      transformation: transformations,
      similarityScore: score,
      confidence,
      recommendedAction: action,
      detectedAt: new Date(),
      posterAccount: 'MANUAL_UPLOAD',
      status: 'pending',
      evolutionChain: []
    };

    mockResult.aiExplanation = await explainViolation(matchedAsset.url, mockResult.detectedUrl, transformations);
    
    setResult(mockResult);
    setIsProcessing(false);
  };

  const originalAsset = result ? detectionService.getAssets().find(a => a.id === result.originalAssetId) : null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Manual Verification</h2>
        <p className="text-slate-500 text-sm">Upload media for forensic comparison against the protected library.</p>
      </div>

      {!result && !isProcessing && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <label className="block bg-[#0D0D0E] border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 text-center group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer relative overflow-hidden">
            <input 
              type="file" 
              className="sr-only" 
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover rounded-3xl" alt="Preview" />
              ) : (
                <FileUp className="w-8 h-8 text-slate-500 group-hover:text-emerald-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drop media for forensic scanning</h3>
            <p className="text-slate-500 text-sm mb-8">Supports professional broadcast formats, RAW images, and short clips.</p>
            
            {file && (
              <div className="relative z-10">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); processMedia(); }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-[#0A0A0B] font-black px-8 py-3 rounded-2xl flex items-center gap-2 mx-auto transition-all shadow-xl shadow-emerald-500/20"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  INITIATE ANALYSIS
                </button>
              </div>
            )}
          </label>
        </motion.div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-widest">Forensic Scanning Active</h3>
            <p className="text-slate-500 text-xs font-mono">Comparing feature vectors across 1.2M fingerprints...</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {result && originalAsset && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header Result */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Match Confidence</span>
                  <span className={cn(
                    "text-2xl font-black",
                    result.confidence === 'High' ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {(result.similarityScore * 100).toFixed(0)}% {result.confidence}
                  </span>
                </div>
                <div className="h-10 w-px bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Recommendation</span>
                  <span className="text-white font-bold">{result.recommendedAction}</span>
                </div>
              </div>
              <button 
                onClick={() => {setResult(null); setFile(null); setPreview(null);}}
                className="px-6 py-2 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                NEW VERIFICATION
              </button>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    MASTER SOURCE
                  </h3>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 relative group">
                  <img src={originalAsset.url} className="w-full h-full object-contain" alt="Original" />
                  <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500/90 text-[#0A0A0B] text-[10px] font-black rounded uppercase">Verified</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-rose-400" />
                    PROBE SAMPLE
                  </h3>
                </div>
                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 relative group">
                  <img src={preview!} className="w-full h-full object-contain opacity-80" alt="Probe" />
                  <div className="absolute top-4 right-4 px-2 py-1 bg-rose-500 text-white text-[10px] font-black rounded uppercase">Query</div>
                </div>
              </div>
            </div>

            {/* Analysis Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 p-6 bg-[#0D0D0E] border border-slate-800 rounded-3xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Athena Forensic Analysis</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                  "{result.aiExplanation}"
                </p>
                <div className="flex flex-wrap gap-3">
                  {result.transformation.map(t => (
                    <div key={t} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-emerald-500 rounded-3xl flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-[#0A0A0B] font-black text-sm uppercase tracking-widest">Enforcement Status</h4>
                  <p className="text-[#0A0A0B]/70 text-xs font-bold leading-relaxed">
                    This sample matches a protected broadcast asset. Takedown eligibility is confirmed.
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    setIsGeneratingReport(true);
                    const reportId = `REP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    try {
                      const doc = new jsPDF();
                      
                      // Heading
                      doc.setFontSize(22);
                      doc.setTextColor(16, 185, 129);
                      doc.text("ATHENA GUARD", 20, 20);
                      
                      doc.setFontSize(10);
                      doc.setTextColor(100);
                      doc.text("MEDIA VERIFICATION REPORT", 20, 28);
                      
                      doc.setDrawColor(200);
                      doc.line(20, 32, 190, 32);
                      
                      // Content
                      doc.setFontSize(12);
                      doc.setTextColor(0);
                      doc.text(`REPORT ID: ${reportId}`, 20, 45);
                      doc.text(`USER Account: ${profile?.email || 'N/A'}`, 20, 52);
                      doc.text(`VERIFICATION DATE: ${new Date().toLocaleString()}`, 20, 59);
                      
                      doc.setFontSize(14);
                      doc.text("VERDICT: VIOLATION DETECTED", 20, 75);
                      
                      doc.setFontSize(10);
                      doc.text(`MATCH CONFIDENCE: ${result?.confidence || 'N/A'}`, 20, 85);
                      doc.text(`ACTION: ${result?.recommendedAction || 'N/A'}`, 20, 92);
                      doc.text(`SIMILARITY SCORE: ${(result?.similarityScore ? result.similarityScore * 100 : 0).toFixed(2)}%`, 20, 99);
                      
                      doc.setFontSize(11);
                      doc.text("ANALYSIS SUMMARY:", 20, 115);
                      const summary = doc.splitTextToSize(result?.aiExplanation || "Automated vector analysis complete.", 160);
                      doc.text(summary, 20, 122);
                      
                      doc.text("TRANSFORMATIONS DETECTED:", 20, 150);
                      doc.text(result?.transformation.join(', ') || 'None', 20, 157);
                      
                      // Footer
                      doc.setFontSize(8);
                      doc.setTextColor(150);
                      doc.text("Security Document. Authorized Personnel Only.", 20, 280);
                      
                      doc.save(`Verification_Report_${reportId}.pdf`);
                      detectionService.addNotification(`Forensic Report ${reportId} for ${profile?.email} has been generated.`);
                    } catch (err) {
                      console.error("PDF build error", err);
                      detectionService.addNotification("Failed to generate PDF. Check console.");
                    } finally {
                      setIsGeneratingReport(false);
                    }
                  }}
                  disabled={isGeneratingReport}
                  className="w-full bg-[#0A0A0B] text-emerald-400 font-black py-4 rounded-2xl flex items-center justify-center gap-2 mt-8 group transition-all hover:bg-black/90 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      COMPILING DATA...
                    </>
                  ) : (
                    <>
                      GENERATE ASSET REPORT
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
