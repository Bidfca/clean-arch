import type { AccessToken } from "@/domain/models";
import type { AuthencationError } from "@/domain/models/errors";

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>;
}

namespace FacebookAuthentication {
  export type Params = {
    token: string;
  };

  export type Result = AccessToken | AuthencationError;
}
