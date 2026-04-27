/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Library, 
  Settings, 
  Bell, 
  Search, 
  TrendingUp, 
  AlertTriangle,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  Info,
  LogOut,
  User as UserIcon,
  Upload,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { detectionService } from './services/DetectionService';
import { MediaAsset, ViolationIncident, SystemMode } from './types';
import { useAuth } from './lib/AuthContext';

// Components
import DashboardView from './components/DashboardView';
import MonitoringFeed from './components/MonitoringFeed';
import AssetLibrary from './components/AssetLibrary';
import IncidentDetails from './components/IncidentDetails';
import SystemDocs from './components/SystemDocs';
import LoginView from './components/LoginView';
import VerificationMode from './components/VerificationMode';

export default function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monitoring' | 'library' | 'docs' | 'verification'>('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<ViolationIncident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, text: string, time: Date}[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const unsubIncidents = detectionService.onUpdate((data) => {
      setIncidents(data);
    });
    
    const unsubNotifications = detectionService.onNotification((notification) => {
      setNotifications(prev => [{ id: Math.random().toString(), ...notification }, ...prev]);
    });

    return () => {
      unsubIncidents();
      unsubNotifications();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = !searchQuery || 
      i.posterAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In monitoring feed, hide dismissed incidents but show flagged/pending
    if (activeTab === 'monitoring') {
      return matchesSearch && i.status !== 'dismissed';
    }
    return matchesSearch;
  });

  const pendingCount = incidents.filter(i => i.status === 'pending').length;

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col items-center py-8 gap-8 bg-[#0D0D0E]">
        <div className="flex items-center gap-3 px-6 w-full">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">ATHENA<span className="text-emerald-400">GUARD</span></h1>
        </div>

        <nav className="flex-1 w-full px-4 flex flex-col gap-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard' && !selectedIncidentId} 
            onClick={() => { setActiveTab('dashboard'); setSelectedIncidentId(null); }} 
          />
          <SidebarItem 
            icon={Activity} 
            label="Monitoring Feed" 
            badge={pendingCount > 0 ? pendingCount : undefined}
            active={activeTab === 'monitoring' && !selectedIncidentId} 
            onClick={() => { setActiveTab('monitoring'); setSelectedIncidentId(null); }} 
          />
          <SidebarItem 
            icon={Zap} 
            label="Verification Hub" 
            active={activeTab === 'verification' && !selectedIncidentId} 
            onClick={() => { setActiveTab('verification'); setSelectedIncidentId(null); }} 
          />
          <SidebarItem 
            icon={Library} 
            label="Media Library" 
            active={activeTab === 'library' && !selectedIncidentId} 
            onClick={() => { setActiveTab('library'); setSelectedIncidentId(null); }} 
          />
          <SidebarItem 
            icon={FileText} 
            label="System & Compliance" 
            active={activeTab === 'docs' && !selectedIncidentId} 
            onClick={() => { setActiveTab('docs'); setSelectedIncidentId(null); }} 
          />
        </nav>

        <div className="px-6 w-full mt-auto space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-400">REAL-TIME ACTIVE</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
              Scanning 1.2M streams across 8 platforms
            </p>
          </div>
          
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            SIGN OUT SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Simulation Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Simulation Mode: Real-time ingestion prototype</span>
          </div>
          <div className="text-[10px] text-amber-500/60 font-medium">
            Designed for platform API integration.
          </div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-[#0A0A0B]/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="text-slate-200 capitalize">
                {selectedIncidentId ? 'Incident Detail' : activeTab === 'dashboard' ? 'Overview' : activeTab.replace('monitoring', 'Monitoring').replace('verification', 'Verification')}
              </span>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 ml-4">
              <button 
                onClick={() => setActiveTab('monitoring')}
                className={cn(
                  "px-3 py-1 text-[10px] uppercase font-black rounded-lg transition-all",
                  activeTab === 'monitoring' ? "bg-emerald-500 text-[#0A0A0B]" : "text-slate-500 hover:text-white"
                )}
              >
                Monitoring
              </button>
              <button 
                onClick={() => setActiveTab('verification')}
                className={cn(
                  "px-3 py-1 text-[10px] uppercase font-black rounded-lg transition-all",
                  activeTab === 'verification' ? "bg-emerald-500 text-[#0A0A0B]" : "text-slate-500 hover:text-white"
                )}
              >
                Verification
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forensic data..."
                className="bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-white"
              />
            </div>
            
            {/* Notification Center */}
            <div className="relative">
              <button 
                className={cn(
                  "p-2 text-slate-400 hover:text-white transition-colors relative",
                  showNotifications && "text-emerald-400 bg-white/5 rounded-xl"
                )}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#0A0A0B]" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-[#0D0D0E] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-white">Security Alerts</span>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => setNotifications([])}
                            className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 uppercase"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">No active alerts found.</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                              <div className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <div className="space-y-1">
                                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{n.text}</p>
                                  <p className="text-[10px] text-slate-500 font-mono italic">
                                    {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-800" />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/5 p-1 px-2 rounded-xl transition-all"
              >
                <div className="text-right hidden md:block">
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">{profile?.email.split('@')[0] || 'User'}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{profile?.role || 'Staff'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {profile?.email.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-[#0D0D0E] border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 mb-2 border-b border-slate-800">
                        <p className="text-xs font-bold text-white truncate">{profile?.email}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Session Active • Asia/Kolkata</p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setShowSettingsModal(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        Account Settings
                      </button>
                      <button 
                        onClick={() => {
                          detectionService.addNotification("Elevation request submitted. Approval pending.");
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Request Elevation
                      </button>
                      
                      <div className="my-1 h-px bg-slate-800" />
                      
                      <button 
                        onClick={signOut}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out Session
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Transition */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {selectedIncidentId ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <IncidentDetails 
                  incident={incidents.find(i => i.id === selectedIncidentId)!} 
                  onBack={() => setSelectedIncidentId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'dashboard' && <DashboardView incidents={incidents} />}
                {activeTab === 'monitoring' && (
                  <MonitoringFeed 
                    incidents={filteredIncidents} 
                    onViewDetails={setSelectedIncidentId} 
                  />
                )}
                {activeTab === 'verification' && <VerificationMode />}
                {activeTab === 'library' && <AssetLibrary />}
                {activeTab === 'docs' && <SystemDocs />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      {/* Account Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSettingsModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0D0E] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight uppercase">Account Infrastructure</h3>
                  <button onClick={() => setShowSettingsModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <XCircle className="w-6 h-6 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Identity</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                        {profile?.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{profile?.email}</p>
                        <p className="text-xs text-slate-500 tracking-tighter">System Administrator • Role: {profile?.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Data</p>
                      <p className="text-sm font-bold text-white">Active</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MFA Status</p>
                      <p className="text-sm font-bold text-emerald-400">ENABLED</p>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 space-y-2">
                    <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest">Critical Actions</p>
                    <button className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors">Terminate all active forensic sessions</button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full bg-emerald-500 text-[#0A0A0B] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  badge?: number
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative",
        active 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "text-emerald-400" : "group-hover:text-slate-200")} />
      <span>{label}</span>
      {badge !== undefined && (
        <span className="ml-auto px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          {badge}
        </span>
      )}
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-4 bg-emerald-400 rounded-r-full"
        />
      )}
    </button>
  );
}

