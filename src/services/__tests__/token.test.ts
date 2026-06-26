import * as SecureStore from "expo-secure-store";
import { saveToken, getToken, clearToken } from "../token";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockSet = SecureStore.setItemAsync as jest.Mock;
const mockGet = SecureStore.getItemAsync as jest.Mock;
const mockDelete = SecureStore.deleteItemAsync as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const KEY = "campus-quest.token";

describe("saveToken", () => {
  it("chama setItemAsync com a chave e o token", async () => {
    mockSet.mockResolvedValueOnce(undefined);
    await saveToken("abc123");
    expect(mockSet).toHaveBeenCalledWith(KEY, "abc123");
  });
});

describe("getToken", () => {
  it("chama getItemAsync com a chave correta", async () => {
    mockGet.mockResolvedValueOnce("abc123");
    const result = await getToken();
    expect(mockGet).toHaveBeenCalledWith(KEY);
    expect(result).toBe("abc123");
  });
});

describe("clearToken", () => {
  it("chama deleteItemAsync com a chave correta", async () => {
    mockDelete.mockResolvedValueOnce(undefined);
    await clearToken();
    expect(mockDelete).toHaveBeenCalledWith(KEY);
  });
});
