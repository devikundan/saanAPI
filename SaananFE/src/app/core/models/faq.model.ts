export interface FaqResponse {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
