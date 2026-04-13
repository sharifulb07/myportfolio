import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireRole } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/models/Order";
import { orderStatusSchema, objectIdLike } from "@/utils/validators";
import { verifyCsrfToken } from "@/lib/security";
import { writeLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);
    await connectToDatabase();

    const orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    return ok(orders);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to fetch admin orders", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);

    const csrfCookie = request.cookies.get("csrf_token")?.value;
    const csrfHeader = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
      return fail("Invalid CSRF token", 403);
    }

    const body = await request.json();
    const idParsed = objectIdLike.safeParse(body.orderId);
    const statusParsed = orderStatusSchema.safeParse(body.orderStatus);

    if (!idParsed.success || !statusParsed.success) {
      return fail("Invalid request payload", 422);
    }

    await connectToDatabase();

    const order = await OrderModel.findByIdAndUpdate(
      idParsed.data,
      { orderStatus: statusParsed.data },
      { new: true },
    ).lean();

    if (!order) {
      return fail("Order not found", 404);
    }

    await writeLog(
      "INFO",
      "order_status_changed",
      "Admin changed order status",
      {
        orderId: idParsed.data,
        orderStatus: statusParsed.data,
      },
    );

    return ok(order);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to update order status", 500);
  }
}
