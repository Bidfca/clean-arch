import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";
import type {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";
import type { TokenGenerator } from "@/data/contracts/crypto";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  // This service should only handle orchestration and delegation.
  // The logic for creating or updating a user account should be moved to a domain model.
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });

      // Instead of instantiating FacebookAccount directly here, we should inject it.
      // This makes testing easier: we can use a test double for the dependency,
      // whereas mocking an internally instantiated class requires mocking a whole module.
      // Also, by testing FacebookAccount separately, we avoid duplicating tests.
      // Here, we only need to verify that FacebookAccount is called with the correct parameters.
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount);
      await this.crypto.generateToken({ key: id });
    }
    return new AuthenticationError();
  }
}

// This model is too generic and doesn't satisfy the contract required by the saveWithFacebook interface.
// class UserAccount {
//   id?: string;
//   name?: string;
//   email: string;
//   facebookId?: string;

//   constructor(model: { id?: string; name?: string; email: string }) {
//     this.id = model.id;
//     this.name = model.name;
//     this.email = model.email;
//   }

//   updateWithFacebook(model: {
//     name: string;
//     email: string;
//     facebookId: string;
//   }) {
//     this.name = model.name;
//     this.facebookId = model.facebookId;
//     this.name ??= model.name;
//   }
// }
