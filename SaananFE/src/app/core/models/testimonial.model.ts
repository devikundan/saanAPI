export interface TestimonialResponse {
  id: string;
  clientName: string;
  clientTitle: string | null;
  clientImageUrl: string | null;
  content: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
