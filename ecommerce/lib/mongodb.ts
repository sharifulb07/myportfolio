import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables.");
}

const MONGODB_URI_VALUE: string = MONGODB_URI;

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

const cached: Cached = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI_VALUE, {
      dbName: "ecommerce_mvp",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
