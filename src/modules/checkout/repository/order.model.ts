import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CheckoutClientModel } from "./client.model";
import { OrderItemModel } from "./order-item.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => CheckoutClientModel)
    @Column({ allowNull: false , field: "client_id"})
    declare clientId: string;

    @Column({ allowNull: false })
    declare status: string;

    @Column({ allowNull: false, field: "created_at" })
    declare createdAt: Date;

    @Column({ allowNull: false, field: "updated_at" })
    declare updatedAt: Date;

    @BelongsTo(() => CheckoutClientModel)
    declare client: CheckoutClientModel;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];
}

