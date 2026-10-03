export interface Advertisement {
  id: string;
  userId: string;
  image: string;
  headline: string;
  subheadline: string | null;
  cta: string | null;
  link: string | null;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Fields a business may set; ownership and approval are server-controlled. */
export type AdPayload = Pick<Advertisement, 'image' | 'headline' | 'subheadline' | 'cta' | 'link'>;
