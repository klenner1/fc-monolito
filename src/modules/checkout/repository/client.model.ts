import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";


@Table({
    tableName: "clients",
    timestamps: false,
})
export class CheckoutClientModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare email: string;

    @Column({ allowNull: false })
    declare street: string

    @Column({ allowNull: false })
    declare number: string

    @Column({ allowNull: true })
    declare complement: string

    @Column({ allowNull: false })
    declare city: string

    @Column({ allowNull: false })
    declare state: string

    @Column({ allowNull: false, field: "zip_code" })
    declare zipCode: string

    @Column({ allowNull: false, field: "created_at" })
    declare createdAt: Date;

    @Column({ allowNull: false, field: "updated_at" })
    declare updatedAt: Date;
}
