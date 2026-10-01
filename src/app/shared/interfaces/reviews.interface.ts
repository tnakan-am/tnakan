export interface Review {
  id: string;
  comment: string;
  stars: number;
  userId: string;
  userPhoto: string | null;
  userName: string;
}
