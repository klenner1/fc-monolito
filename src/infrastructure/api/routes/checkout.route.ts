import express, { Request, Response } from 'express';
import PlaceOrderUseCase from '../../../modules/checkout/usecase/place-order/place-order.usecase';
import CheckoutRepository from '../../../modules/checkout/repository/checkout.repository';
import { PlaceOrderInputDto } from '../../../modules/checkout/usecase/place-order/place-order.dto';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../../modules/store-catalog/factory/facade.factory';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';
import PaymentFacadeFactory from '../../../modules/payment/factory/payment.facade.factory';

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new PlaceOrderUseCase(
        ClientAdmFacadeFactory.create(),
        ProductAdmFacadeFactory.create(),
        StoreCatalogFacadeFactory.create(),
        new CheckoutRepository(),
        InvoiceFacadeFactory.create(),
        PaymentFacadeFactory.create());
    try {
        const checkoutDto = {
            clientId: req.body.clientId,
            products: req.body.products.map((p: any) => ({
                productId: p.productId
            }))
        } as PlaceOrderInputDto;
        const output = await usecase.execute(checkoutDto);
        res.send(output);
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});