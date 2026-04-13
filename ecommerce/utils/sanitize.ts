import mongoSanitize from "mongo-sanitize";
import xss from "xss";

export function sanitizeObject<T>(value: T): T {
  if (value == null) {
    return value;
  }

  if (typeof value === "string") {
    return xss(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item)) as T;
  }

  if (typeof value === "object") {
    const sanitized = mongoSanitize(value as Record<string, unknown>);
    const mapped: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(sanitized)) {
      mapped[key] = sanitizeObject(item);
    }
    return mapped as T;
  }

  return value;
}
