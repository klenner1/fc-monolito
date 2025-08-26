import type { MigrationFn } from 'umzug';
import { DataTypes, QueryInterface } from 'sequelize';


export const up: MigrationFn<QueryInterface> = async (params) => {
    await params.context.createTable('orders_items', {
        id: {
            //type: DataTypes.UUID,
            //defaultValue: DataTypes.UUIDV4,
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: 'orders', key: 'id' }
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: 'products', key: 'id' }
        },
        sales_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    });

};
export const down: MigrationFn<QueryInterface> = async params => {
    await params.context.dropTable('orders_items');
};
