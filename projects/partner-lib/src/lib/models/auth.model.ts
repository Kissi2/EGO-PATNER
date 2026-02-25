export interface LoginResponse {
  token?: string;
  access_token?: string;
  authToken?: string;
  [key: string]: unknown;
}

export interface Partenaire {
  id?: string | number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string;
  joinDate?: string;
  status?: string;
  [key: string]: unknown;
}
