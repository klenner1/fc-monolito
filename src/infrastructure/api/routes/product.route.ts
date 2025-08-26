import express, { Request, Response } from 'express';
import ProductRepositoryAdm from '../../../modules/product-adm/repository/product.repository';
import ProductRepositoryStore from '../../../modules/store-catalog/repository/product.repository';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import { AddProductInputDto } from '../../../modules/product-adm/usecase/add-product/add-product.dto';
import UpdateProductUseCase from '../../../modules/store-catalog/usecase/update-product/update-product.usecase';
import { UpdateProductInputDto } from '../../../modules/store-catalog/usecase/update-product/update-product.dto';

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddProductUseCase(new ProductRepositoryAdm());
    try {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        } as AddProductInputDto;
        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});

productRoute.patch("/:productId/sales-price", async (req: Request, res: Response) => {
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