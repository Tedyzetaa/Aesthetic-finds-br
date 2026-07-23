import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE_NAME } from "./session-cookie";

// Autenticação simples de administrador único, pensada para o time de
// vendas operar o painel (não é multiusuário). Credenciais e segredo
// vêm de variáveis de ambiente — nunca commitar valores reais.

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "troque-este-segredo-em-producao";

export function verifyCredentials(email: string, senha: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@aestheticfinds.com.br";
  const adminHash =
    process.env.ADMIN_PASSWORD_HASH ||
    // hash padrão de desenvolvimento para a senha "mudar123" — trocar via
    // ADMIN_PASSWORD_HASH em produção (ver README)
    "$2b$10$UuY6TYo2vY8HtIlBnuHHROBJsIoZU1UlPn0YS9YpgtkEkpn65s4Ke";

  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) return false;
  return bcrypt.compareSync(senha, adminHash);
}

export function createSessionToken(email: string): string {
  return jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME };
