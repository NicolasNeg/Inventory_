import { z } from "zod";

export const productCreateSchema = z.object({
  tipo: z.string().min(1),
  producto: z.string().min(1),
  marca: z.string().min(1),
  subModelo: z.string().min(1),
  autos: z.string(),
  cantidad: z.number().int().nonnegative(),
  minStock: z.number().int().nonnegative(),
  periodo: z.string().min(1),
  autor: z.string().min(1)
});

export const stockAdjustmentSchema = z.object({
  idFila: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  autor: z.string().min(1),
  notas: z.string().optional()
});

export const withdrawalSchema = stockAdjustmentSchema.extend({
  unidad: z.string().min(1),
  fecha: z.string().optional()
});

export const reingressSchema = stockAdjustmentSchema.extend({
  unidad: z.string().min(1),
  fecha: z.string().optional()
});
