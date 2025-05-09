import { AxiosHttpClient } from "@/infra/http";

import axios from "axios";

jest.mock("axios");

describe("AxiosHttpClient", () => {
  let sut: AxiosHttpClient;
  let url: string;
  let params: object;
  // Convert all methods of the axios object into typed Jest mocks (using jest.fn internally)
  let fakeAxios: jest.Mocked<typeof axios>;

  beforeAll(() => {
    url = "any_url";
    params = {
      any: "any",
    };
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({
      data: "any_data",
      config: {
        url: "any_url",
      },
      headers: {},
      status: 200,
      statusText: "OK",
    });
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

    it("should return data on success", async () => {
      const result = await sut.get({ url, params });

      expect(result).toEqual("any_data");
    });

    it("should rethrow if get throws", async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error("http_error"));
      const promise = sut.get({ url, params });

      await expect(promise).rejects.toThrow(new Error("http_error"));
    });
  });
});
