import { FindInvoiceUseCaseInputDto } from "./find-invoice.usecase.dto"
import FindInvoiceUseCase from "./find-invoice.usecase"
import Invoice from "../../domain/invoice.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Address from "../../../@shared/domain/value-object/address"

const invoice = new Invoice({
    id: new Id("1"),
    name: "Lucian",
    document: "1234-5678",
    address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
    ),
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Add Invoice use case unit test", () => {

    it("should add a invloice", async () => {

        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const input = {
            id: "1",
        } as FindInvoiceUseCaseInputDto;

        const result = await usecase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.address.street)
        expect(result.address.number).toEqual(invoice.address.number)
        expect(result.address.complement).toEqual(invoice.address.complement)
        expect(result.address.city).toEqual(invoice.address.city)
        expect(result.address.state).toEqual(invoice.address.state)
        expect(result.address.zipCode).toEqual(invoice.address.zipCode)
        expect(result.items).toEqual(invoice.items)

    })
})