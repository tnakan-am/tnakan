export interface IUser {
  email: string;
  displayName: string;
  phoneNumber: string;
  uid: string;
  password?: string;
  type?: 'customer' | 'business';
  surname?: string;
}
