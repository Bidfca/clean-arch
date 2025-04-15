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

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (
    params: SaveFacebookAccountRepository.Params
  ) => Promise<SaveFacebookAccountRepository.Result>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = {
    id: string;
  };
}
