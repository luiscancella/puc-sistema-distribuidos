import { apiClient } from "../client";
import { getCurrentClass, submitCheckIn, TooFarError } from "../checkins";

jest.mock("../client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

const checkInParams = {
  classSessionId: "session-1",
  photoUri: "file://photo.jpg",
  latitude: -23.5,
  longitude: -46.6,
};

const session = { id: "s1", course: { id: "c1", name: "Math", shortLabel: "MAT", location: "101" }, date: "2025-01-13" };
const checkInResult = { checkInPhotoId: "p1", pointsEarned: 10, streakCount: 3 };

beforeEach(() => jest.clearAllMocks());

describe("getCurrentClass", () => {
  it("retorna a sessão quando classSession está presente", async () => {
    mockGet.mockResolvedValueOnce({ data: { classSession: session } });
    const result = await getCurrentClass();
    expect(result).toEqual(session);
  });

  it("retorna null quando classSession é null", async () => {
    mockGet.mockResolvedValueOnce({ data: { classSession: null } });
    const result = await getCurrentClass();
    expect(result).toBeNull();
  });
});

describe("submitCheckIn", () => {
  it("faz POST com FormData e retorna o resultado", async () => {
    mockPost.mockResolvedValueOnce({ data: checkInResult });
    const result = await submitCheckIn(checkInParams);
    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body, config] = mockPost.mock.calls[0];
    expect(url).toBe("/check-ins");
    expect(body).toBeInstanceOf(FormData);
    expect(config.headers["Content-Type"]).toBe("multipart/form-data");
    expect(result).toEqual(checkInResult);
  });

  it("lança TooFarError com distanceMeters em erro 422 TOO_FAR", async () => {
    mockPost.mockRejectedValueOnce({
      response: { status: 422, data: { detail: { error: "TOO_FAR", distanceMeters: 350 } } },
    });
    await expect(submitCheckIn(checkInParams)).rejects.toThrow(TooFarError);
    mockPost.mockRejectedValueOnce({
      response: { status: 422, data: { detail: { error: "TOO_FAR", distanceMeters: 350 } } },
    });
    try {
      await submitCheckIn(checkInParams);
    } catch (err) {
      expect(err).toBeInstanceOf(TooFarError);
      expect((err as TooFarError).distanceMeters).toBe(350);
    }
  });

  it("lança Error('ALREADY_CHECKED_IN') em erro 409", async () => {
    mockPost.mockRejectedValueOnce({ response: { status: 409 } });
    await expect(submitCheckIn(checkInParams)).rejects.toThrow("ALREADY_CHECKED_IN");
  });

  it("tenta novamente em ERR_NETWORK e retorna sucesso na segunda tentativa", async () => {
    mockPost
      .mockRejectedValueOnce({ code: "ERR_NETWORK" })
      .mockResolvedValueOnce({ data: checkInResult });
    const result = await submitCheckIn(checkInParams);
    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(result).toEqual(checkInResult);
  });

  it("falha após duas tentativas em ERR_NETWORK sem retry infinito", async () => {
    const networkError = { code: "ERR_NETWORK" };
    mockPost
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError);
    await expect(submitCheckIn(checkInParams)).rejects.toEqual(networkError);
    expect(mockPost).toHaveBeenCalledTimes(2);
  });

  it("repropaga outros erros sem modificação", async () => {
    const serverError = { response: { status: 500, data: { message: "Internal Error" } } };
    mockPost.mockRejectedValueOnce(serverError);
    await expect(submitCheckIn(checkInParams)).rejects.toEqual(serverError);
  });
});
