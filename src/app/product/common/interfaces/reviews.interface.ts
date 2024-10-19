export interface Reviews {
  id: string;
  reviews_list: Review[];
}

export interface Review {
  id: string;
  description: string;
  rating: number;
  reviewer_Id: string;
  reviewer_info: string;
  reviewer_logo: string;
}
