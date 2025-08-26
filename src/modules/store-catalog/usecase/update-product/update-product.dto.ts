export interface UpdateProductInputDto {
  id: string;
  salesPrice: number;
}

export interface UpdateProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}
