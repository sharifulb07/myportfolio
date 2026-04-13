import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireAuth } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { CartModel } from "@/models/Cart";
import { ProductModel } from "@/models/Product";
import { cartItemSchema } from "@/utils/validators";
import { sanitizeObject } from "@/utils/sanitize";
import { verifyCsrfToken } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectToDatabase();

    const cart = await CartModel.findOne({ user: auth.sub })
      .populate("items.product")
      .lean();
    return ok(cart ?? { user: auth.sub, items: [] });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to fetch cart", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const body = sanitizeObject(await request.json());
    const parsed = cartItemSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Invalid request payload", 422, parsed.error.flatten());
    }

    await connectToDatabase();

    const product = await ProductModel.findById(parsed.data.productId).lean();
    if (!product) {
      return fail("Product not found", 404);
    }

    if (product.stock < parsed.data.quantity) {
      return fail("Insufficient stock", 409);
    }

    const cart = await CartModel.findOneAndUpdate(
      { user: auth.sub },
      { $setOnInsert: { user: auth.sub, items: [] } },
      { upsert: true, new: true },
    );

    const existing = cart.items.find(
      (item: { product: { toString: () => string } }) =>
        item.product.toString() === parsed.data.productId,
    );

    if (existing) {
      existing.quantity = parsed.data.quantity;
      existing.priceSnapshot = product.discountPrice ?? product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: parsed.data.quantity,
        priceSnapshot: product.discountPrice ?? product.price,
      });
    }

    await cart.save();

    return ok(cart);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to update cart", 500);
  }
}
