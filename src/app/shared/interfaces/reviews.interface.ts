export interface Reviews {
  id: string;
  reviews_list: Review[];
}

export interface Review {
  id: string;
  description: string;
  rating: number;
  reviewerId: string;
  reviewerInfo: string;
  reviewerLogo: string;
}
