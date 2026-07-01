import { Component, inject, OnInit, signal } from '@angular/core';
import { FaqService } from '../faq.service';
import { FaqResponse } from '@core/models/faq.model';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.scss'
})
export class FaqListComponent implements OnInit {
  private readonly faqService = inject(FaqService);
  readonly faqs = signal<FaqResponse[]>([]);
  readonly openId = signal<string | null>(null);

  ngOnInit(): void {
    this.faqService.getActiveFaqs().subscribe((response) => {
      if (response.success && response.data) {
        this.faqs.set(response.data);
      }
    });
  }

  toggle(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }
}
