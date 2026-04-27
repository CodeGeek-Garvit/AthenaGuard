import { MediaAsset, ViolationIncident, EvolutionNode, TransformationType } from '../types';
import { explainViolation } from '../lib/gemini';

const SAMPLE_ASSETS: MediaAsset[] = [
  {
    id: '1',
    title: 'IPL Final Winning Moment',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
    type: 'image',
    fingerprint: 'fp_cc_001',
    createdAt: new Date(Date.now() - 86400000),
    status: 'active',
    violationCount: 12
  },
  {
    id: '2',
    title: 'Nadal 100th Win Clip',
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
    type: 'video',
    fingerprint: 'fp_cc_002',
    createdAt: new Date(Date.now() - 172800000),
    status: 'active',
    violationCount: 45
  }
];

class DetectionService {
  private incidents: ViolationIncident[] = [];
  private assets: MediaAsset[] = [...SAMPLE_ASSETS];
  private updateCallbacks: Set<(incidents: ViolationIncident[]) => void> = new Set();
  private notificationCallbacks: Set<(notification: { text: string; time: Date }) => void> = new Set();

  constructor() {
    // Generate initial mock incidents
    this.incidents = this.generateMockIncidents();
    
    // Start simulation loop
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.addNewIncident();
      }
    }, 10000); // New incident every 10 seconds (30% chance)
  }

  public onNotification(callback: (notification: { text: string; time: Date }) => void) {
    this.notificationCallbacks.add(callback);
    return () => this.notificationCallbacks.delete(callback);
  }

  public addNotification(text: string) {
    const notification = { text, time: new Date() };
    this.notificationCallbacks.forEach(cb => cb(notification));
  }

  private calculateDecision(score: number): { confidence: ViolationIncident['confidence'], action: ViolationIncident['recommendedAction'] } {
    if (score > 0.90) return { confidence: 'High', action: 'Auto DMCA' };
    if (score >= 0.75) return { confidence: 'Medium', action: 'Manual Review' };
    return { confidence: 'Low', action: 'Ignore' };
  }

  private generateMockIncidents(): ViolationIncident[] {
    const score = 0.92;
    const decision = this.calculateDecision(score);
    return [
      {
        id: 'inc_001',
        originalAssetId: '1',
        detectedUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&h=400&fit=crop',
        platform: 'twitter',
        transformation: ['cropped', 'meme_overlay'],
        similarityScore: score,
        confidence: decision.confidence,
        recommendedAction: decision.action,
        detectedAt: new Date(Date.now() - 3600000),
        posterAccount: '@SportMemeLord',
        status: 'pending',
        evolutionChain: [
          {
            id: 'ev_1',
            parentId: null,
            url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
            timestamp: new Date(Date.now() - 7200000),
            transformation: 'original',
            description: 'Original high-res broadcast capture'
          },
          {
            id: 'ev_2',
            parentId: 'ev_1',
            url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400',
            timestamp: new Date(Date.now() - 5400000),
            transformation: 'compressed',
            description: 'First re-upload on private group'
          }
        ]
      }
    ];
  }

  private async addNewIncident() {
    const asset = SAMPLE_ASSETS[Math.floor(Math.random() * SAMPLE_ASSETS.length)];
    const platforms: ViolationIncident['platform'][] = ['twitter', 'instagram', 'tiktok', 'youtube'];
    const transformations: TransformationType[] = ['cropped', 'mirrored', 'meme_overlay', 'filter'];
    
    const selectedTransforms = transformations.filter(() => Math.random() > 0.5);
    if (selectedTransforms.length === 0) selectedTransforms.push('compressed');

    const score = 0.65 + Math.random() * 0.35; // Random score between 0.65 and 1.0
    const decision = this.calculateDecision(score);

    const newIncident: ViolationIncident = {
      id: `inc_${Math.random().toString(36).substr(2, 9)}`,
      originalAssetId: asset.id,
      detectedUrl: asset.url,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      transformation: selectedTransforms,
      similarityScore: score,
      confidence: decision.confidence,
      recommendedAction: decision.action,
      detectedAt: new Date(),
      posterAccount: `@user_${Math.random().toString(36).substr(2, 5)}`,
      status: 'pending',
      evolutionChain: []
    };

    // Simulate AI Explanation for the new incident
    newIncident.aiExplanation = await explainViolation(asset.url, newIncident.detectedUrl, newIncident.transformation);

    this.incidents = [newIncident, ...this.incidents.slice(0, 49)]; // Keep last 50
    this.notifyUpdate();
  }

  public triggerManualScan() {
    this.addNewIncident();
  }

  public onUpdate(callback: (incidents: ViolationIncident[]) => void) {
    this.updateCallbacks.add(callback);
    callback(this.incidents);
    return () => this.updateCallbacks.delete(callback);
  }

  private notifyUpdate() {
    this.updateCallbacks.forEach(cb => cb(this.incidents));
  }

  public getAssets() {
    return this.assets;
  }

  public addAsset(asset: MediaAsset) {
    this.assets = [asset, ...this.assets];
    // No need for notifyUpdate for assets yet as components re-render or pull on demand, 
    // but maybe we should notify.
    this.notifyUpdate();
  }
  
  public getIncidentById(id: string) {
    return this.incidents.find(inc => inc.id === id);
  }

  public updateIncidentStatus(id: string, status: ViolationIncident['status']) {
    const incident = this.incidents.find(inc => inc.id === id);
    if (incident) {
      incident.status = status;
      this.notifyUpdate();
      
      if (status === 'flagged') {
        this.addNotification(`Takedown approved for incident ${id.split('_').pop()}. Queueing legal notice.`);
      } else if (status === 'dismissed') {
        this.addNotification(`Incident ${id.split('_').pop()} has been dismissed.`);
      }
      
      return true;
    }
    return false;
  }

  public async sendDMCAEmail(incident: ViolationIncident) {
    // Simulate email latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('--- DMCA EMAIL SIMULATED ---');
    console.log(`To: legal@${incident.platform}.com`);
    console.log(`Original Media Ref: ${incident.originalAssetId}`);
    console.log(`Violating Content: ${incident.detectedUrl}`);
    console.log(`Similarity: ${(incident.similarityScore * 100).toFixed(0)}%`);
    console.log(`Transforms: ${incident.transformation.join(', ')}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('--- END EMAIL ---');
    
    this.updateIncidentStatus(incident.id, 'Sent');
    this.addNotification(`DMCA Notice successfully dispatched to ${incident.platform} legal team.`);
    return true;
  }
}

export const detectionService = new DetectionService();
