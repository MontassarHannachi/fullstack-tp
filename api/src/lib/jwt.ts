import jwt from "jsonwebtoken";

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

export const sign = (userId: number, email: string) =>
  jwt.sign({ sub: String(userId), email }, secret(), { expiresIn: "1h" });

export const verify = (token: string) => jwt.verify(token, secret());
