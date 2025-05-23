export enum UserType {
  Admin = 'Admin',
  Basic = 'Basic',
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: UserType;
}
