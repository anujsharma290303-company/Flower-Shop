export interface SiteConfig {
  id: number;
  heroTitle: string;
  heroSubTitle: string;
  heroCTA1: string;
  heroCTA2: string;
  heroImage: string | null;
  flowerMeTitle?: string;
  flowerMeDescription?: string;
  flowerMeVideoUrl?: string | null;
  flowerMeThumbnailUrl?: string | null;
  customBouquetsHeading?: string;
  recipientsChoiceImage?: string | null;
  sendersChoiceImage?: string | null;
  howItWorks: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  benefitsData: Array<{
    title: string;
    icon: string;
    points: string[];
  }>;
  contactEmail: string;
  contactPhone: string;
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
