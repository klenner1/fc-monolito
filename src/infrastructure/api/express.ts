import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { catalogProductRoute } from "./routes/catalog-product.route";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { CheckoutClientModel } from "../../modules/checkout/repository/client.model";
import { CheckoutProductModel } from "../../modules/checkout/repository/product.model";
import { OrderItemModel } from '../../modules/checkout/repository/order-item.model';
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { admProductRoute } from "./routes/adm-product.route";
import { migrator } from "../db/config/migrator ";


export const app: Express = express();
app.use(express.json());
app.use("/adm/products", admProductRoute);
app.use("/catalog/products", catalogProductRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: console.log,
  });
  sequelize.addModels([ProductModel]);
  sequelize.addModels([ClientModel]);
  sequelize.addModels([StoreCatalogProductModel]);
  sequelize.addModels([InvoiceModel, InvoiceItemModel]);
  sequelize.addModels([OrderModel, OrderItemModel, CheckoutClientModel, CheckoutProductModel]);
  sequelize.addModels([TransactionModel]);

  const migration = migrator(sequelize);
  await migration.up();
}
setupDb();
