import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { getAuthFromRequest } from "@/middleware/authMiddleware";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return fail("Unauthorized", 401);
  }
  return ok(auth);
}
