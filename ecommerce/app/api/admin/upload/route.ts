import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireRole } from "@/middleware/authMiddleware";
import { verifyCsrfToken } from "@/lib/security";
import { cloudinaryUploadSchema } from "@/utils/validators";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const body = await request.json();
    const parsed = cloudinaryUploadSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid upload payload", 422, parsed.error.flatten());
    }

    const uploaded = await uploadProductImage(parsed.data.data);

    return ok({
      secureUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to upload image", 500);
  }
}
