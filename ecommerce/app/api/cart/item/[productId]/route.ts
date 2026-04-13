import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireAuth } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { CartModel } from "@/models/Cart";
import { verifyCsrfToken } from "@/lib/security";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const body = await request.json();
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return fail("Invalid quantity", 422);
    }

    const { productId } = await context.params;

    await connectToDatabase();
    const cart = await CartModel.findOne({ user: auth.sub });
    if (!cart) {
      return fail("Cart not found", 404);
    }

    const item = cart.items.find(
      (entry: { product: { toString: () => string } }) =>
        entry.product.toString() === productId,
    );
    if (!item) {
      return fail("Cart item not found", 404);
    }

    item.quantity = quantity;
    await cart.save();

    return ok(cart);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to update cart item", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const { productId } = await context.params;

    await connectToDatabase();
    const cart = await CartModel.findOne({ user: auth.sub });
    if (!cart) {
      return fail("Cart not found", 404);
    }

    cart.items = cart.items.filter(
      (entry: { product: { toString: () => string } }) =>
        entry.product.toString() !== productId,
    );
    await cart.save();

    return ok(cart);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to delete cart item", 500);
  }
}
