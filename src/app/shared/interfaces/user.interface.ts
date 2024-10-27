export interface IUser {
  email: string;
  displayName: string;
  phoneNumber: string;
  uid: string;
  password?: string;
  name?: string;
  type?: 'customer' | 'business';
  surname?: string;
  image?: string;
}
