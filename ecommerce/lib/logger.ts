import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: {
    app: "ecommerce-mvp",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function logApiEvent(event: string, payload: Record<string, unknown>) {
  logger.info({ event, ...payload }, "api-event");
}

export function logSecurityEvent(
  event: string,
  payload: Record<string, unknown>,
) {
  logger.warn({ event, ...payload }, "security-event");
}

export function logError(event: string, payload: Record<string, unknown>) {
  logger.error({ event, ...payload }, "error-event");
}
