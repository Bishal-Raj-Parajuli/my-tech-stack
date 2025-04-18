import { z } from "zod";

export const INTERNAL_SERVER_ERROR = z.object({
  status: z.literal("INTERNAL_SERVER_ERROR"),
  message: z.string(),
});

export const BAD_REQUEST = z.object({
  status: z.literal("BAD_REQUEST"),
  message: z.string(),
});

export const NOT_FOUND = z.object({
  status: z.literal("NOT_FOUND"),
  message: z.string(),
});

export const CREATED = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    status: z.literal("CREATED"),
    data: data,
  });

export const SUCCESS = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    status: z.literal("OK"),
    data: data,
  });
