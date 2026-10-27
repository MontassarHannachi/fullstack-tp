import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { sign } from "../lib/jwt.js";
import { validate } from "../middlewares/validate.js";
import { credentials } from "../schemas/auth.js";
import { Prisma } from "../generated/prisma/client.js";

export const authRouter = Router();

authRouter.post("/register", validate(credentials), async (_req, res) => {
  const { email, password } = res.locals.body;
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ error: "Email already registered" });
    }
    throw err;
  }
});

authRouter.post("/login", validate(credentials), async (_req, res) => {
  const { email, password } = res.locals.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: sign(user.id, user.email) });
});
