import AsyncStorage from "@react-native-async-storage/async-storage";
import { readCache, writeCache, clearCache } from "../cache";

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;
const mockRemove = AsyncStorage.removeItem as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("readCache", () => {
  it("retorna dado deserializado quando existe no storage", async () => {
    mockGet.mockResolvedValueOnce('{"foo":1}');
    const result = await readCache("mykey");
    expect(result).toEqual({ foo: 1 });
  });

  it("retorna null quando item não existe", async () => {
    mockGet.mockResolvedValueOnce(null);
    const result = await readCache("mykey");
    expect(result).toBeNull();
  });

  it("retorna null quando AsyncStorage lança erro", async () => {
    mockGet.mockRejectedValueOnce(new Error("disk full"));
    const result = await readCache("mykey");
    expect(result).toBeNull();
  });

  it("usa o prefixo na chave", async () => {
    mockGet.mockResolvedValueOnce(null);
    await readCache("mykey");
    expect(mockGet).toHaveBeenCalledWith("campus-quest.cache.mykey");
  });
});

describe("writeCache", () => {
  it("chama setItem com chave prefixada e valor serializado", async () => {
    mockSet.mockResolvedValueOnce(undefined);
    await writeCache("mykey", { bar: 2 });
    expect(mockSet).toHaveBeenCalledWith("campus-quest.cache.mykey", '{"bar":2}');
  });

  it("não lança quando AsyncStorage falha", async () => {
    mockSet.mockRejectedValueOnce(new Error("disk full"));
    await expect(writeCache("mykey", {})).resolves.toBeUndefined();
  });
});

describe("clearCache", () => {
  it("chama removeItem com chave prefixada", async () => {
    mockRemove.mockResolvedValueOnce(undefined);
    await clearCache("mykey");
    expect(mockRemove).toHaveBeenCalledWith("campus-quest.cache.mykey");
  });

  it("não lança quando AsyncStorage falha", async () => {
    mockRemove.mockRejectedValueOnce(new Error("disk full"));
    await expect(clearCache("mykey")).resolves.toBeUndefined();
  });
});
