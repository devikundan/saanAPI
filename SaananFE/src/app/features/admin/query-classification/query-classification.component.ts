import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminQueryClassificationService } from './admin-query-classification.service';
import { QueryClassificationResponse } from '@core/models/query-classification.model';

@Component({
  selector: 'app-query-classification',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './query-classification.component.html',
  styleUrl: './query-classification.component.scss'
})
export class QueryClassificationComponent implements OnInit {
  private readonly service = inject(AdminQueryClassificationService);

  readonly isLoading = signal(true);
  readonly items = signal<QueryClassificationResponse[]>([]);

  ngOnInit(): void {
    this.service.getRecent(50).subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.items.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }
}
