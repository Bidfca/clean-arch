import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationService } from "@/data/services";
import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import type { TokenGenerator } from "@/data/contracts/crypto";

import { mock, type MockProxy } from "jest-mock-extended";
import { AccessToken } from "@/domain/models";

jest.mock("@/domain/models/facebook-account", () => ({
  FacebookAccount: jest.fn().mockImplementation(() => ({
    any: "any",
  })),
}));

describe("FacebookAuthenticationService", () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
  >;
  let crypto: MockProxy<TokenGenerator>;
  let sut: FacebookAuthenticationService;
  const token = "any_token";

  beforeEach(() => {
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: "any_fb_name",
      email: "any_fb_email",
      facebookId: "any_fb_id",
    });
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: "any_account_id",
    });
    crypto = mock();
    crypto.generateToken.mockResolvedValue("any_generated_token");
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    );
  });

  it("should call LoadFacebookUserApi with correct params", async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it("should call LoadUserAccountRepository when LoadFacebookUserApi returns data", async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: "any_fb_email",
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it("should call SaveFacebookAccountRepository with FacebookAccount", async () => {
    await sut.perform({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: "any",
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it("should call TokenGenerator with correct params", async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expiresInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it("should return an AccessToken on success", async () => {
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });

  it("should rethrow if LoadFacebookUserApi throws", async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("fb_error"));
  });

  it("should rethrow if LoadUserAccountRepository throws", async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error("load_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("load_error"));
  });

  it("should rethrow if SaveUserAccountRepository throws", async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error("save_error")
    );

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("save_error"));
  });

  it("should rethrow if TokenGenerator throws", async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error("token_error"));

    const promise = sut.perform({ token });

    await expect(promise).rejects.toThrow(new Error("token_error"));
  });
});
