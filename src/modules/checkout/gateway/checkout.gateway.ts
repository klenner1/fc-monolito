import Order from "../domain/order.entity";

export default interface CheckoutGateway {
    addOrder(input: Order): Promise<void>;
    findOrder(id: string): Promise<Order | null>;
}