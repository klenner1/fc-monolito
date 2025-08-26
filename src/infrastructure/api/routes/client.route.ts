import express, { Request, Response } from 'express';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import { AddClientInputDto } from '../../../modules/client-adm/usecase/add-client/add-client.usecase.dto';
import Address from '../../../modules/@shared/domain/value-object/address';


export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddClientUseCase(new ClientRepository());
    try {
        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            description: req.body.description,
            document: req.body.document,
            address: new Address(
                req.body.address.street,
                req.body.address.number,
                req.body.address.complement,
                req.body.address.city,
                req.body.address.state,
                req.body.address.zipCode
            )
        } as AddClientInputDto;
        const output = await usecase.execute(clientDto);
        res.send(output);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});