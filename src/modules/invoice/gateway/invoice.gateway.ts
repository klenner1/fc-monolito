import Invoince from "../domain/invoice.entity";

export default interface InvoiceGateway {
    generate(input: Invoince): Promise<void>;
    find (id: string): Promise<Invoince>;
}
