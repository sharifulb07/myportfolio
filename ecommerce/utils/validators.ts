import { z } from "zod";

export const objectIdLike = z.string().regex(/^[a-fA-F0-9]{24}$/);

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const productCreateSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(220),
  description: z.string().min(10),
  category: z.string().min(2),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  rating: z.number().min(0).max(5).default(0),
});

export const cartItemSchema = z.object({
  productId: objectIdLike,
  quantity: z.number().int().positive().max(50),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.email(),
  addressLine1: z.string().min(5).max(160),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  paymentMethod: z.literal("COD"),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const cloudinaryUploadSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().startsWith("image/"),
  size: z.number().max(5 * 1024 * 1024),
  data: z.string().min(50),
});
