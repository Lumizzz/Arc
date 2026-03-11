// src/types/index.ts

export interface SiteData {
  settings: {
    logoText: string;
    logoIconUrl: string | null;
    backgroundImage: string | null;
  };
  navLinks: NavLinkItem[];
  hero: HeroData;
  headerCtas: HeaderCtaItem[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

export interface HeroData {
  eyebrowText: string;
  headline: string;
  inputPlaceholder: string;
  ctaButtonText: string;
  videoDemoText: string;
  videoDemoUrl: string;
}

export interface HeaderCtaItem {
  id: string;
  key: string;
  label: string;
  href: string;
  variant: string;
  order: number;
}
