import express, { Request, Response } from 'express';
import ProductRepositoryStore from '../../../modules/store-catalog/repository/product.repository';
import UpdateProductUseCase from '../../../modules/store-catalog/usecase/update-product/update-product.usecase';
import { UpdateProductInputDto } from '../../../modules/store-catalog/usecase/update-product/update-product.dto';

export const catalogProductRoute = express.Router();


catalogProductRoute.patch("/:productId/sales-price", async (req: Request, res: Response) => {
    const usecase = new UpdateProductUseCase(new ProductRepositoryStore());
    try {
        const productDto = {
            id: req.params.productId,
            salesPrice: req.body.salesPrice,
        } as UpdateProductInputDto;
        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});