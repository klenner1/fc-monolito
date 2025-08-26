import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo, } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { CheckoutProductModel } from "./product.model";


@Table({
    tableName: "orders_items",
    timestamps: false,
})
export class OrderItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;

    @ForeignKey(() => CheckoutProductModel)
    @Column({ allowNull: false })
    declare product_id: string;

    @Column({ allowNull: false, field: "sales_price" })
    declare salesPrice: number;
    /* 
        @BelongsTo(() => OrderModel)
        declare order: OrderModel; */

    @BelongsTo(() => CheckoutProductModel)
    declare product: CheckoutProductModel;

}
