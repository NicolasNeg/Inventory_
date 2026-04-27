import type {
  InventoryItem,
  InventoryMovement,
  Product,
  ProductCreateRequest,
  ReingressRequest,
  StockAdjustmentRequest,
  WithdrawalRequest
} from "../shared/types";

export interface ProductRepository {
  list(): Promise<Product[]>;
  create(payload: ProductCreateRequest): Promise<void>;
}

export interface InventoryRepository {
  list(): Promise<InventoryItem[]>;
  addStock(payload: StockAdjustmentRequest): Promise<void>;
  withdraw(payload: WithdrawalRequest): Promise<void>;
  reingress(payload: ReingressRequest): Promise<void>;
}

export interface MovementRepository {
  list(): Promise<InventoryMovement[]>;
}
