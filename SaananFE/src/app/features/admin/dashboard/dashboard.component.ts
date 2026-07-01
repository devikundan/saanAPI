import { Component, inject, OnInit, signal } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { DashboardSummary, LeadsByStatus, LeadsByService, MonthlyLeadTrend } from '@core/models/analytics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
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
