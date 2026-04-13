import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";
import { objectIdLike, productCreateSchema } from "@/utils/validators";
import { sanitizeObject } from "@/utils/sanitize";
import { requireRole } from "@/middleware/authMiddleware";
import { verifyCsrfToken } from "@/lib/security";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const valid = objectIdLike.safeParse(id);
  if (!valid.success) {
    return fail("Invalid product id", 422);
  }

  await connectToDatabase();
  const product = await ProductModel.findById(id).lean();
  if (!product) {
    return fail("Product not found", 404);
  }

  return ok(product);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    requireRole(request, ["ADMIN"]);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const { id } = await context.params;
    const valid = objectIdLike.safeParse(id);
    if (!valid.success) {
      return fail("Invalid product id", 422);
    }

    const body = sanitizeObject(await request.json());
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid request payload", 422, parsed.error.flatten());
    }

    await connectToDatabase();
    const product = await ProductModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();

    if (!product) {
      return fail("Product not found", 404);
    }

    await writeLog("INFO", "product_updated", "Product updated by admin", {
      productId: id,
      slug: product.slug,
    });

    return ok(product);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to update product", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireRole(request, ["ADMIN"]);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const { id } = await context.params;
    const valid = objectIdLike.safeParse(id);
    if (!valid.success) {
      return fail("Invalid product id", 422);
    }

    await connectToDatabase();
    const deleted = await ProductModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return fail("Product not found", 404);
    }

    await writeLog("WARN", "product_deleted", "Product deleted by admin", {
      productId: id,
      slug: deleted.slug,
    });

    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to delete product", 500);
  }
}
