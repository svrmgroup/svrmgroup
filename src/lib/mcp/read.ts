import { z } from 'zod';
import { ToolError } from '@lovable.dev/mcp-js';
export const pageSchema = { limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).max(10000).default(0) };
export const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
export function result(rows: unknown, extra: Record<string, string | number | boolean | null> = {}) {
  // Database JSON (not SDK interface instances); explicitly excludes tokens and storage URLs at query selection.
  return { content: [{ type: 'text' as const, text: JSON.stringify({ rows, ...extra }) }] };
}
export function assertRead(error: { message: string } | null) { if (error) throw new ToolError('Records could not be read. Please retry or check your admin permissions.'); }
