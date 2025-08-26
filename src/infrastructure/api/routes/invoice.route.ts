import express, { Request, Response } from 'express';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import FindInvoiceUseCase from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase';
import { FindInvoiceUseCaseInputDto } from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase.dto';
import GenerateInvoiceUseCase from '../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase';
import { GenerateInvoiceUseCaseInputDto } from '../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase.dto';

export const invoiceRoute = express.Router();

invoiceRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new GenerateInvoiceUseCase(new InvoiceRepository());
    try {
        const invoiceDto = {
            name: req.body.name,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            items: req.body.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price
            }))
        } as GenerateInvoiceUseCaseInputDto;
        const output = await usecase.execute(invoiceDto);
        res.send(output);
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});

invoiceRoute.get("/:invoiceId", async (req: Request, res: Response) => {
    const usecase = new FindInvoiceUseCase(new InvoiceRepository());
    try {
        const invoiceDto = {
            id: req.params.invoiceId,
        } as FindInvoiceUseCaseInputDto;
        const output = await usecase.execute(invoiceDto);
        res.send(output);
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});