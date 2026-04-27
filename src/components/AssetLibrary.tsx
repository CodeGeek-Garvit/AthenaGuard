import React from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  MoreVertical, 
  Clock, 
  ShieldCheck,
  Video,
  Image as ImageIcon,
  FileUp
} from 'lucide-react';
import { detectionService } from '../services/DetectionService';
import { cn } from '../lib/utils';

export default function AssetLibrary() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [, setUpdateTrigger] = React.useState(0);
  const assets = detectionService.getAssets();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate forensic fingerprinting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAsset: any = {
      id: `asset_${Math.random().toString(36).substr(2, 9)}`,
      title: file.name.split('.')[0].replace(/_/g, ' ').toUpperCase(),
      url: URL.createObjectURL(file), 
      type: file.type.startsWith('video') ? 'video' : 'image',
      fingerprint: `ATHEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date(),
      status: 'active',
      violationCount: 0
    };

    detectionService.addAsset(newAsset);
    setUpdateTrigger(prev => prev + 1); // Force re-render
    setIsUploading(false);
  };

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.fingerprint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Media Master Library</h2>
          <p className="text-slate-500 text-sm">Manage source assets and fingerprinting status.</p>
        </div>
        
        <label className="bg-emerald-500 hover:bg-emerald-600 text-[#0A0A0B] text-xs font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer group">
          <input 
            type="file" 
            className="sr-only" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          )}
          ENROLL NEW ASSET
        </label>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-slate-800">
        <div className="flex-1 relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fingerprints or asset names..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
          />
        </div>
        <div className="flex border border-slate-800 rounded-xl overflow-hidden p-1">
          <button className="p-1.5 bg-slate-800 text-white rounded-lg"><Grid className="w-4 h-4" /></button>
          <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><List className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Upload Placeholder */}
        <label className="border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-slate-500 hover:text-emerald-400 group cursor-pointer relative overflow-hidden">
          <input 
            type="file" 
            className="sr-only" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
             {isUploading ? (
               <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
             ) : (
               <FileUp className="w-6 h-6" />
             )}
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">{isUploading ? 'Registering...' : 'Upload Source'}</p>
            <p className="text-[10px] uppercase tracking-wider font-medium opacity-60">MP4, MOV, JPG, PNG</p>
          </div>
        </label>

        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-[#0D0D0E] border border-slate-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl hover:shadow-emerald-500/5">
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              <img src={asset.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={asset.title} />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                {asset.type === 'video' ? <Video className="w-3 h-3 text-emerald-400" /> : <ImageIcon className="w-3 h-3 text-sky-400" />}
                {asset.type}
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="p-2 bg-emerald-500 text-[#0A0A0B] rounded-xl shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                 </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-white truncate pr-4">{asset.title}</h4>
                <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Enrolled 2 days ago</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">VIOLATIONS</p>
                  <p className="text-sm font-black text-emerald-400">{asset.violationCount}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter text-right">STATUS</p>
                  <p className="text-[10px] font-black text-white px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded uppercase tracking-widest">Active</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
