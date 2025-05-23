import { AccessToken } from "@/domain/models";

describe("Access Token", () => {
  it("should create with a value", () => {
    const sut = new AccessToken("any_value");

    expect(sut).toEqual({
      value: "any_value",
    });
  });

  it("should expire in 1800000 ms", () => {
    expect(AccessToken.expiresInMs).toBe(1800000);
  });
});
