import type { MigrationFn } from 'umzug';
import { DataTypes, QueryInterface } from 'sequelize';


export const up: MigrationFn<QueryInterface> = async (params) => {
    await params.context.createTable('products', {
        id: {
            //type: DataTypes.UUID,
            //defaultValue: DataTypes.UUIDV4,
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purchasePrice: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        stock: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        salesPrice: {
            type: DataTypes.DECIMAL,
            allowNull: true,
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
    await params.context.dropTable('products');
};
