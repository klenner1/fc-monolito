import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import CheckoutGateway from "../gateway/checkout.gateway"
import { CheckoutClientModel } from "./client.model"
import { OrderItemModel } from "./order-item.model"
import { OrderModel } from "./order.model"
import { CheckoutProductModel } from "./product.model"


export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(input: Order): Promise<void> {
        const model = {
            id: input.id.id,
            clientId: input.client.id.id,
            status: input.status,
            items: input.products.map(product => ({
                id: new Id().id,
                product_id: product.id.id,
                salesPrice: product.salesPrice,
            })),
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        };
        await OrderModel.create(model, {
            include: [OrderItemModel]
        })
    }

    async findOrder(id: string): Promise<Order | null> {

        const invoice = await OrderModel.findOne({
            where: { id },
            include: [
                {
                    model: OrderItemModel,
                    include: [CheckoutProductModel]
                },
                CheckoutClientModel]
        })

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return new Order({
            id: new Id(invoice.id),
            status: invoice.status,
            client: new Client({
                id: new Id(invoice.client.id),
                name: invoice.client.name,
                email: invoice.client.email,
                address: new Address(
                    invoice.client.street,
                    invoice.client.number,
                    invoice.client.complement,
                    invoice.client.city,
                    invoice.client.state,
                    invoice.client.zipCode,
                ),
                createdAt: invoice.client.createdAt,
                updatedAt: invoice.client.updatedAt
            }),
            products: invoice.items.map(item => new Product({
                id: new Id(item.id),
                name: item.product.name,
                description: item.product.description,
                salesPrice: item.salesPrice,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.createdAt
        })
    }
}