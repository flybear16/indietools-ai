export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  categoryId: string;
  pricingModel: 'free' | 'freemium' | 'paid' | 'open_source';
  startingPrice?: number;
  hasFreeTier: boolean;
  hasOpenSource: boolean;
  hasApi: boolean;
  techStack: string[];
  integrations: string[];
  affiliateUrl?: string;
  affiliateEnabled: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  phase: Phase;
  icon: string;
  sortOrder: number;
  createdAt: Date;
}

export type Phase = 
  | 'ideation' 
  | 'building' 
  | 'design' 
  | 'launch' 
  | 'growth' 
  | 'monetization';

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: number;
  reviewText?: string;
  useCase?: string;
  wouldRecommend: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'user' | 'pro' | 'team' | 'admin';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  subscriptionExpiresAt?: Date;
  createdAt: Date;
}

export interface ToolWithCategory extends Tool {
  category: Category;
}

export interface ToolWithReviews extends Tool {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export type PricingModel = {
  label: string;
  value: 'free' | 'freemium' | 'paid' | 'open_source';
  description: string;
};

export const PRICING_MODELS: PricingModel[] = [
  { label: 'Free', value: 'free', description: 'Completely free to use' },
  { label: 'Freemium', value: 'freemium', description: 'Free tier with paid upgrades' },
  { label: 'Paid', value: 'paid', description: 'Paid subscription required' },
  { label: 'Open Source', value: 'open_source', description: 'Free and open source' },
];

export const PHASES: { label: string; value: Phase; description: string; icon: string }[] = [
  {
    label: 'Ideation',
    value: 'ideation',
    description: 'Research, validate, and plan your idea',
    icon: 'Lightbulb',
  },
  {
    label: 'Building',
    value: 'building',
    description: 'Develop your product with AI assistance',
    icon: 'Code',
  },
  {
    label: 'Design',
    value: 'design',
    description: 'Create beautiful UI/UX and branding',
    icon: 'Palette',
  },
  {
    label: 'Launch',
    value: 'launch',
    description: 'Deploy and announce your product',
    icon: 'Rocket',
  },
  {
    label: 'Growth',
    value: 'growth',
    description: 'Market and grow your user base',
    icon: 'TrendingUp',
  },
  {
    label: 'Monetization',
    value: 'monetization',
    description: 'Convert users to paying customers',
    icon: 'DollarSign',
  },
];
