export interface CreateLeadRequest {
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceId: string | null;
  message: string;
}

export interface LeadConfirmation {
  id: string;
  message: string;
}

export interface LeadResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceId: string | null;
  serviceTitle: string | null;
  message: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
