export interface Feedback {
  id: number;
  customerName: string;
  customerEmail: string;
  message: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackInput {
  customerName: string;
  customerEmail: string;
  message: string;
  rating: number;
}
