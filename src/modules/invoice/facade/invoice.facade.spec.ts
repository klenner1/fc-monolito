import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import Address from "../../@shared/domain/value-object/address"
import { GenerateInvoiceFacadeInputDto } from './invoice.facade.interface';
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { InvoiceItemModel } from "../repository/invoice-item.model"


describe("Invoice Facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an invoice", async () => {

        const repository = new InvoiceRepository()
        const addUsecase = new GenerateInvoiceUseCase(repository)
        const facade = new InvoiceFacade({
            generateUsecase: addUsecase,
            findUsecase: undefined,
        })

        const input = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                }
            ]
        } as GenerateInvoiceFacadeInputDto;

        const output = await facade.generate(input)

        expect(output).toBeDefined()
        expect(output).not.toBeNull()
        expect(output.id).not.toBeNull()
        expect(output.name).toBe(input.name)
        expect(output.document).toBe(input.document)
        expect(output.street).toBe(input.street)
    })

    it("should find an invoice", async () => {

        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                }
            ]
        }

        const output = await facade.generate(input)

        const invoice = await facade.find({ id: output.id })

        expect(invoice).toBeDefined()
        expect(invoice.id).not.toBeNull()
        expect(invoice.name).toBe(input.name)
        expect(invoice.document).toBe(input.document)
        expect(invoice.address.street).toBe(input.street)
        expect(invoice.address.number).toBe(input.number)
        expect(invoice.address.complement).toBe(input.complement)
        expect(invoice.address.city).toBe(input.city)
        expect(invoice.address.state).toBe(input.state)
        expect(invoice.address.zipCode).toBe(input.zipCode)
    })
})