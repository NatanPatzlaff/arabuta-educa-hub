/** Utilitários de máscara e validação usados no formulário de inscrição. */

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function mascaraCPF(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function mascaraTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Validação real de CPF: dois dígitos verificadores + rejeita sequências repetidas. */
export function cpfValido(valor: string): boolean {
  const cpf = apenasDigitos(valor);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcula = (ate: number) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(cpf[i]) * (ate + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 || resto === 11 ? 0 : resto;
  };

  return calcula(9) === Number(cpf[9]) && calcula(10) === Number(cpf[10]);
}

export function emailValido(valor: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(valor.trim());
}
