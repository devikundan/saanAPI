import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminLeadsService, LEAD_STATUSES, UpdateLeadStatusRequest } from './admin-leads.service';
import { LeadResponse } from '@core/models/lead.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-leads',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './manage-leads.component.html',
  styleUrl: './manage-leads.component.scss'
})
export class ManageLeadsComponent implements OnInit {
  private readonly service = inject(AdminLeadsService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly statuses = LEAD_STATUSES;
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<LeadResponse> | null>(null);
  readonly selectedLead = signal<LeadResponse | null>(null);

  statusForm: FormGroup = this.fb.group({ status: [0], adminNotes: [''] });

  ngOnInit(): void { this.loadPage(1); }

  loadPage(page: number): void {
    this.currentPage.set(page);
    this.isLoading.set(true);
    this.service.getAll(page).subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.data.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }

  viewLead(item: LeadResponse): void {
    this.selectedLead.set(item);
    const statusIdx = this.statuses.indexOf(item.status as typeof LEAD_STATUSES[number]);
    this.statusForm.patchValue({ status: statusIdx >= 0 ? statusIdx : 0, adminNotes: item.adminNotes || '' });
  }

  updateStatus(): void {
    const lead = this.selectedLead();
    if (!lead) return;
    this.isSaving.set(true);
    const req: UpdateLeadStatusRequest = { status: Number(this.statusForm.value.status), adminNotes: this.statusForm.value.adminNotes || null };
    this.service.updateStatus(lead.id, req).subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Status updated!'); this.selectedLead.set(null); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Update failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this lead?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
