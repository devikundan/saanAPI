export interface NewsletterSubscribeRequest {
  email: string;
  name: string | null;
}

export interface NewsletterConfirmation {
  message: string;
}
