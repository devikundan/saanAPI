export interface CreateContactMessageRequest {
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

export interface ContactMessageConfirmation {
  id: string;
  message: string;
}
