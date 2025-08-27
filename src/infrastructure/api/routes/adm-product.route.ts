import express, { Request, Response } from 'express';
import ProductRepositoryAdm from '../../../modules/product-adm/repository/product.repository';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import { AddProductInputDto } from '../../../modules/product-adm/usecase/add-product/add-product.dto';

export const admProductRoute = express.Router();

admProductRoute.post("/", async (req: Request, res: Response) => {
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
