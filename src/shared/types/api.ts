import type { InventoryItem, InventoryMovement, Product } from "./entities";

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListProductsResponse {
  products: Product[];
}

export interface ListInventoryResponse {
  items: InventoryItem[];
}

export interface ListMovementsResponse {
  movements: InventoryMovement[];
}

export interface ProductCreateRequest {
  tipo: string;
  producto: string;
  marca: string;
  subModelo: string;
  autos: string;
  cantidad: number;
  minStock: number;
  periodo: string;
  autor: string;
}

export interface StockAdjustmentRequest {
  idFila: number;
  cantidad: number;
  autor: string;
  notas?: string;
}

export interface WithdrawalRequest extends StockAdjustmentRequest {
  unidad: string;
  fecha?: string;
}

export interface ReingressRequest extends StockAdjustmentRequest {
  unidad: string;
  fecha?: string;
}
