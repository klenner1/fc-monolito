import type { MigrationFn } from 'umzug';
import { DataTypes, QueryInterface } from 'sequelize';


export const up: MigrationFn<QueryInterface> = async (params) => {
    await params.context.createTable('invoices_items', {
        id: {
            //type: DataTypes.UUID,
            //defaultValue: DataTypes.UUIDV4,
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        invoice_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: 'invoices', key: 'id' }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

};
export const down: MigrationFn<QueryInterface> = async params => {
    await params.context.dropTable('invoices_items');
};
