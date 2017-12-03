export interface AuthUser {
  id: number;
  partyId: number;
  name: string;
  scopes?: string[];
}
