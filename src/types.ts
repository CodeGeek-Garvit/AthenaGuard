export type TransformationType = 
  | 'original'
  | 'cropped'
  | 'mirrored'
  | 'meme_overlay'
  | 'filter'
  | 'compressed'
  | 'watermark_removed';

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  fingerprint: string;
  createdAt: Date;
  status: 'active' | 'archived';
  violationCount: number;
}

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type RecommendedAction = 'Auto DMCA' | 'Manual Review' | 'Ignore' | 'Safe';

export type SystemMode = 'monitoring' | 'verification';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'Admin' | 'Analyst';
  createdAt: Date;
}

export type IncidentStatus = 'pending' | 'flagged' | 'dismissed' | 'Generated' | 'Sent' | 'Under Review' | 'Resolved';

export interface ViolationIncident {
  id: string;
  originalAssetId: string;
  detectedUrl: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'manual_upload';
  transformation: TransformationType[];
  similarityScore: number; // 0 to 1
  confidence: ConfidenceLevel;
  recommendedAction: RecommendedAction;
  detectedAt: Date;
  posterAccount: string;
  location?: string;
  status: IncidentStatus;
  aiExplanation?: string;
  evolutionChain: EvolutionNode[];
}

export interface EvolutionNode {
  id: string;
  parentId: string | null;
  url: string;
  timestamp: Date;
  transformation: TransformationType;
  description: string;
}

export interface PlatformStats {
  platform: string;
  count: number;
  revenueLoss: number;
}
