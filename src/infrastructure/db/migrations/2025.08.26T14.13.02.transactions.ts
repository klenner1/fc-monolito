import { DataTypes, QueryInterface } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async params => {
    await params.context.createTable('transactions', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            //references: { model: 'orders', key: 'id' }
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        status: {
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
        }
    });

};
export const down: MigrationFn<QueryInterface> = async params => {
    await params.context.dropTable('transactions');

};
