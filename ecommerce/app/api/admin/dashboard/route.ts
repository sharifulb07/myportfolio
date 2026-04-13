import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { requireRole } from "@/middleware/authMiddleware";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";
import { OrderModel } from "@/models/Order";
import { UserModel } from "@/models/User";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    requireRole(request, ["ADMIN"]);
    await connectToDatabase();

    const [users, products, orders, pendingOrders] = await Promise.all([
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ orderStatus: "PENDING" }),
    ]);

    return ok({ users, products, orders, pendingOrders });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return fail("Forbidden", 403);
    }
    return fail("Unable to load dashboard metrics", 500);
  }
}
