import { Umzug } from "umzug";
import { PlaceOrderInputDto } from "../../../modules/checkout/usecase/place-order/place-order.dto";
import { migrator } from "../../db/config/migrator ";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {

  let migration: Umzug<any>;

  beforeEach(async () => {
    migration = migrator(sequelize);
    //await sequelize.sync({ force: true });
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  /*   afterAll(async () => {
      await sequelize.close();
    }); */

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
    console.log('responseClient', responseClient.statusCode, responseClient.body)

    const responseProduct = await request(app)
      .post("/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });

    const productId = responseProduct.body.id;

    await request(app)
      .patch(`/products/${productId}/sales-price`)
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
    console.log(response.body);
    //assert
    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.InvoiceId).not.toBeNull();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(800);
    expect(response.body.products[0].productId).toBe(productId);
  });

});
