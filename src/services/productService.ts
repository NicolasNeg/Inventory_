import type { Product, ProductCreateRequest } from "../shared/types";
import type { ProductRepository } from "./repositories";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async listProducts(): Promise<Product[]> {
    return this.repository.list();
  }

  async createProduct(payload: ProductCreateRequest): Promise<void> {
    await this.repository.create(payload);
  }
}
