import { getInitials } from "../avatar";

describe("getInitials", () => {
  it("extrai duas iniciais de nome composto", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("extrai no máximo duas iniciais quando há mais de dois nomes", () => {
    expect(getInitials("Ana Maria Silva")).toBe("AM");
  });

  it("extrai uma única inicial de nome simples", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("converte para maiúsculas", () => {
    expect(getInitials("luís castillo")).toBe("LC");
  });

  it("lida com espaços extras entre palavras", () => {
    expect(getInitials("  Bob  Ross  ")).toBe("BR");
  });
});
