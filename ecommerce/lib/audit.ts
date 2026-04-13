import { connectToDatabase } from "@/lib/mongodb";
import { logApiEvent, logError, logSecurityEvent } from "@/lib/logger";
import { LogModel } from "@/models/Log";

export async function writeLog(
  level: "INFO" | "WARN" | "ERROR",
  event: string,
  message: string,
  meta?: Record<string, unknown>,
) {
  await connectToDatabase();
  await LogModel.create({
    level,
    event,
    message,
    meta,
  });

  if (level === "INFO") {
    logApiEvent(event, { message, ...meta });
  } else if (level === "WARN") {
    logSecurityEvent(event, { message, ...meta });
  } else {
    logError(event, { message, ...meta });
  }
}
