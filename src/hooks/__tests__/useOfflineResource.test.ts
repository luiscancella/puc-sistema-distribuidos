import { renderHook, waitFor } from "@testing-library/react-native";
import { useOfflineResource } from "../useOfflineResource";
import { readCache, writeCache } from "../../services/cache";

jest.mock("../../services/cache", () => ({
  readCache: jest.fn(),
  writeCache: jest.fn(),
}));

const mockReadCache = readCache as jest.Mock;
const mockWriteCache = writeCache as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("useOfflineResource", () => {
  it("cache miss + fetcher ok: retorna dado fresh e chama writeCache", async () => {
    const fresh = { data: "fresh" };
    mockReadCache.mockResolvedValue(null);
    const fetcher = jest.fn().mockResolvedValue(fresh);

    const { result } = await renderHook(() => useOfflineResource("key", fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(fresh);
    expect(result.current.error).toBe(false);
    expect(mockWriteCache).toHaveBeenCalledWith("key", fresh);
  });

  it("cache hit + fetcher ok: atualiza com dado fresh e loading fica false", async () => {
    const cached = { data: "cached" };
    const fresh = { data: "fresh" };
    mockReadCache.mockResolvedValue(cached);
    const fetcher = jest.fn().mockResolvedValue(fresh);

    const { result } = await renderHook(() => useOfflineResource("key", fetcher));

    await waitFor(() => expect(result.current.data).toEqual(fresh));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
  });

  it("cache miss + fetcher falha: define error true e agenda retry", async () => {
    mockReadCache.mockResolvedValue(null);
    const fetcher = jest.fn().mockRejectedValue(new Error("network"));

    let retryCallback: (() => void) | undefined;
    jest.spyOn(global, "setTimeout").mockImplementation((cb: any) => {
      retryCallback = cb;
      return 0 as any;
    });

    const { result } = await renderHook(() => useOfflineResource("key", fetcher));

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(retryCallback).toBeDefined();

    fetcher.mockResolvedValueOnce({ data: "fresh" });
    retryCallback!();
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });

  it("cache hit + fetcher falha: mantém error false pois tem cache", async () => {
    const cached = { data: "cached" };
    mockReadCache.mockResolvedValue(cached);
    const fetcher = jest.fn().mockRejectedValue(new Error("network"));

    jest.spyOn(global, "setTimeout").mockImplementation(() => 0 as any);

    const { result } = await renderHook(() => useOfflineResource("key", fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.data).toEqual(cached);
  });

  it("reload() re-dispara o fetch", async () => {
    const fresh = { data: "fresh" };
    mockReadCache.mockResolvedValue(null);
    const fetcher = jest.fn().mockResolvedValue(fresh);

    const { result } = await renderHook(() => useOfflineResource("key", fetcher));
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.reload();
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });

  it("unmount impede state updates do retry agendado", async () => {
    mockReadCache.mockResolvedValue(null);
    const fetcher = jest.fn().mockRejectedValue(new Error("network"));

    let retryCallback: (() => void) | undefined;
    jest.spyOn(global, "setTimeout").mockImplementation((cb: any) => {
      retryCallback = cb;
      return 0 as any;
    });

    const { result, unmount } = await renderHook(() =>
      useOfflineResource("key", fetcher)
    );
    await waitFor(() => expect(result.current.error).toBe(true));

    await unmount();

    jest.restoreAllMocks();

    fetcher.mockResolvedValueOnce({ data: "fresh" });
    retryCallback?.();

    await new Promise((r) => setTimeout(r, 50));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
