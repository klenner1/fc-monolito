import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.usecase.dto"
import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}

describe("Add Invoice use case unit test", () => {

    it("should add an invoice", async () => {

        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)

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
                },
            ]
        } as GenerateInvoiceUseCaseInputDto;

        const result = await usecase.execute(input)

        expect(repository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city)
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)
        expect(result.items).toEqual(input.items)

    })
})