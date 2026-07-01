import { Component, inject, OnInit, signal } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { DashboardSummary, LeadsByStatus, LeadsByService, MonthlyLeadTrend } from '@core/models/analytics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1 class="dashboard__title">Dashboard</h1>

      @if (isLoading()) {
        <div class="dashboard__loading">Loading analytics...</div>
      } @else if (summary()) {
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-card__value">{{ summary()!.totalLeads }}</span>
            <span class="kpi-card__label">Total Leads</span>
          </div>
          <div class="kpi-card kpi-card--highlight">
            <span class="kpi-card__value">{{ summary()!.newLeadsToday }}</span>
            <span class="kpi-card__label">New Today</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-card__value">{{ summary()!.newLeadsThisWeek }}</span>
            <span class="kpi-card__label">This Week</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-card__value">{{ summary()!.newLeadsThisMonth }}</span>
            <span class="kpi-card__label">This Month</span>
          </div>
        </div>

        <!-- Secondary KPIs -->
        <div class="kpi-grid kpi-grid--secondary">
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.totalContactMessages }}</span>
            <span class="kpi-card__label">Contact Messages</span>
          </div>
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.unreadContactMessages }}</span>
            <span class="kpi-card__label">Unread Messages</span>
          </div>
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.totalNewsletterSubscribers }}</span>
            <span class="kpi-card__label">Subscribers</span>
          </div>
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.activeServices }}</span>
            <span class="kpi-card__label">Active Services</span>
          </div>
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.publishedBlogs }}</span>
            <span class="kpi-card__label">Published Blogs</span>
          </div>
          <div class="kpi-card kpi-card--small">
            <span class="kpi-card__value">{{ summary()!.activePortfolioProjects }}</span>
            <span class="kpi-card__label">Portfolio Projects</span>
          </div>
        </div>

        <!-- Charts section -->
        <div class="charts-grid">
          <!-- Monthly Lead Trend -->
          <div class="chart-panel">
            <h3 class="chart-panel__title">Monthly Lead Trend</h3>
            <div class="bar-chart">
              @for (item of summary()!.monthlyLeadTrend; track item.month + item.year) {
                <div class="bar-chart__item">
                  <div class="bar-chart__bar-wrap">
                    <div
                      class="bar-chart__bar"
                      [style.height.%]="getBarHeight(item.count)">
                    </div>
                  </div>
                  <span class="bar-chart__label">{{ item.month.substring(0, 3) }}</span>
                  <span class="bar-chart__value">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Leads by Status -->
          <div class="chart-panel">
            <h3 class="chart-panel__title">Leads by Status</h3>
            <div class="status-list">
              @for (item of summary()!.leadsByStatus; track item.status) {
                <div class="status-list__item">
                  <span class="status-list__status">{{ item.status }}</span>
                  <div class="status-list__bar-wrap">
                    <div
                      class="status-list__bar"
                      [style.width.%]="getStatusWidth(item.count)">
                    </div>
                  </div>
                  <span class="status-list__count">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Leads by Service -->
          <div class="chart-panel">
            <h3 class="chart-panel__title">Leads by Service</h3>
            <div class="status-list">
              @for (item of summary()!.leadsByService; track item.serviceTitle) {
                <div class="status-list__item">
                  <span class="status-list__status">{{ item.serviceTitle }}</span>
                  <div class="status-list__bar-wrap">
                    <div
                      class="status-list__bar status-list__bar--service"
                      [style.width.%]="getServiceWidth(item.count)">
                    </div>
                  </div>
                  <span class="status-list__count">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="dashboard__error">Failed to load dashboard data.</div>
      }
    </div>
  `,
  styles: [`
    .dashboard__title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .dashboard__loading,
    .dashboard__error {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .kpi-grid--secondary {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .kpi-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .kpi-card--highlight {
      border-color: var(--color-primary, #1a56db);
      background: rgba(26, 86, 219, 0.04);
    }

    .kpi-card--small {
      padding: 1rem 0.875rem;
    }

    .kpi-card__value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .kpi-card--small .kpi-card__value {
      font-size: 1.375rem;
    }

    .kpi-card__label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    /* Charts */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .chart-panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
    }

    .chart-panel__title {
      font-size: 0.9375rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #1e293b;
    }

    /* Bar chart */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      height: 160px;
      padding-top: 1rem;
    }

    .bar-chart__item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar-chart__bar-wrap {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar-chart__bar {
      width: 70%;
      max-width: 32px;
      background: var(--color-primary, #1a56db);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      transition: height 0.3s ease;
    }

    .bar-chart__label {
      font-size: 0.6875rem;
      color: #64748b;
      margin-top: 0.375rem;
    }

    .bar-chart__value {
      font-size: 0.6875rem;
      font-weight: 600;
      color: #1e293b;
    }

    /* Status list */
    .status-list__item {
      display: grid;
      grid-template-columns: 100px 1fr 40px;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .status-list__status {
      font-size: 0.8125rem;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-list__bar-wrap {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }

    .status-list__bar {
      height: 100%;
      background: #6366f1;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .status-list__bar--service {
      background: #10b981;
    }

    .status-list__count {
      font-size: 0.8125rem;
      font-weight: 600;
      text-align: right;
      color: #1e293b;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  readonly isLoading = signal(true);
  readonly summary = signal<DashboardSummary | null>(null);

  private maxTrendCount = 1;
  private maxStatusCount = 1;
  private maxServiceCount = 1;

  ngOnInit(): void {
    this.analyticsService.getDashboardSummary().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.summary.set(response.data);
          this.maxTrendCount = Math.max(...response.data.monthlyLeadTrend.map(t => t.count), 1);
          this.maxStatusCount = Math.max(...response.data.leadsByStatus.map(s => s.count), 1);
          this.maxServiceCount = Math.max(...response.data.leadsByService.map(s => s.count), 1);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getBarHeight(count: number): number {
    return (count / this.maxTrendCount) * 100;
  }

  getStatusWidth(count: number): number {
    return (count / this.maxStatusCount) * 100;
  }

  getServiceWidth(count: number): number {
    return (count / this.maxServiceCount) * 100;
  }
}
