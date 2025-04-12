// 'LoadUser' is better than 'LoadUserByEmail' because it allows changing the parameters in the future without needing to rename the method.
export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>;
}

// 'LoadUserAccount' is better than 'LoadUser' because breaking down large entities like 'User' into smaller ones like 'UserAccount' improves clarity and separation of concerns.
export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result = undefined;
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params
  ) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string;
    name: string;
    facebookId: string;
  };
}
