export interface DashboardSummary {
  totalLeads: number;
  newLeadsToday: number;
  newLeadsThisWeek: number;
  newLeadsThisMonth: number;
  totalContactMessages: number;
  unreadContactMessages: number;
  totalNewsletterSubscribers: number;
  activeServices: number;
  publishedBlogs: number;
  activePortfolioProjects: number;
  leadsByStatus: LeadsByStatus[];
  leadsByService: LeadsByService[];
  monthlyLeadTrend: MonthlyLeadTrend[];
}

export interface LeadsByStatus {
  status: string;
  count: number;
}

export interface LeadsByService {
  serviceTitle: string;
  count: number;
}

export interface MonthlyLeadTrend {
  month: string;
  year: number;
  count: number;
}
