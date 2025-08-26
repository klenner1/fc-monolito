import { Sequelize } from "sequelize-typescript"
import { OrderModel } from "./order.model"
import { OrderItemModel } from "./order-item.model"
import { CheckoutClientModel } from "./client.model"
import { CheckoutProductModel } from "./product.model"
import Order from "../domain/order.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import Address from "../../@shared/domain/value-object/address"
import Product from "../domain/product.entity"
import CheckoutRepository from "./checkout.repository"
import { Umzug } from "umzug"
import { migrator } from "../../../infrastructure/db/config/migrator "
import { ClientModel } from "../../client-adm/repository/client.model"
import { ProductModel } from "../../product-adm/repository/product.model"


describe("Invoice Repository test", () => {

    let sequelize: Sequelize
    let migration: Umzug<any>;

    beforeEach(async () => {
         sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: true,
            sync: { force: true }
        })

        sequelize.addModels([
            OrderModel, OrderItemModel, CheckoutClientModel, CheckoutProductModel,
            ClientModel, ProductModel])

        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        await sequelize.close()
    })


    it("should create an order", async () => {

        const repository = new CheckoutRepository()

        const client = await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "client@client.com",
            document: "123456789",
            street: "address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "011234-567",
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const product1 = await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            purchasePrice: 10,
            stock: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product2 = await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            purchasePrice: 20,
            stock: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const order = new Order({
            id: new Id("1"),
            status: "approved",
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: new Address(
                    client.street,
                    client.number,
                    client.complement,
                    client.city,
                    client.state,
                    client.zipCode
                ),
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            products: [
                new Product({
                    id: new Id(product1.id),
                    name: product1.name,
                    description: product1.description,
                    salesPrice: product1.purchasePrice,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
                new Product({
                    id: new Id(product2.id),
                    name: product2.name,
                    description: product2.description,
                    salesPrice: product2.purchasePrice,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        await repository.addOrder(order)

        const orderDb = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [
                {
                    model: OrderItemModel,
                    include: [CheckoutProductModel]
                },
                CheckoutClientModel]
        })

        expect(orderDb).toBeDefined()
        expect(orderDb.id).toEqual(order.id.id)
        expect(orderDb.status).toEqual(order.status)
        expect(orderDb.client.id).toEqual(order.client.id.id)
        expect(orderDb.client.name).toEqual(order.client.name)
        expect(orderDb.client.email).toEqual(order.client.email)
        expect(orderDb.client.street).toEqual(order.client.address.street)
        expect(orderDb.client.number).toEqual(order.client.address.number)
        expect(orderDb.client.complement).toEqual(order.client.address.complement)
        expect(orderDb.client.city).toEqual(order.client.address.city)
        expect(orderDb.client.state).toEqual(order.client.address.state)
        expect(orderDb.client.zipCode).toEqual(order.client.address.zipCode)
        expect(orderDb.items.length).toEqual(order.products.length)
        expect(orderDb.items[0].product.id).toEqual(order.products[0].id.id)
        expect(orderDb.items[0].product.name).toEqual(order.products[0].name)
        expect(orderDb.items[0].product.description).toEqual(order.products[0].description)
        expect(orderDb.items[0].salesPrice).toEqual(order.products[0].salesPrice)


    })

    it("should find an order", async () => {

        const client = await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "client@client.com",
            document: "123456789",
            street: "address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "011234-567",
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const product1 = await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            purchasePrice: 10,
            stock: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product2 = await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            purchasePrice: 20,
            stock: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const order = await OrderModel.create({
            id: "1",
            status: "approved",
            clientId: client.id,
            items: [
                {
                    id: "1",
                    product_id: product1.id,
                    salesPrice: product1.purchasePrice
                },
                {
                    id: "2",
                    product_id: product2.id,
                    salesPrice: product2.purchasePrice
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            include: [OrderItemModel]
        })

        const repository = new CheckoutRepository()
        const orderDb = await repository.findOrder(order.id)

        expect(orderDb.id.id).toEqual(order.id)
        expect(orderDb.status).toEqual(order.status)
        expect(orderDb.client.id.id).toEqual(client.id)
        expect(orderDb.client.name).toEqual(client.name)
        expect(orderDb.client.email).toEqual(client.email)
        expect(orderDb.client.address.street).toEqual(client.street)
        expect(orderDb.client.address.number).toEqual(client.number)
        expect(orderDb.client.address.complement).toEqual(client.complement)
        expect(orderDb.client.address.city).toEqual(client.city)
        expect(orderDb.client.address.state).toEqual(client.state)
        expect(orderDb.client.address.zipCode).toEqual(client.zipCode)
        expect(orderDb.products.length).toEqual(order.items.length)
        expect(orderDb.products[0].id.id).toEqual(order.items[0].id)
        expect(orderDb.products[0].name).toEqual(product1.name)
        expect(orderDb.products[0].description).toEqual(product1.description)
        expect(orderDb.products[0].salesPrice).toEqual(product1.purchasePrice)
    })
})