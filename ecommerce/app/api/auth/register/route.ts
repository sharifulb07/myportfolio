import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CartModel } from "@/models/Cart";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/utils/apiResponse";
import { registerSchema } from "@/utils/validators";
import { hashPassword, signToken } from "@/lib/auth";
import { createCsrfToken } from "@/lib/security";
import { sanitizeObject } from "@/utils/sanitize";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = sanitizeObject(await request.json());
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid request payload", 422, parsed.error.flatten());
    }

    await connectToDatabase();

    const exists = await UserModel.findOne({ email: parsed.data.email }).lean();
    if (exists) {
      return fail("Email already in use", 409);
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await UserModel.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "CUSTOMER",
    });

    await CartModel.create({ user: user._id, items: [] });

    const token = signToken({
      sub: String(user._id),
      email: user.email,
      role: user.role,
    });

    const csrf = createCsrfToken();

    const response = ok(
      {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        csrfToken: csrf,
      },
      201,
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("csrf_token", csrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    await writeLog("INFO", "user_registered", "New user registered", {
      userId: String(user._id),
      email: user.email,
    });

    return response;
  } catch (error) {
    await writeLog("ERROR", "register_failed", "User registration failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return fail("Unable to register user", 500);
  }
}
