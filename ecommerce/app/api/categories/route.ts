import { NextRequest } from "next/server";
import { fail, ok } from "@/utils/apiResponse";
import { connectToDatabase } from "@/lib/mongodb";
import { CategoryModel } from "@/models/Category";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();
    return ok(categories);
  } catch {
    return fail("Unable to fetch categories", 500);
  }
}
