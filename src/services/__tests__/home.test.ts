import { apiClient } from "../client";
import { getHome } from "../home";

jest.mock("../client", () => ({
  apiClient: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const baseResponse = {
  streak: { count: 3, lastCheckIn: "2025-01-12" },
  checkIn: null,
};

describe("getHome", () => {
  it("marca isCurrentUser corretamente para cada membro", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...baseResponse,
        group: {
          courses: [],
          members: [
            { student: { id: "current", name: "Eu" }, points: 100 },
            { student: { id: "other", name: "Outro" }, points: 50 },
          ],
        },
      },
    });

    const result = await getHome("current");
    expect(result.group!.members[0].isCurrentUser).toBe(true);
    expect(result.group!.members[1].isCurrentUser).toBe(false);
  });

  it("preserva os campos originais dos membros", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...baseResponse,
        group: {
          courses: [],
          members: [{ student: { id: "s1", name: "Alice" }, points: 200 }],
        },
      },
    });

    const result = await getHome("s1");
    const member = result.group!.members[0];
    expect(member.points).toBe(200);
    expect(member.student.name).toBe("Alice");
  });

  it("retorna group null quando a API retorna group null", async () => {
    mockGet.mockResolvedValueOnce({ data: { ...baseResponse, group: null } });
    const result = await getHome("any");
    expect(result.group).toBeNull();
  });

  it("não quebra quando o group tem membros vazios", async () => {
    mockGet.mockResolvedValueOnce({
      data: { ...baseResponse, group: { courses: [], members: [] } },
    });
    const result = await getHome("any");
    expect(result.group!.members).toHaveLength(0);
  });
});
