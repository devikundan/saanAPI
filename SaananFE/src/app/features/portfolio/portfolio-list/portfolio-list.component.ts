import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortfolioService } from '../portfolio.service';
import { PortfolioResponse } from '@core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './portfolio-list.component.html',
  styleUrl: './portfolio-list.component.scss'
})
export class PortfolioListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  readonly projects = signal<PortfolioResponse[]>([]);

  ngOnInit(): void {
    this.portfolioService.getActiveProjects().subscribe((response) => {
      if (response.success && response.data) {
        this.projects.set(response.data);
      }
    });
  }
}
