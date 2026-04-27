import type {
  InventoryItem,
  InventoryMovement,
  ReingressRequest,
  StockAdjustmentRequest,
  WithdrawalRequest
} from "../shared/types";
import type { InventoryRepository, MovementRepository } from "./repositories";

export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly movementRepository: MovementRepository
  ) {}

  async listInventory(): Promise<InventoryItem[]> {
    return this.inventoryRepository.list();
  }

  async addStock(payload: StockAdjustmentRequest): Promise<void> {
    await this.inventoryRepository.addStock(payload);
  }

  async registerWithdrawal(payload: WithdrawalRequest): Promise<void> {
    await this.inventoryRepository.withdraw(payload);
  }

  async registerReingress(payload: ReingressRequest): Promise<void> {
    await this.inventoryRepository.reingress(payload);
  }

  async listMovements(): Promise<InventoryMovement[]> {
    return this.movementRepository.list();
  }
}
