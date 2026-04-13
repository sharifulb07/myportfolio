import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireRole } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { LogModel } from "@/models/Log";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);
    await connectToDatabase();

    const logs = await LogModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return ok(logs);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to fetch logs", 500);
  }
}
