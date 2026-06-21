export interface ClassifyQueryRequest {
  query: string;
  leadId: string | null;
  contactMessageId: string | null;
}

export interface QueryClassificationResponse {
  id: string;
  originalQuery: string;
  classifiedCategory: string;
  suggestedServiceSlug: string | null;
  confidenceScore: number;
  aiResponse: string | null;
  classifiedAt: string;
}
