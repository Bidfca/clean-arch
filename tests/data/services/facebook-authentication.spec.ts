import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationService } from "@/data/contracts/services";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";

import { mock, type MockProxy } from "jest-mock-extended";

type SutTypes = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
};

// Ensure the code does not break when new dependencies are introduced
const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationService(loadFacebookUserApi);
  return { sut, loadFacebookUserApi };
};

describe("FacebookAuthenticationService", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    await sut.perform({ token: "any_token" });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: "any_token",
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token: "any_token" });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
