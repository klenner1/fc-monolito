import type { MigrationFn } from 'umzug';
import { DataTypes, QueryInterface } from 'sequelize';


export const up: MigrationFn<QueryInterface> = async (params) => {
    await params.context.createTable('orders', {
        id: {
            //type: DataTypes.UUID,
            //defaultValue: DataTypes.UUIDV4,
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        client_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
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
    await params.context.dropTable('orders');
};
