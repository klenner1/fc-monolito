import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const newLocal = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit test", () => {
    describe("calidateProducts method", () => {

        //@ts-expect-error - no params in constructor
        const usecase = new PlaceOrderUseCase();

        it("should throw error when no products are selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            await expect(
                usecase["ValidateProducts"](input)
            ).rejects.toThrow(new Error("No products selected"));
        });

        it("should not throw error when products is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({ productId, stock: productId === "1" ? 0 : 1 })
                )
            };

            //@ts-expect-error - force set productFacade
            usecase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            await expect(
                usecase["ValidateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not avaliable in stock"));

            input = {
                clientId: "1",
                products: [{ productId: "0" }, { productId: "1" }]
            }

            await expect(
                usecase["ValidateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not avaliable in stock"));


            input = {
                clientId: "1",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }]
            }

            await expect(
                usecase["ValidateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not avaliable in stock"));

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });


    });

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(newLocal);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params in constructor
        const usecase = new PlaceOrderUseCase();

        it("should throw error when no products not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            };
            //@ts-expect-error - force set catalogFacade
            usecase["_catalogFacade"] = mockCatalogFacade;

            await expect(
                usecase["getProduct"]("0")
            ).rejects.toThrow(new Error("Products not found"));
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "1",
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 0
                })
            };
            //@ts-expect-error - force set catalogFacade
            usecase["_catalogFacade"] = mockCatalogFacade;

            await expect(
                usecase["getProduct"]("0")
            ).resolves.toEqual(
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 0
                })
            );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

    });

    describe("execute method", () => {
        it("should throw error wnhn client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            };
            //@ts-expect-error - no params in constructor
            const usecase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            usecase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            await expect(usecase.execute(input)).rejects
                .toThrow(new Error("Client not found"));
        });

        it("should throw error wnhn product not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            };

            //@ts-expect-error - no params in constructor
            const usecase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            usecase["_clientFacade"] = mockClientFacade;

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(usecase, "ValidateProducts")
                //@ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"));

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            await expect(usecase.execute(input)).rejects
                .toThrow(new Error("No products selected"));

            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });
    });

    describe("place an Order", () => {

        const clientProps = {
            id: new Id("1c"),
            name: "Client 1",
            document: "Document 1",
            email: "client@mail.com",
            address: new Address(
                "Street 1",
                "123",
                "Complement 1",
                "City 1",
                "State 1",
                "ZipCode 1"
            ),
        };
        const moockClientFacade = {
            find: jest.fn().mockResolvedValue(clientProps)
        };

        const mockPaymentFacade = {
            process: jest.fn()
        }

        const mockCheckoutRepository = {
            addOrder: jest.fn(),
        };


        const mockInvoiceFacade = {
            generate: jest.fn().mockResolvedValue({ id: "1i" })
        };

        const placeOrderUseCase = new PlaceOrderUseCase(
            moockClientFacade as any,
            null,
            null,
            mockCheckoutRepository as any,
            mockInvoiceFacade as any,
            mockPaymentFacade);

        const products = {
            "1": new Product({
                id: new Id("1"),
                name: "Product 1",
                description: "Description 1",
                salesPrice: 50
            }),
            "2": new Product({
                id: new Id("2"),
                name: "Product 2",
                description: "Description 2",
                salesPrice: 20
            })
        };

        const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "ValidateProducts")
            //@ts-expect-error - not return never
            .mockResolvedValue(null);

        const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProduct")
            //@ts-expect-error - not return never
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            });

        it("should not be approved", async () => {

            mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                transactionId: "1t",
                orderId: "1o",
                amount: 70,
                status: "error",
                createdAt: new Date(),
                updatedAt: new Date()
            })
            const input: PlaceOrderInputDto = {
                clientId: "1c",
                products: [{ productId: "1" }, { productId: "2" }]
            };

            const output = await placeOrderUseCase.execute(input);

            expect(output).toBeDefined();
            expect(output.InvoiceId).toBeNull();
            expect(output.total).toBe(70);
            expect(output.products).toStrictEqual([
                { productId: "1" }, { productId: "2" }
            ]);
            expect(moockClientFacade.find).toHaveBeenCalledTimes(1);
            expect(moockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
            expect(mockValidateProducts).toHaveBeenCalledWith(input);
            expect(mockGetProduct).toHaveBeenCalledTimes(2);
            expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(0);
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total
            });
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);

        });

        it("should not be approved", async () => {

            mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                transactionId: "1t",
                orderId: "1o",
                amount: 70,
                status: "approved",
                createdAt: new Date(),
                updatedAt: new Date()
            })
            const input: PlaceOrderInputDto = {
                clientId: "1c",
                products: [{ productId: "1" }, { productId: "2" }]
            };

            const output = await placeOrderUseCase.execute(input);

            expect(output).toBeDefined();
            expect(output.InvoiceId).not.toBeNull();
            expect(output.total).toBe(70);
            expect(output.products).toStrictEqual([
                { productId: "1" }, { productId: "2" }
            ]);
            expect(moockClientFacade.find).toHaveBeenCalledTimes(1);
            expect(moockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
            expect(mockValidateProducts).toHaveBeenCalledWith(input);
            expect(mockGetProduct).toHaveBeenCalledTimes(2);
            expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total
            });
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                name: clientProps.name,
                document: clientProps.document,
                street: clientProps.address.street,
                number: clientProps.address.number,
                complement: clientProps.address.complement,
                city: clientProps.address.city,
                state: clientProps.address.state,
                zipCode: clientProps.address.zipCode,
                items: [
                    {
                        id: products["1"].id.id,
                        name: products["1"].name,
                        price: products["1"].salesPrice
                    },
                    {
                        id: products["2"].id.id,
                        name: products["2"].name,
                        price: products["2"].salesPrice
                    }
                ]
            });

        });
    });
});