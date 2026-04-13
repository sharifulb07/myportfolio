import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { fail, ok } from "@/utils/apiResponse";
import { loginSchema } from "@/utils/validators";
import { comparePassword, signToken } from "@/lib/auth";
import { createCsrfToken } from "@/lib/security";
import { sanitizeObject } from "@/utils/sanitize";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = sanitizeObject(await request.json());
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid request payload", 422, parsed.error.flatten());
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: parsed.data.email });
    if (!user) {
      await writeLog("WARN", "login_failed", "Failed login attempt", {
        email: parsed.data.email,
        reason: "user_not_found",
      });
      return fail("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(
      parsed.data.password,
      user.passwordHash,
    );
    if (!isMatch) {
      await writeLog("WARN", "login_failed", "Failed login attempt", {
        email: parsed.data.email,
        reason: "bad_password",
      });
      return fail("Invalid credentials", 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      sub: String(user._id),
      email: user.email,
      role: user.role,
    });

    const csrf = createCsrfToken();

    const response = ok({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      csrfToken: csrf,
    });

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

    await writeLog("INFO", "login_success", "User logged in", {
      userId: String(user._id),
      email: user.email,
    });

    return response;
  } catch (error) {
    await writeLog("ERROR", "login_error", "Login endpoint error", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return fail("Unable to login", 500);
  }
}
