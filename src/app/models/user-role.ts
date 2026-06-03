export enum UserRole {
  Customer = 'CUSTOMER',
  Seller = 'SELLER',
  Admin = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}
