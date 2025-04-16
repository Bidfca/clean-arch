import type { HttpGetClient } from "@/infra/http";

import axios from "axios";

jest.mock("axios");

// Adapter
class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, {
      params: args.params,
    });
  }
}

describe("AxiosHttpClient", () => {
  let sut: AxiosHttpClient;
  let url: string;
  let params: object;
  let fakeAxios: jest.Mocked<typeof axios>;

  beforeAll(() => {
    url = "any_url";
    params = {
      any: "any",
    };
    fakeAxios = axios as jest.Mocked<typeof axios>;
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe("get", () => {
    it("should call get with correct params", async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
