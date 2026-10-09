export type TpMarkdownMultiPagesTheme = 'light' | 'dark' | 'auto';

export interface TpMarkdownMultiPagesPageLink {
  title: string;
  href: string;
  level: number;
}

export interface TpMarkdownMultiPagesSearchResult {
  title: string;
  href: string;
  excerpt: string;
}
