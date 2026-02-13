export const TOKEN_REPOSITORY_PORT = 'TOKEN_REPOSITORY_PORT';

export interface TokenRepositoryPort {
  validateUser(username: string, password: string): Promise<{ userId: string } | null>;
}