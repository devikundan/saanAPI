import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { ServiceResponse } from '@core/models/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly servicesService = inject(ServicesService);

  readonly service = signal<ServiceResponse | null>(null);
  readonly notFound = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.servicesService.getBySlug(slug).subscribe((response) => {
        if (response.success && response.data) {
          this.service.set(response.data);
        } else {
          this.notFound.set(true);
        }
      });
    }
  }
}
