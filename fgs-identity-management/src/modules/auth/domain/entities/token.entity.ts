export class Token {
  constructor(
    public readonly accessToken: string,
    public readonly expiresIn: number,
  ) {}
}