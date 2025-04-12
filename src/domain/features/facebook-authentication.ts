import type { AccessToken } from "@/domain/models";
import type { AuthenticationError } from "@/domain/errors";

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>;
}

export namespace FacebookAuthentication {
  // We use an object (command pattern) to pass parameters instead of just a plain token.
  // This makes it easier to extend later if more parameters are needed, without breaking the interface.
  export type Params = {
    token: string;
  };

  export type Result = AccessToken | AuthenticationError;
}
