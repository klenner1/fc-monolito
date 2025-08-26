import { DataTypes, QueryInterface } from 'sequelize';
import type { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async params => {
    await params.context.createTable('clients', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        document: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        complement: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        zip_code: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
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
    await params.context.dropTable('clients');

};
