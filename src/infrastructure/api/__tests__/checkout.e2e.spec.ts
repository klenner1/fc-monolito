import { Umzug } from "umzug";
import { PlaceOrderInputDto } from "../../../modules/checkout/usecase/place-order/place-order.dto";
import { migrator } from "../../db/config/migrator ";
import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { CheckoutClientModel } from "../../../modules/checkout/repository/client.model";
import { OrderItemModel } from "../../../modules/checkout/repository/order-item.model";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { CheckoutProductModel } from "../../../modules/checkout/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../../modules/store-catalog/repository/product.model";

describe("E2E test for checkout", () => {

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    });

    sequelize.addModels([ProductModel]);
    sequelize.addModels([ClientModel]);
    sequelize.addModels([StoreCatalogProductModel]);
    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    sequelize.addModels([OrderModel, OrderItemModel, CheckoutClientModel, CheckoutProductModel]);
    sequelize.addModels([TransactionModel]);
    migration = migrator(sequelize);

  });

  beforeEach(async () => {
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
  })


  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a checkout", async () => {
    //arrange
    const bodyClient = {
      name: "Fulano de Tal",
      email: "Fulano@detal.com",
      document: "12345678900",
      description: "Um cliente",
      address: {
        street: "Rua tal",
        number: "123",
        complement: "Complemento",
        city: "Cidade",
        state: "Estado",
        zipCode: "12345678"
      }
    };
    const responseClient = await request(app)
      .post("/clients")
      .send(bodyClient);
    const clientId = responseClient.body.id;

    const responseProduct = await request(app)
      .post("/adm/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });

    const productId = responseProduct.body.id;

    await request(app)
      .patch(`/catalog/products/${productId}/sales-price`)
      .send({
        salesPrice: 800
      });

    //act
    const body: PlaceOrderInputDto = {
      clientId: clientId,
      products: [
        {
          productId: productId
        }
      ]
    };
    const response = await request(app)
      .post("/checkout")
      .send(body);
      
    //assert
    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.InvoiceId).not.toBeNull();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(800);
    expect(response.body.products[0].productId).toBe(productId);
  });

});
