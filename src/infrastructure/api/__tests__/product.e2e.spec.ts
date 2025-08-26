import { Umzug } from "umzug";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../db/config/migrator ";

describe("E2E test for product", () => {
  let migration: Umzug<any>;

  beforeEach(async () => {
    migration = migrator(sequelize);
    await migration.up();
  });

  afterAll(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })


  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });
      
    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Car");
    expect(response.body.purchasePrice).toBe(500);
  });

  it("should update sales-price from product", async () => {
    //arrange
    const responseCreate = await request(app)
      .post("/products")
      .send({
        name: "Car",
        description: "A nice car",
        purchasePrice: 500,
        stock: 50
      });

    //act
    const response = await request(app)
      .patch(`/products/${responseCreate.body.id}/sales-price`)
      .send({
        salesPrice: 1500
      });
    console.log('response', response);
    console.log('response', response.body, response.statusCode);
    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.name).toBe("Car");
    expect(response.body.salesPrice).toBe(1500);
  });

});
