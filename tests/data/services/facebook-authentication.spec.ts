import type { FacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(params: FacebookAuthentication.Params) {
    await this.loadFacebookUserApi.loadUserByToken(params);
  }
}

// A concrete class should depend on an interface, not another concrete class (Dependency Inversion Principle).
// For example, using a class like `LoadFacebookUserByTokenApi` directly would violate this principle.
// Also, avoid generic names like `facebookApi` to maintain clarity and follow the Interface Segregation Principle.
interface LoadFacebookUserApi {
  loadUserByToken: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  async loadUserByToken(params: LoadFacebookUserApi.Params): Promise<void> {
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
});
