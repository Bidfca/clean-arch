import type { LoadFacebookUserApi } from "@/data/contracts/apis";
import type { FacebookAuthentication } from "@/domain/features";
import type {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { AuthenticationError } from "@/domain/errors";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    // This logic is influenced by how different storage systems handle persistence:
    // - In relational databases, the common pattern is: if a record exists, we update it; if it doesn't, we create it.
    // - In MongoDB, this behavior is abstracted into an "upsert" operation, which updates if the document exists or inserts a new one otherwise.
    // - In cache databases (e.g., Redis), we typically need to explicitly provide the ID, as it doesn't auto-generate it.
    // To keep this logic generic and adaptable across different storage types,
    // the service should call a higher-level method like `save`, and let the concrete repository implementation
    // decide whether to create or update based on its specific backend.
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        email: fbData.email,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
