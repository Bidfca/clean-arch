import type { FacebookAuthentication } from "@/domain/features";
import { AuthenticationError } from "@/domain/errors";

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUserByToken(params);
    return new AuthenticationError();
  }
}

// A concrete class should depend on an interface, not another concrete class (Dependency Inversion Principle).
// For example, using a class like `LoadFacebookUserByTokenApi` directly would violate this principle.
// Also, avoid generic names like `facebookApi` to maintain clarity and follow the Interface Segregation Principle.
interface LoadFacebookUserApi {
  loadUserByToken: (
    params: LoadFacebookUserApi.Params
  ) => Promise<LoadFacebookUserApi.Result>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };

  export type Result = undefined;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;

  async loadUserByToken(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
  }
}

describe("FacebookAuthenticationService", () => {
  it("should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform({ token: "any_token" });

    expect(loadFacebookUserApi.token).toBe("any_token");
  });

  it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    loadFacebookUserApi.result = undefined;
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({ token: "any_token" });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
