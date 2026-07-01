export interface PortfolioResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  clientName: string | null;
  projectUrl: string | null;
  thumbnailUrl: string | null;
  technologies: string | null;
  completedAt: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
