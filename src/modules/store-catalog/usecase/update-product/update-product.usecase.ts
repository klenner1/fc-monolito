import ProductGateway from "../../gateway/product.gateway";
import { UpdateProductInputDto, UpdateProductOutputDto } from "./update-product.dto";

export default class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductGateway) {}

  async execute(input: UpdateProductInputDto): Promise<UpdateProductOutputDto> {
    const product = await this.productRepository.find(input.id);
    
    product.changeSalesPrice(input.salesPrice);

    await this.productRepository.update(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
