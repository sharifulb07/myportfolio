import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";
import { sanitizeObject } from "@/utils/sanitize";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  await connectToDatabase();

  const product = await ProductModel.findOne({
    slug: sanitizeObject(slug),
  }).lean();
  if (!product) {
    return fail("Product not found", 404);
  }

  return ok(product);
}
