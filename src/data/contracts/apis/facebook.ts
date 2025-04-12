// A concrete class should depend on an interface, not another concrete class (Dependency Inversion Principle).
// For example, using a class like `LoadFacebookUserByTokenApi` directly would violate this principle.
// Also, avoid generic names like `facebookApi` to maintain clarity and follow the Interface Segregation Principle.
export interface LoadFacebookUserApi {
  loadUser: (
    params: LoadFacebookUserApi.Params
  ) => Promise<LoadFacebookUserApi.Result>;
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };

  export type Result =
    | undefined
    | {
        email: string;
        name: string;
        facebookId: string;
      };
}
