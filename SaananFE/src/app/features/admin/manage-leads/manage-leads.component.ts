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
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Manage Leads</h1>
      </div>

      @if (selectedLead()) {
        <div class="admin-form-panel">
          <h3>Lead: {{ selectedLead()!.fullName }}</h3>
          <div class="lead-detail">
            <p><strong>Email:</strong> {{ selectedLead()!.email }}</p>
            <p><strong>Phone:</strong> {{ selectedLead()!.phone || '—' }}</p>
            <p><strong>Company:</strong> {{ selectedLead()!.company || '—' }}</p>
            <p><strong>Service:</strong> {{ selectedLead()!.serviceTitle || '—' }}</p>
            <p><strong>Message:</strong> {{ selectedLead()!.message }}</p>
            <p><strong>Created:</strong> {{ selectedLead()!.createdAt | date:'medium' }}</p>
          </div>
          <form [formGroup]="statusForm" (ngSubmit)="updateStatus()" class="lead-status-form">
            <div class="form-row">
              <div class="form-group">
                <label>Status</label>
                <select formControlName="status">
                  @for (s of statuses; track s; let i = $index) {
                    <option [value]="i">{{ s }}</option>
                  }
                </select>
              </div>
              <div class="form-group"><label>Admin Notes</label><input formControlName="adminNotes"></div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary" [disabled]="isSaving()">Update Status</button>
              <button type="button" class="btn btn--secondary" (click)="selectedLead.set(null)">Close</button>
            </div>
          </form>
        </div>
      }

      @if (isLoading()) {
        <p class="admin-loading">Loading...</p>
      } @else if (data()) {
        <table class="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of data()!.items; track item.id) {
              <tr>
                <td>{{ item.fullName }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.serviceTitle || '—' }}</td>
                <td><span class="badge badge--status">{{ item.status }}</span></td>
                <td>{{ item.createdAt | date:'short' }}</td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="viewLead(item)">👁️</button>
                  <button class="btn-icon btn-icon--danger" (click)="deleteItem(item.id)">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (data()!.totalPages > 1) {
          <div class="admin-pagination">
            <button [disabled]="!data()!.hasPreviousPage" (click)="loadPage(currentPage() - 1)">← Prev</button>
            <span>Page {{ currentPage() }} of {{ data()!.totalPages }}</span>
            <button [disabled]="!data()!.hasNextPage" (click)="loadPage(currentPage() + 1)">Next →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`@use 'admin-crud'; .lead-detail { margin-bottom: 1rem; p { margin: 0.25rem 0; font-size: 0.875rem; } } .lead-status-form { margin-top: 1rem; }`]
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
