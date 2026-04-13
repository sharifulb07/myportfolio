import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";
import { productCreateSchema } from "@/utils/validators";
import { sanitizeObject } from "@/utils/sanitize";
import { requireRole } from "@/middleware/authMiddleware";
import { verifyCsrfToken } from "@/lib/security";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const search = sanitizeObject(
      request.nextUrl.searchParams.get("search") ?? "",
    );
    const category = sanitizeObject(
      request.nextUrl.searchParams.get("category") ?? "",
    );
    const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page") ?? "1"),
    );
    const limit = Math.min(
      50,
      Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? "12")),
    );

    const query: Record<string, unknown> = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const [items, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return ok({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return fail("Unable to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const body = sanitizeObject(await request.json());
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid request payload", 422, parsed.error.flatten());
    }

    await connectToDatabase();
    const created = await ProductModel.create(parsed.data);

    await writeLog("INFO", "product_created", "Product created by admin", {
      productId: String(created._id),
      slug: created.slug,
    });

    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to create product", 500);
  }
}
