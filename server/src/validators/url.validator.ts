import { z } from 'zod';

export const urlSchemaValidator = z.object({
    fullUrl: z.url({ message: "Invalid URL format" }),
    clicks: z.number().optional(),
})
export type UrlSchemaValidator = z.infer<typeof urlSchemaValidator>;

export const shortUrlParamValidator = z.object({
    shortUrl: z.string().regex(/^[A-Za-z0-9_-]{8}$/)
});
export type ShortUrlParamValidator = z.infer<typeof shortUrlParamValidator>;