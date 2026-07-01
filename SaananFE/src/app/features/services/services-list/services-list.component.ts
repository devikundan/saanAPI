import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { ServiceResponse } from '@core/models/service.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  readonly services = signal<ServiceResponse[]>([]);

  ngOnInit(): void {
    this.servicesService.getActiveServices().subscribe((response) => {
      if (response.success && response.data) {
        this.services.set(response.data);
      }
    });
  }
}
