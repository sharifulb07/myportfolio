import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireAuth } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/models/Order";
import { objectIdLike } from "@/utils/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    const { id } = await context.params;

    const valid = objectIdLike.safeParse(id);
    if (!valid.success) {
      return fail("Invalid order id", 422);
    }

    await connectToDatabase();

    const query =
      auth.role === "ADMIN" ? { _id: id } : { _id: id, userId: auth.sub };
    const order = await OrderModel.findOne(query).lean();
    if (!order) {
      return fail("Order not found", 404);
    }

    return ok(order);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail("Unable to fetch order", 500);
  }
}
