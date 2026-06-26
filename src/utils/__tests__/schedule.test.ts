import { getNextOccurrences, formatTimeRange, formatDeadline, formatDateLabel } from "../schedule";
import { Course } from "../../types";

// 2025-01-13 = segunda-feira, 09:00
const NOW = new Date(2025, 0, 13, 9, 0, 0);

function makeCourse(day: string, startsAt: string, endsAt?: string): Course {
  return {
    id: "c1",
    name: "Curso",
    shortLabel: "CUR",
    schedules: [{ day, startsAt, endsAt: endsAt ?? null } as any],
  } as Course;
}

describe("getNextOccurrences", () => {
  it("retorna próxima ocorrência em dia futuro da semana", () => {
    const course = makeCourse("WEDNESDAY", "10:00:00");
    const [occ] = getNextOccurrences([course], NOW);
    expect(occ.nextDate).toEqual(new Date(2025, 0, 15, 10, 0, 0));
  });

  it("mantém aula de hoje que ainda não começou", () => {
    const course = makeCourse("MONDAY", "11:00:00", "12:00:00");
    const [occ] = getNextOccurrences([course], NOW);
    expect(occ.nextDate).toEqual(new Date(2025, 0, 13, 11, 0, 0));
  });

  it("avança 7 dias quando aula de hoje já terminou", () => {
    const course = makeCourse("MONDAY", "07:00:00", "08:00:00");
    const [occ] = getNextOccurrences([course], NOW);
    expect(occ.nextDate).toEqual(new Date(2025, 0, 20, 7, 0, 0));
  });

  it("avança 7 dias quando aula de hoje sem endsAt já passou do startsAt", () => {
    const course = makeCourse("MONDAY", "08:00:00");
    const [occ] = getNextOccurrences([course], NOW);
    expect(occ.nextDate).toEqual(new Date(2025, 0, 20, 8, 0, 0));
  });

  it("ordena resultado por nextDate crescente", () => {
    const wed = makeCourse("WEDNESDAY", "10:00:00");
    const fri = makeCourse("FRIDAY", "09:00:00");
    const tue = makeCourse("TUESDAY", "08:00:00");
    const result = getNextOccurrences([wed, fri, tue], NOW);
    expect(result[0].nextDate < result[1].nextDate).toBe(true);
    expect(result[1].nextDate < result[2].nextDate).toBe(true);
  });
});

describe("formatTimeRange", () => {
  const start = new Date(2025, 0, 13, 9, 30, 0);
  const end = new Date(2025, 0, 13, 10, 45, 0);

  it("retorna apenas o horário de início quando end é null", () => {
    expect(formatTimeRange(start, null)).toBe("09:30");
  });

  it("retorna intervalo quando end é fornecido", () => {
    expect(formatTimeRange(start, end)).toBe("09:30 - 10:45");
  });
});

describe("formatDeadline", () => {
  it("contém a frase padrão e um horário formatado", () => {
    const result = formatDeadline("2025-01-13T23:59:00");
    expect(result).toContain("antes das");
    expect(result).toContain("23:59");
  });
});

describe("formatDateLabel", () => {
  it("retorna label com dia da semana, mês e dia em maiúsculas", () => {
    const result = formatDateLabel("2025-01-13");
    expect(result).toContain("SEG");
    expect(result).toContain("13");
  });
});
