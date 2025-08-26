import Product from "../domain/product.entity";

export default interface ProductGateway {
  update(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  find(id: string): Promise<Product>;
}
