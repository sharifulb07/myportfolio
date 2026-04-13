import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireAuth } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { CartModel } from "@/models/Cart";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { checkoutSchema } from "@/utils/validators";
import { sanitizeObject } from "@/utils/sanitize";
import { verifyCsrfToken } from "@/lib/security";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectToDatabase();
    const orders = await OrderModel.find({ userId: auth.sub })
      .sort({ createdAt: -1 })
      .lean();
    return ok(orders);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to fetch orders", 500);
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
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid checkout payload", 422, parsed.error.flatten());
    }

    const shippingAddress = [
      parsed.data.fullName,
      parsed.data.addressLine1,
      `${parsed.data.city}, ${parsed.data.state} ${parsed.data.postalCode}`,
      parsed.data.country,
      `Email: ${parsed.data.email}`,
    ].join(", ");

    await connectToDatabase();

    const cart = await CartModel.findOne({ user: auth.sub }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return fail("Cart is empty", 409);
    }

    const orderItems = [] as Array<{
      product: string;
      title: string;
      quantity: number;
      price: number;
    }>;
    let total = 0;

    for (const item of cart.items as Array<{
      product: { _id: string; title: string };
      quantity: number;
      priceSnapshot: number;
    }>) {
      const product = await ProductModel.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return fail(`Insufficient stock for ${item.product.title}`, 409);
      }

      product.stock -= item.quantity;
      await product.save();

      const linePrice = item.priceSnapshot * item.quantity;
      total += linePrice;

      orderItems.push({
        product: String(item.product._id),
        title: item.product.title,
        quantity: item.quantity,
        price: item.priceSnapshot,
      });
    }

    const order = await OrderModel.create({
      userId: auth.sub,
      products: orderItems,
      totalPrice: total,
      shippingAddress,
      phone: parsed.data.phone,
      paymentMethod: "COD",
      orderStatus: "PENDING",
    });

    cart.items = [];
    await cart.save();

    await writeLog("INFO", "order_created", "New COD order created", {
      orderId: String(order._id),
      userId: auth.sub,
      total,
    });

    return ok(order, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to place order", 500);
  }
}
