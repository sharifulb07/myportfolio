import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type AppRole = "ADMIN" | "CUSTOMER";

export type JwtPayload = {
  sub: string;
  email: string;
  role: AppRole;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables.");
}

const JWT_SECRET_VALUE: string = JWT_SECRET;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET_VALUE, {
    expiresIn: "7d",
    issuer: "ecommerce-mvp",
    audience: "ecommerce-mvp-users",
  });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET_VALUE, {
    issuer: "ecommerce-mvp",
    audience: "ecommerce-mvp-users",
  }) as unknown;

  const payload = decoded as Partial<JwtPayload>;
  if (!payload.sub || !payload.email || !payload.role) {
    throw new Error("Invalid token payload");
  }

  return payload as JwtPayload;
}
