import { apiClient } from "../client";
import { signIn, signUp } from "../auth";

jest.mock("../client", () => ({
  apiClient: { post: jest.fn() },
}));

const mockPost = apiClient.post as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const session = { token: "tok", student: { id: "s1", name: "Test" } };

describe("signIn", () => {
  it("faz POST em /auth/sign-in e retorna data", async () => {
    mockPost.mockResolvedValueOnce({ data: session });
    const result = await signIn({ email: "a@b.com", password: "123456" });
    expect(mockPost).toHaveBeenCalledWith("/auth/sign-in", { email: "a@b.com", password: "123456" });
    expect(result).toEqual(session);
  });
});

describe("signUp", () => {
  it("faz POST em /auth/sign-up sem o campo confirmPassword", async () => {
    mockPost.mockResolvedValueOnce({ data: session });
    await signUp({ email: "a@b.com", password: "123456", confirmPassword: "123456", name: "Test" } as any);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe("/auth/sign-up");
    expect(body).not.toHaveProperty("confirmPassword");
    expect(body).toHaveProperty("email");
    expect(body).toHaveProperty("password");
  });

  it("retorna data da resposta", async () => {
    mockPost.mockResolvedValueOnce({ data: session });
    const result = await signUp({ email: "a@b.com", password: "123456", confirmPassword: "123456", name: "Test" } as any);
    expect(result).toEqual(session);
  });
});
