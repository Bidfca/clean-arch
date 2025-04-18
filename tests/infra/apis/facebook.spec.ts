import { FacebookApi } from "@/infra/apis";
import type { HttpGetClient } from "@/infra/http";
// Create fully typed and deep mocks when testing complex interfaces or classes
import { mock, type MockProxy } from "jest-mock-extended";

describe("FaceookApi", () => {
  let clientId: string;
  let clientSecret: string;
  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;

  beforeAll(() => {
    clientId = "any_client_id";
    clientSecret = "any_client_secret";
    httpClient = mock();
  });

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({
        access_token: "any_app_token",
      })
      .mockResolvedValueOnce({
        data: {
          user_id: "any_user_id",
        },
      })
      .mockResolvedValueOnce({
        id: "any_fb_id",
        name: "any_fb_name",
        email: "any_fb_email",
      });
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it("should get app token", async () => {
    await sut.loadUser({
      token: "any_client_token",
    });

    expect(httpClient.get).toHaveBeenNthCalledWith(1, {
      url: "https://graph.facebook.com/oauth/access_token",
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      },
    });
  });

  it("should get debug token", async () => {
    await sut.loadUser({
      token: "any_client_token",
    });

    expect(httpClient.get).toHaveBeenNthCalledWith(2, {
      url: "https://graph.facebook.com/debug_token",
      params: {
        access_token: "any_app_token",
        input_token: "any_client_token",
      },
    });
  });

  it("should get user info", async () => {
    await sut.loadUser({
      token: "any_client_token",
    });

    expect(httpClient.get).toHaveBeenNthCalledWith(3, {
      url: "https://graph.facebook.com/any_user_id",
      params: {
        fields: "id,name,email",
        access_token: "any_client_token",
      },
    });
  });

  it("should return facebook user", async () => {
    const fbUser = await sut.loadUser({
      token: "any_client_token",
    });

    expect(fbUser).toEqual({
      facebookId: "any_fb_id",
      name: "any_fb_name",
      email: "any_fb_email",
    });
  });
});
