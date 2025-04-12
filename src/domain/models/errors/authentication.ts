export class AuthencationError extends Error {
  constructor() {
    super("Authentication failed");
    this.name = "AuthencationError";
  }
}
