export class AccessToken {
  constructor(private readonly value: string) {}

  static get expiresInMs(): number {
    return 30 * 60 * 1000;
  }
}
